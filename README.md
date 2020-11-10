# CEM AWS Demo 01

This project makes use of AWS CDK to spin up an AWS environment with Admin & Shadwow Admin users, groups & roles, together with a Fargate app service 

## What resources will be created?
- Standard Demo
   - 4 Users (Mike, John, Robert & YOURSELF) will be created
   - 2 Groups (Developers & Admins)
   - 1 IAM Role

- Custom Resources
   - Admin Role
   - Admin User
   - Admin Group
   - Shadow Admin Role
   - Shadow Admin User
   - Shadow Admin Group 

- Demo Fargate App (Optional)
   - VPC
   - ECS Cluster
   - Fargate all with LB
   - Leverage Admin role for its role

## Prerequisite
1. Install [AWS CLI Client](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
2. Install [AWS Cloud Development Kit](https://aws.amazon.com/cdk/)
3. Create a pair of access-key & secret key if you don't have one
4. Set the AWS region of your AWS env by execute `aws configure` and pick a region for your demo
```
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: json
```


## To Get Started
1. Download this repo
2. In the root folder of the repo, execute `npm i -D @types/node typescript ts-node` to download the dependancies.   
   It is required to be done once and takes about 5 mins.
3. Review `lib\cem-aws-demo-01-stack.ts`, review & update the configuration section
   The varaibles should be self-explanatory.
```
    /**
     * Configuration
     */ 
    // General Settings
    const STACK_NAME = "AP-"; // Consider the stack name is the prefix of the resource names

    // Standard Demo Setup
    const DEMO_USER_ROBERT = "Robert";
    const DEMO_USER_MIKE = "Mike";
    const DEMO_USER_JOHN = "John";
    const DEMO_USER_YOURSELF = "YOURSELF";  //Change it to your own name
    const DEMO_GROUP_DEVELOPERS = "Developers";
    const DEMO_GROUP_ADMINS = "Admins";
    const DEMO_IAM_ROLE = "AWS-ServiceRole-ECSFullAccess";
    const DEMO_IDP_ROLE = "AWS-IDP-AdminAccess-Role";

    // Custom Roles, Users & Groups
    const ADMIN_ROLE_NAME = "MyAdminRole";
    const ADMIN_USER_NAME = "MyAdminUser";
    const ADMIN_GROUP_NAME = "MyAdminGroup";
    const ADMIN_POLICY_NAME = "MyAdminPolicy";

    const SHADOW_ROLE_NAME = "MyShadowRole";
    const SHADOW_USER_NAME = "MyShadowUser";
    const SHADOW_GROUP_NAME = "MyShadowGroup";
    const SHADOW_POLICY_NAME = "MyShadowPolicy";

    // Demo Fargate App
    const IS_DEPLOY_FARGATE_APP = false; //Set to true to deploy demo Fargate app; default to false to save spin-up time & resources
    const APP_VPC = "MyVPC";
    const APP_CLUSTER = "MyCluster";
    const APP_FARGATE_SERVICE = "MyFargateService";
    const APP_IMAGE_NAME = "amazon/amazon-ecs-sample";

```
4. Execute `cdk synth` to verify & emits the synthesized CloudFormation template
5. Execute `cdk deploy` to spin up the environment, it'll take about 3-10 mins, depends on the selected configuration

## Clean up
Execute `cdk destroy` to remove the demo environment on AWS.   
