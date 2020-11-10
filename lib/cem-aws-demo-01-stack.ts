/**
 *   This script will create Admin & Shadow Admin users, roles, groups, and also spin up a fargate service with admin task
 */
import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";


export class CemAwsDemo01Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {

    /**
     * Configuration
     */ 
    // General Settings
    const STACK_NAME = "AP-"; // Consider the stack name is the prefix of the resource names

    // Standard Demo Setup
    const DEMO_USER_ROBERT = "Robert--";
    const DEMO_USER_MIKE = "Mike_";
    const DEMO_USER_JOHN = "John_";
    const DEMO_USER_YOURSELF = "YOURSELF_";  //Change it to your own name
    const DEMO_GROUP_DEVELOPERS = "Developers_";
    const DEMO_GROUP_ADMINS = "Admins_";
    const DEMO_IAM_ROLE = "AWS-ServiceRole-ECSFullAccess-";
    const DEMO_S3_BUCKET = "MyS3Bucket-";
    const DEMO_IDP_ROLE = "AWS-IDP-AdminAccess-Role-";
    const DEMO_S3_POLICY = "S3_BucketAccess_Policy-";

    // Custom Roles, Users & Groups
    const ADMIN_ROLE_NAME = "MyAdminRole-";
    const ADMIN_USER_NAME = "MyAdminUser-";
    const ADMIN_GROUP_NAME = "MyAdminGroup-";
    const ADMIN_POLICY_NAME = "MyAdminPolicy-";

    const SHADOW_ROLE_NAME = "MyShadowRole-";
    const SHADOW_USER_NAME = "MyShadowUser-";
    const SHADOW_GROUP_NAME = "MyShadowGroup-";
    const SHADOW_POLICY_NAME = "MyShadowPolicy-";

    // Demo Fargate App
    const IS_DEPLOY_FARGATE_APP = false; //Set to true to deploy demo Fargate app; default to false to save spin-up time & resources
    const APP_VPC = "MyVPC-";
    const APP_CLUSTER = "MyCluster-";
    const APP_FARGATE_SERVICE = "MyFargateService-";
    const APP_IMAGE_NAME = "amazon/amazon-ecs-sample";

    // end of configuration

    
    /**
     * Start of Logic, please don't edit the lines below
     */
    super(scope, STACK_NAME, props);

    /**
     * Standard Demo
     */
    // Create Users
    const mike = new iam.User(this, DEMO_USER_MIKE);
    const robert = new iam.User(this, DEMO_USER_ROBERT);
    const john = new iam.User(this, DEMO_USER_JOHN);
    const yourself = new iam.User(this, DEMO_USER_YOURSELF);
    
    // Add Mike to AdministratorAccess
    mike.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"));

    // Add John to AmazonEC2FullAccess
    john.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2FullAccess"));

    // Add Robert to AmazonRDSFullAccess, AmazonEC2FullAccess, AmazonS3FullAccess
    robert.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonRDSFullAccess"));
    robert.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2FullAccess"));
    robert.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"));

    // Yourself - any combination? let's do all of them!
    yourself.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"));
    yourself.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2FullAccess"));
    yourself.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonRDSFullAccess"));
    yourself.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"));
    
    // Create Groups 
    const developers = new iam.Group(this, DEMO_GROUP_DEVELOPERS);
    const admins = new iam.Group(this, DEMO_GROUP_ADMINS);

    // The developer group will have access to S3, RDS, EC2 plus IAM 
    developers.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"));
    developers.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("IAMFullAccess"));
    developers.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonRDSFullAccess"));
    developers.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2FullAccess"));

    // Add Robert to Developer group
    developers.addUser(robert);

    // Assign the AdministratorAccess policy to the Admins Group
    admins.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"));

    // Create IAM role
    const iamRole = new iam.Role(this, DEMO_IAM_ROLE, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      description: "Allows EC2 instances to call AWS services on your behalf."
    });
    iamRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2FullAccess"));
    
    // Create S3 Bucket
    const s3Bucket = new s3.Bucket(this, DEMO_S3_BUCKET);
    
    // Create Policy for S3 Bucket
    const s3PolicyStatement = new iam.PolicyStatement({
      resources: [s3Bucket.arnForObjects('*')],
      actions: [                
        "s3:PutAnalyticsConfiguration",
        "s3:GetObjectVersionTagging",
        "s3:DeleteAccessPoint",
        "s3:CreateBucket",
        "s3:ReplicateObject",
        "s3:GetObjectAcl",
        "s3:GetBucketObjectLockConfiguration",
        "s3:DeleteBucketWebsite",
        "s3:PutLifecycleConfiguration",
        "s3:GetObjectVersionAcl",
        "s3:DeleteObject",
        "s3:GetBucketPolicyStatus",
        "s3:GetObjectRetention",
        "s3:GetBucketWebsite",
        "s3:GetJobTagging",
        "s3:PutReplicationConfiguration",
        "s3:PutObjectLegalHold",
        "s3:GetObjectLegalHold",
        "s3:GetBucketNotification",
        "s3:PutBucketCORS",
        "s3:GetReplicationConfiguration",
        "s3:ListMultipartUploadParts",
        "s3:PutObject",
        "s3:GetObject",
        "s3:PutBucketNotification",
        "s3:DescribeJob",
        "s3:PutBucketLogging",
        "s3:GetAnalyticsConfiguration",
        "s3:PutBucketObjectLockConfiguration",
        "s3:GetObjectVersionForReplication",
        "s3:CreateAccessPoint",
        "s3:GetLifecycleConfiguration",
        "s3:GetInventoryConfiguration",
        "s3:GetBucketTagging",
        "s3:PutAccelerateConfiguration",
        "s3:DeleteObjectVersion",
        "s3:GetBucketLogging",
        "s3:ListBucketVersions",
        "s3:RestoreObject",
        "s3:ListBucket",
        "s3:GetAccelerateConfiguration",
        "s3:GetBucketPolicy",
        "s3:PutEncryptionConfiguration",
        "s3:GetEncryptionConfiguration",
        "s3:GetObjectVersionTorrent",
        "s3:AbortMultipartUpload",
        "s3:GetBucketRequestPayment",
        "s3:DeleteBucketOwnershipControls",
        "s3:GetAccessPointPolicyStatus",
        "s3:UpdateJobPriority",
        "s3:GetObjectTagging",
        "s3:GetMetricsConfiguration",
        "s3:GetBucketOwnershipControls",
        "s3:DeleteBucket",
        "s3:PutBucketVersioning",
        "s3:GetBucketPublicAccessBlock",
        "s3:ListBucketMultipartUploads",
        "s3:PutMetricsConfiguration",
        "s3:PutBucketOwnershipControls",
        "s3:UpdateJobStatus",
        "s3:GetBucketVersioning",
        "s3:GetBucketAcl",
        "s3:PutInventoryConfiguration",
        "s3:GetObjectTorrent",
        "s3:PutBucketWebsite",
        "s3:PutBucketRequestPayment",
        "s3:PutObjectRetention",
        "s3:GetBucketCORS",
        "s3:GetBucketLocation",
        "s3:GetAccessPointPolicy",
        "s3:ReplicateDelete",
        "s3:GetObjectVersion"
      ],
    })
    /*
    const s3Policy = new iam.Policy(this, DEMO_S3_POLICY, {
      statements: [ s3PolicyStatement ]
    });

    // Create the trust policy
    const trustStatement = new iam.PolicyStatement({
      actions: ["sts:AssumeRole"]
    });
    trustStatement.addServicePrincipal("s3.amazonaws.com");


    const trustPolicy = new iam.Policy(this, "TrustPolicy");
    trustPolicy.addStatements(trustStatement);

    const idpRole = new iam.Role(this, DEMO_IDP_ROLE, {
      assumedBy: new iam.ServicePrincipal("sns.amazonaws.com")
    });

    s3Policy.attachToRole(idpRole);
    trustPolicy.attachToRole(idpRole);
*/


    /**
    * Custom Roles, Users and Groups
    */
    
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

    /**
     * Sample Fargate app
     */
    // Now let's setup the env for the app
    if (IS_DEPLOY_FARGATE_APP) {
      const vpc = new ec2.Vpc(this, APP_VPC, {
        maxAzs: 3 // Default is all AZs in region
      });
      const cluster = new ecs.Cluster(this, APP_CLUSTER, {
        vpc: vpc
      });

      // Create a load-balanced Fargate service with ADMIN privileges and make it public
      new ecs_patterns.ApplicationLoadBalancedFargateService(this, APP_FARGATE_SERVICE, {
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
}
