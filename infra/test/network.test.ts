import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as Network from "../lib/network-stack";

describe("NetworkStack Test", () => {
    test("Snapshot Test", () => {
        const app = new cdk.App();
        // WHEN
        const stack = new Network.NetworkStack(app, "NetworkTestStack");

        // THEN
        const template = Template.fromStack(stack);
        expect(template.toJSON()).toMatchSnapshot();
    });
});
