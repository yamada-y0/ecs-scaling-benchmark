import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as App from "../lib/app-stack";
import * as Network from "../lib/network-stack";
import * as Ecr from "../lib/ecr-stack";

describe("AppStack Test", () => {
    test("Snapshot Test", () => {
        const app = new cdk.App();
        // WHEN
        const networkStack = new Network.NetworkStack(app, "NetworkTestStack");
        const ecrStack = new Ecr.EcrStack(app, "EcrTestStack", {
            appName: "quarkus-app",
        });
        const appStack = new App.AppStack(app, "AppTestStack", {
            appName: "quarkus",
            vpc: networkStack.vpc,
            repository: ecrStack.repository,
        });

        // THEN
        const template = Template.fromStack(appStack);
        expect(template.toJSON()).toMatchSnapshot();
    });

    test("Application Resources Created", () => {
        const app = new cdk.App();
        // WHEN
        const networkStack = new Network.NetworkStack(app, "NetworkTestStack");
        const ecrStack = new Ecr.EcrStack(app, "EcrTestStack", {
            appName: "quarkus-app",
        });
        const appStack = new App.AppStack(app, "AppTestStack", {
            appName: "quarkus",
            vpc: networkStack.vpc,
            repository: ecrStack.repository,
        });

        // THEN
        const template = Template.fromStack(appStack);

        template.hasResourceProperties("AWS::ECS::Cluster", {
            ClusterName: "quarkus-cluster",
        });
        template.hasResourceProperties("AWS::ECS::Service", {
            DesiredCount: 1,
        });
        template.hasResourceProperties("AWS::ECS::TaskDefinition", {
            ContainerDefinitions: [
                {
                    PortMappings: [
                        {
                            ContainerPort: 8080,
                        },
                    ],
                },
            ],
        });
    });
});
