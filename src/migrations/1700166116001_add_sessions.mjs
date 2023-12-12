import { sql } from "kysely";

export async function up(db) {
  await db.schema
    .createTable("sessions")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("address", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamp", (col) =>
      col.defaultTo(sql`NOW() + interval '24 hours'`)
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db) {
  await db.schema.dropTable("sessions").execute();
}
