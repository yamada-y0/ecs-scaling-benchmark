import * as cdk from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class SecurityStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const provider = new iam.OpenIdConnectProvider(this, "GitHubOIDC", {
            url: "https://token.actions.githubusercontent.com",
            clientIds: ["sts.amazonaws.com"],
        });
        const role = new iam.Role(this, "GitHubActionsRole", {
            roleName: "GitHubActionsRole",
            maxSessionDuration: Duration.hours(2),
            assumedBy: new iam.WebIdentityPrincipal(
                provider.openIdConnectProviderArn,
                {
                    StringEquals: {
                        "token.actions.githubusercontent.com:aud":
                            "sts.amazonaws.com",
                    },
                    StringLike: {
                        "token.actions.githubusercontent.com:sub": `repo:yamada-y0/ecs-scaling-benchmark:*`,
                    },
                },
            ),
        });
        role.addManagedPolicy(
            iam.ManagedPolicy.fromAwsManagedPolicyName(
                "AmazonEC2ContainerRegistryPowerUser",
            ),
        );
    }
}
