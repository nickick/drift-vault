import { RemovalPolicy, type Stack } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { IServerlessCluster } from "aws-cdk-lib/aws-rds";
import { SSTConfig } from "sst";
import {
  Bucket,
  Config,
  NextjsSite,
  RDS,
  RDSCdkServerlessClusterProps,
} from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "drift-vault",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const cdkStack = stack as unknown as Stack;

      const isProd = stack.stage === "prod";

      const reviewCluster: IServerlessCluster | RDSCdkServerlessClusterProps = {
        vpc: ec2.Vpc.fromLookup(cdkStack, "VPC", { isDefault: true }) as any, // Difference in sst and cdk type
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      };

      const bucket = new Bucket(stack, "Bucket", {
        cdk: {
          bucket: {
            versioned: isProd,
            autoDeleteObjects: !isProd,
            removalPolicy: (isProd
              ? RemovalPolicy.RETAIN
              : RemovalPolicy.DESTROY) as any,
          },
        },
      });

      const db = new RDS(stack, "Database", {
        engine: "postgresql11.16",
        defaultDatabaseName: "driftvault",
        migrations: "src/migrations",
        cdk: isProd
          ? { cluster: { deletionProtection: true } }
          : {
              cluster: reviewCluster,
            },
        scaling: {
          autoPause: isProd ? false : 60, // No auto-pause in prod, pause after 60 min of inactivity in other envs to reduce costs
          minCapacity: "ACU_2",
          maxCapacity: isProd ? "ACU_64" : "ACU_2",
        },
      });

      const passphrase = new Config.Secret(stack, "PASSPHRASE");

      const site = new NextjsSite(stack, "Site", {
        bind: [passphrase, db, bucket],
        environment: {
          NEXT_PUBLIC_ALCHEMY_API_KEY: isProd
            ? "zaadypAvZDXaqY2ydt2xPTemCsffPodJ"
            : "zaadypAvZDXaqY2ydt2xPTemCsffPodJ",
          NEXT_PUBLIC_ETHERSCAN_API_KEY: isProd
            ? "P2PDQNPZBG55M9UHD7N19Y4S1J6M8F3G2Q"
            : "P2PDQNPZBG55M9UHD7N19Y4S1J6M8F3G2Q",
          NEXT_PUBLIC_CHAIN_NAME: isProd ? "mainnet" : "goerli",
          NEXT_PUBLIC_VAULT_ADDRESS: isProd
            ? "0xb7b168b1f211e9335eef329a8b539041bf70585e"
            : "0xb7b168b1f211e9335eef329a8b539041bf70585e",
          NEXT_PUBLIC_VAULT_FROM_ADDRESS: isProd
            ? "0xc18c94afc87675b4b3acafdecdac35acd4526d66"
            : "0xc18c94afc87675b4b3acafdecdac35acd4526d66",
          NEXT_PUBLIC_SBT_ADDRESS: isProd
            ? "0xa5ced5b681cb205eadf2fc89837278bd218dfaac"
            : "0xa5ced5b681cb205eadf2fc89837278bd218dfaac",
        },
      });

      stack.addOutputs({ BucketName: bucket.bucketName });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
