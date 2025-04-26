import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as Security from "../lib/security-stack";

describe("SecurityStack Test", () => {
    test("Snapshot Test", () => {
        const app = new cdk.App();
        // WHEN
        const stack = new Security.SecurityStack(app, "SecurityTestStack");

        // THEN
        const template = Template.fromStack(stack);
        expect(template.toJSON()).toMatchSnapshot();
    });

    test("IAM Role Created", () => {
        const app = new cdk.App();
        // WHEN
        const stack = new Security.SecurityStack(app, "SecurityTestStack");

        // THEN
        const template = Template.fromStack(stack);

        template.hasResourceProperties("AWS::IAM::Role", {
            RoleName: "GitHubActionsRole",
            MaxSessionDuration: 7200,
        });
    });
});
