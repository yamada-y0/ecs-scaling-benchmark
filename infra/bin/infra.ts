#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AppStack } from "../lib/app-stack";
import { SecurityStack } from "../lib/security-stack";
import { NetworkStack } from "../lib/network-stack";
import { EcrStack } from "../lib/ecr-stack";
import { RdsStack } from "../lib/rds-stack";

const app = new cdk.App();

new SecurityStack(app, "SecurityStack");

const network = new NetworkStack(app, "NetworkStack");

const ecr = new EcrStack(app, "EcrStack", {
    appName: "quarkus",
});

const rds = new RdsStack(app, "RdsStack", {
    vpc: network.vpc,
});

new AppStack(app, "AppStack", {
    appName: "quarkus",
    vpc: network.vpc,
    repository: ecr.repository,
    secret: rds.secret,
});
