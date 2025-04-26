import * as cdk from "aws-cdk-lib";
import { StackProps } from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";

export interface AppStackProps extends StackProps {
    appName: string;
    vpc: ec2.IVpc;
    repository: ecr.IRepository;
}

export class AppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AppStackProps) {
        super(scope, id, props);

        const cluster = new ecs.Cluster(this, "EcsCluster", {
            vpc: props.vpc,
            clusterName: `${props.appName}-cluster`,
        });
        const healthPath = "/health";
        const fargateService =
            new ecs_patterns.ApplicationLoadBalancedFargateService(
                this,
                "FargateService",
                {
                    cluster: cluster,
                    cpu: 256,
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
                    },
                    memoryLimitMiB: 512,
                    publicLoadBalancer: false,
                },
            );
        fargateService.targetGroup.configureHealthCheck({
            path: healthPath,
            healthyHttpCodes: "200",
        });
    }
}
