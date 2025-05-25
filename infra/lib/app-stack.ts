import * as cdk from "aws-cdk-lib";
import { StackProps } from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import { ContainerInsights } from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as secretManager from "aws-cdk-lib/aws-secretsmanager";

export interface AppStackProps extends StackProps {
    appName: string;
    vpc: ec2.IVpc;
    repository: ecr.IRepository;
    secret: secretManager.ISecret;
}

export class AppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AppStackProps) {
        super(scope, id, props);

        const cluster = new ecs.Cluster(this, "EcsCluster", {
            vpc: props.vpc,
            clusterName: `${props.appName}-cluster`,
            containerInsightsV2: ContainerInsights.ENABLED,
        });
        const healthPath = "/health";
        const fargateService =
            new ecs_patterns.ApplicationLoadBalancedFargateService(
                this,
                "FargateService",
                {
                    cluster: cluster,
                    cpu: 1024,
                    desiredCount: 1,
                    healthCheck: {
                        command: [
                            "CMD-SHELL",
                            `curl -f http://localhost:8080${healthPath} || exit 1`,
                        ],
                    },
                    taskImageOptions: {
                        image: ecs.ContainerImage.fromEcrRepository(
                            props.repository,
                            "1.0-SNAPSHOT",
                        ),
                        containerPort: 8080,
                        enableLogging: true,
                        secrets: this.rdsSecrets(props.secret),
                    },
                    memoryLimitMiB: 2048,
                    publicLoadBalancer: false,
                },
            );
        fargateService.targetGroup.configureHealthCheck({
            path: healthPath,
            healthyHttpCodes: "200",
        });

        const scalableTarget = fargateService.service.autoScaleTaskCount({
            minCapacity: 1,
            maxCapacity: 10,
        });

        scalableTarget.scaleOnCpuUtilization("CpuScaling", {
            targetUtilizationPercent: 70,
            scaleInCooldown: cdk.Duration.seconds(60),
            scaleOutCooldown: cdk.Duration.seconds(60),
        });
    }

    private rdsSecrets(secret: secretManager.ISecret): {
        [key: string]: ecs.Secret;
    } {
        return {
            DB_PASSWORD: ecs.Secret.fromSecretsManager(secret, "password"),
            DB_USERNAME: ecs.Secret.fromSecretsManager(secret, "username"),
            DB_HOST: ecs.Secret.fromSecretsManager(secret, "host"),
            DB_PORT: ecs.Secret.fromSecretsManager(secret, "port"),
            DB_NAME: ecs.Secret.fromSecretsManager(secret, "dbname"),
        };
    }
}
