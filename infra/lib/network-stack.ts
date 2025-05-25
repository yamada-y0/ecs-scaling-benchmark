import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3assets from "aws-cdk-lib/aws-s3-assets";
import * as path from "path";

export class NetworkStack extends cdk.Stack {
    public readonly vpc: ec2.IVpc;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.vpc = new ec2.Vpc(this, "VPC", {
            ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: "Isolated",
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                },
            ],
            maxAzs: 2,
        });

        this.createVpcEndpoints();

        this.createBastionInstance();
    }

    private createBastionInstance() {
        const role = new iam.Role(this, "BastionRole", {
            assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    "AmazonSSMManagedInstanceCore",
                ),
            ],
        });

        new iam.InstanceProfile(this, "BastionInstanceProfile", {
            role: role,
            instanceProfileName: "BastionInstanceProfile",
        });

        const internalAccessSg = new ec2.SecurityGroup(
            this,
            "InternalAccessSG",
            {
                vpc: this.vpc,
                description: "Allow all traffic within the VPC",
                allowAllOutbound: true,
            },
        );
        internalAccessSg.addIngressRule(
            ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
            ec2.Port.allTraffic(),
            "Allow all traffic from within the VPC",
        );

        const k6RpmAsset = new s3assets.Asset(this, "K6Rpm", {
            path: path.join(__dirname, "assets/k6-0.50.0-1.x86_64.rpm"),
        });
        k6RpmAsset.grantRead(role);

        const testFileAsset = new s3assets.Asset(this, "TestFile", {
            path: path.join(__dirname, "assets/load-test.js"),
        });
        testFileAsset.grantRead(role);

        const instance = new ec2.Instance(this, "bastion", {
            vpc: this.vpc,
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T2,
                ec2.InstanceSize.MICRO,
            ),
            machineImage: ec2.MachineImage.latestAmazonLinux2023(),
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
            role: role,
            securityGroup: internalAccessSg,
        });

        instance.userData.addCommands(
            "sudo yum update -y",
            `aws s3 cp ${k6RpmAsset.s3ObjectUrl} /tmp/k6.rpm`,
            `sudo aws s3 cp ${testFileAsset.s3ObjectUrl} /home/ssm-user/load-test.js`,
            "sudo yum install -y /tmp/k6.rpm",
        );
    }

    private createVpcEndpoints() {
        new ec2.InterfaceVpcEndpoint(this, "EcrApiEndpoint", {
            vpc: this.vpc,
            service: ec2.InterfaceVpcEndpointAwsService.ECR,
        });
        new ec2.InterfaceVpcEndpoint(this, "EcrDockerEndpoint", {
            vpc: this.vpc,
            service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
        });
        new ec2.InterfaceVpcEndpoint(this, "CloudWatchLogsEndpoint", {
            vpc: this.vpc,
            service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
        });
        new ec2.InterfaceVpcEndpoint(this, "SSMEndpoint", {
            vpc: this.vpc,
            service: ec2.InterfaceVpcEndpointAwsService.SSM,
        });
        new ec2.InterfaceVpcEndpoint(this, "SSMMessagesEndpoint", {
            vpc: this.vpc,
            service: ec2.InterfaceVpcEndpointAwsService.SSM_MESSAGES,
        });
        new ec2.InterfaceVpcEndpoint(this, "EC2MessagesEndpoint", {
            vpc: this.vpc,
            service: ec2.InterfaceVpcEndpointAwsService.EC2_MESSAGES,
        });
        new ec2.GatewayVpcEndpoint(this, "S3Endpoint", {
            vpc: this.vpc,
            service: ec2.GatewayVpcEndpointAwsService.S3,
        });
        new ec2.InterfaceVpcEndpoint(this, "SecretsManagerEndpoint", {
            vpc: this.vpc,
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
        });
    }
}
