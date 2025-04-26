import * as cdk from "aws-cdk-lib";
import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";

export interface EcrStackProps extends StackProps {
    appName: string;
}

export class EcrStack extends cdk.Stack {
    public readonly repository: ecr.IRepository;

    constructor(scope: Construct, id: string, props: EcrStackProps) {
        super(scope, id, props);

        this.repository = new ecr.Repository(this, "EcrRepository", {
            repositoryName: `${props.appName}-app`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            emptyOnDelete: true,
        });
    }
}
