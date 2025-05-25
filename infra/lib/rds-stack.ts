import * as cdk from "aws-cdk-lib";
import { StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretManager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export interface RdsStackProps extends StackProps {
    vpc: ec2.IVpc;
}

export class RdsStack extends cdk.Stack {
    public readonly instance: rds.IDatabaseInstance;
    public readonly secret: secretManager.ISecret;

    constructor(scope: Construct, id: string, props: RdsStackProps) {
        super(scope, id, props);

        const sgRds = new ec2.SecurityGroup(this, "RdsSecurityGroup", {
            vpc: props.vpc,
            description: "Allow database access",
            allowAllOutbound: true,
        });
        sgRds.addIngressRule(
            ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
            ec2.Port.tcp(5432),
        );
        const instance = new rds.DatabaseInstance(this, "Database", {
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
            networkType: rds.NetworkType.IPV4,
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T4G,
                ec2.InstanceSize.MICRO,
            ),
            engine: rds.DatabaseInstanceEngine.postgres({
                version: rds.PostgresEngineVersion.VER_17,
            }),
            credentials: rds.Credentials.fromGeneratedSecret("rds_user"),
            databaseName: "MyDatabase",
            allocatedStorage: 20,
            maxAllocatedStorage: 100,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            securityGroups: [sgRds],
        });
        this.instance = instance;
        this.secret = instance.secret!;
    }
}
