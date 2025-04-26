#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AppStack } from "../lib/app-stack";
import { SecurityStack } from "../lib/security-stack";
import { NetworkStack } from "../lib/network-stack";
import { EcrStack } from "../lib/ecr-stack";

const app = new cdk.App();

new SecurityStack(app, "SecurityStack");

const network = new NetworkStack(app, "NetworkStack");

const ecr = new EcrStack(app, "EcrStack", {
    appName: "quarkus",
});

new AppStack(app, "AppStack", {
    appName: "quarkus",
    vpc: network.vpc,
    repository: ecr.repository,
});
