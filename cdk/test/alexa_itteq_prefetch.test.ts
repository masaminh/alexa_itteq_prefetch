import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as AlexaItteqPrefetch from '../lib/alexa_itteq_prefetch-stack';

describe('CDK Stack', () => {
  it('Resources', () => {
    const app = new cdk.App();
    const stack = new AlexaItteqPrefetch.AlexaItteqPrefetchStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {});
  });
});
