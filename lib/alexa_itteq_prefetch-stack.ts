import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';
import * as ssm from '@aws-cdk/aws-ssm';
import * as s3 from '@aws-cdk/aws-s3';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';

export class AlexaItteqPrefetchStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName = 'AlexaItteqPrefetch';
    const stage = this.node.tryGetContext('stage');
    const getParameter = (parameterName: string): string => {
      const parameterPath = `/${stage}/${appName}/${parameterName}`;
      return ssm.StringParameter.valueForStringParameter(this, parameterPath);
    }
    const chromeAwsLambdaArn = getParameter('ChromeAwsLambdaArn');
    const speechTextBucket = getParameter('SpeechTextBucket');
    const speechTextKey = getParameter('SpeechTextKey');

    const func = new lambdaNodejs.NodejsFunction(this, 'func', {
      memorySize: 512,
      timeout: cdk.Duration.seconds(60),
      environment: { SPEECH_TEXT_BUCKET: speechTextBucket, SPEECH_TEXT_KEY: speechTextKey },
      tracing: lambda.Tracing.ACTIVE,
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(this, 'layerVersion', chromeAwsLambdaArn),
      ],
      bundling: {
        externalModules: ['aws-sdk', 'puppeteer-core', 'chrome-aws-lambda'],
      },
    });

    new events.Rule(this, 'rule', {
      schedule: events.Schedule.rate(cdk.Duration.hours(1)),
      targets: [new targets.LambdaFunction(func)],
    });

    s3.Bucket.fromBucketName(this, 'bucket', speechTextBucket).grantPut(func);
  }
}
