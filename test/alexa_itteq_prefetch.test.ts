import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as AlexaItteqPrefetch from '../lib/alexa_itteq_prefetch-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new AlexaItteqPrefetch.AlexaItteqPrefetchStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
