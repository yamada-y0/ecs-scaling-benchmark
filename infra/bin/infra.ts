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

const quarkusNativeEcr = new EcrStack(app, "QuarkusNativeEcrStack", {
    appName: "quarkus-native",
});

const quarkusJvmEcr = new EcrStack(app, "QuarkusJvmEcrStack", {
    appName: "quarkus-jvm",
});

const springEcr = new EcrStack(app, "SpringEcrStack", {
    appName: "spring",
});

const rds = new RdsStack(app, "RdsStack", {
    vpc: network.vpc,
});

new AppStack(app, "QuarkusNativeAppStack", {
    appName: "quarkus-native",
    vpc: network.vpc,
    repository: quarkusNativeEcr.repository,
    secret: rds.secret,
});

new AppStack(app, "QuarkusJvmAppStack", {
    appName: "quarkus-jvm",
    vpc: network.vpc,
    repository: quarkusJvmEcr.repository,
    secret: rds.secret,
});

new AppStack(app, "SpringAppStack", {
    appName: "spring",
    vpc: network.vpc,
    repository: springEcr.repository,
    secret: rds.secret,
});
