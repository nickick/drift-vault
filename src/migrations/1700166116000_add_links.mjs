import { sql } from "kysely";

export async function up(db) {
  await db.schema
    .createTable("links")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("address", "text", (col) => col.notNull())
    .addColumn("resolved_link", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("expires_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW() + interval '5 minutes'`)
    )
    .addColumn("used", "boolean", (col) => col.notNull().defaultTo(false))
    .execute();
}

export async function down(db) {
  await db.schema.dropTable("links").execute();
}
