# CEM AWS Demo 01

This project makes use of AWS CDK to spin up an AWS environment with Admin & Shadwow Admin users, groups & roles, together with a Fargate app service 

## Prerequisite
1. Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
2. Install [AWS CDK](https://aws.amazon.com/cdk/)
3. Create a pair of access-key & secret key if you don't have one
4. Setup AWS CLI by execute `aws configure`
```
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: json
```


## To Get Started
1. Download this repo
2. Review `lib\cem-aws-demo-01-stack.ts`, review & update the configuration section
   The varaibles should be self-explanatory.
```
    // Configuration (start)
    const ADMIN_ROLE_NAME = "MyAdminRole";
    const ADMIN_USER_NAME = "MyAdminUser";
    const ADMIN_GROUP_NAME = "MyAdminGroup";
    const ADMIN_POLICY_NAME = "MyAdminPolicy";

    const SHADOW_ROLE_NAME = "MyShadowRole";
    const SHADOW_USER_NAME = "MyShadowUser";
    const SHADOW_GROUP_NAME = "MyShadowGroup";
    const SHADOW_POLICY_NAME = "MyShadowPolicy";

    const APP_VPC = "MyVPC";
    const APP_CLUSTER = "MyCluster";
    const APP_FARGATE_SERVICE_WITH_ADMIN_ROLE = "MyFargateServiceAsAdmin";
    const APP_FARGATE_SERVICE_WITH_SHADOW_ROLE = "MyFargateServiceAsShadow";
    const APP_IMAGE_NAME = "amazon/amazon-ecs-sample";
    // Configuration (end)
```
3. Execute `cdk synth` to verify & emits the synthesized CloudFormation template
4. Execute `cdk deploy` to spin up the environment, it'll take about 5-10 mins

## After the Demo
Execute `cdk destroy` to remove the demo environment on AWS.   It'll take about 15 mins
