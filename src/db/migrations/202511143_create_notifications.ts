import { Kysely, sql } from "kysely";
import { DatabaseSchema } from "..";

export async function up(db: Kysely<DatabaseSchema>): Promise<void> {
  await db.schema
    .createTable("notifications")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull()) // ✅ Changed from "name" to "content"
    .addColumn("category", "varchar(50)", (col) => col.notNull())
    .addColumn("created", "bigint", (col) => col.defaultTo(sql`now_millis()`).notNull())
    .addColumn("updated", "bigint", (col) => col.defaultTo(sql`now_millis()`).notNull())
    .execute();
}

export async function down(db: Kysely<DatabaseSchema>): Promise<void> {
  await db.schema.dropTable("notifications").execute();
}
