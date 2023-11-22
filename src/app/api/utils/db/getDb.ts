import { Kysely } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDSData } from "@aws-sdk/client-rds-data";
import type { Database } from "@/../types/db";
import { SerializePlugin } from "@/app/api/utils/db/plugin/serialize-plugin";
import { RDS } from "sst/node/rds";

interface GetDBProps {
  database: string;
  secretArn: string;
  resourceArn: string;
}

export function getDb(props: GetDBProps) {
  const { database, secretArn, resourceArn } = props;
  if (!database) throw new Error("No db");
  const db = new Kysely<Database>({
    dialect: new DataApiDialect({
      mode: "postgres",
      driver: {
        database,
        secretArn,
        resourceArn,
        client: new RDSData({}),
      },
    }),
    plugins: [new SerializePlugin()],
  });

  return db;
}

export const db = getDb({
  database: RDS.Database.defaultDatabaseName,
  secretArn: RDS.Database.secretArn,
  resourceArn: RDS.Database.clusterArn,
});
