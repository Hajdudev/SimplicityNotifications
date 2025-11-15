import { Kysely, sql } from "kysely";
import { DatabaseSchema } from "..";
import { UserStatus } from "../tables/users.table";

export async function up(db: Kysely<DatabaseSchema>): Promise<void> {
  await db.schema.createType("user_status").asEnum(Object.values(UserStatus)).execute();
  await db.schema
    .createTable("users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("password_hash", "text")
    .addColumn("status", sql`user_status`, (col) => col.notNull().defaultTo(UserStatus.INACTIVE))
    .addColumn("created", "bigint", (col) => col.defaultTo(sql`now_millis()`).notNull())
    .addColumn("updated", "bigint", (col) => col.defaultTo(sql`now_millis()`).notNull())
    .execute();
}

export async function down(db: Kysely<DatabaseSchema>): Promise<void> {
  await db.schema.dropTable("users").execute();
  await db.schema.dropType("user_status").execute()
}

