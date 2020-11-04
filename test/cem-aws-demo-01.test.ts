import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CemAwsDemo01 from '../lib/cem-aws-demo-01-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CemAwsDemo01.CemAwsDemo01Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
