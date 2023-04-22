import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class AlexaItteqPrefetchStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName = 'AlexaItteqPrefetch';
    const stage = this.node.tryGetContext('stage');
    const getParameter = (parameterName: string): string => {
      const parameterPath = `/${stage}/${appName}/${parameterName}`;
      return ssm.StringParameter.valueForStringParameter(this, parameterPath);
    }

    const speechTextBucket = getParameter('SpeechTextBucket');
    const speechTextKey = getParameter('SpeechTextKey');

    const func = new lambda.DockerImageFunction(this, 'func', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../../lambda')),
      memorySize: 512,
      timeout: cdk.Duration.seconds(60),
      environment: { SPEECH_TEXT_BUCKET: speechTextBucket, SPEECH_TEXT_KEY: speechTextKey },
      tracing: lambda.Tracing.ACTIVE,
    });

    new events.Rule(this, 'rule', {
      schedule: events.Schedule.rate(cdk.Duration.hours(1)),
      targets: [new targets.LambdaFunction(func)],
    });

    s3.Bucket.fromBucketName(this, 'bucket', speechTextBucket).grantPut(func);
  }
}
