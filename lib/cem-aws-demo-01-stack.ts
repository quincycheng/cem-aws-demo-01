/**
 *   This script will create Admin & Shadow Admin users, roles, groups, and also spin up a fargate service with admin task
 */
import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as iam from "@aws-cdk/aws-iam";

export class CemAwsDemo01Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

    // let's create some entities with ADMIN privilege
    const adminRole = new iam.Role(this, ADMIN_ROLE_NAME, {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    const adminPolicyStatement = new iam.PolicyStatement({
      resources: ['*'],
      actions: ['*'],
    })
    adminRole.addToPolicy(adminPolicyStatement);

    const adminUser = new iam.User(this, ADMIN_USER_NAME);
    const adminGroup = new iam.Group(this, ADMIN_GROUP_NAME);

    const adminPolicy = new iam.Policy(this, ADMIN_POLICY_NAME);
    adminPolicy.addStatements(
      adminPolicyStatement
    );

    adminPolicy.attachToUser(adminUser);
    adminGroup.attachInlinePolicy(adminPolicy);

    // let's create some entities with SHADOW ADMIN privilege
    const shadowRole = new iam.Role(this, SHADOW_ROLE_NAME, {
      assumedBy: new iam.ServicePrincipal('iam.amazonaws.com'),
    });

    const shadowPolicyStatement = new iam.PolicyStatement({
      resources: ['*'],
      actions: ['iam:CreateAccessKey', 
        'cloudformation:createstack',
        "iam:getloginprofile",
        "iam:getuser",
        "iam:getrole",
        "logs:getqueryresults",
        "sts:getcalleridentity",
        "eks:describecluster"
      ],
    })

    shadowRole.addToPolicy(shadowPolicyStatement);

    const shadowUser = new iam.User(this, SHADOW_USER_NAME);
    const shadowGroup = new iam.Group(this, SHADOW_GROUP_NAME);
    const shadowPolicy = new iam.Policy(this, SHADOW_POLICY_NAME);

    shadowPolicy.addStatements(shadowPolicyStatement);
    shadowPolicy.attachToUser(shadowUser);
    shadowGroup.attachInlinePolicy(shadowPolicy);

    // Now let's setup the env for the app
    const vpc = new ec2.Vpc(this, APP_VPC, {
      maxAzs: 3 // Default is all AZs in region
    });
    const cluster = new ecs.Cluster(this, APP_CLUSTER, {
      vpc: vpc
    });

    // Create a load-balanced Fargate service with ADMIN privileges and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, APP_FARGATE_SERVICE_WITH_ADMIN_ROLE, {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: 2, // Default is 1
      taskImageOptions: { 
        image: ecs.ContainerImage.fromRegistry(APP_IMAGE_NAME),
        taskRole: adminRole, 
      },
      memoryLimitMiB: 512, // Default is 512
      publicLoadBalancer: true // Default is false
    });
  }
}
