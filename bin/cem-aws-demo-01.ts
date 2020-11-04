#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CemAwsDemo01Stack } from '../lib/cem-aws-demo-01-stack';

const app = new cdk.App();
new CemAwsDemo01Stack(app, 'CemAwsDemo01Stack');
