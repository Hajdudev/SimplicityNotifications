import { Kysely, sql } from "kysely";
import type { DatabaseSchema } from "..";
import type { ContextDB } from "../ContextDB";

export async function up(db: Kysely<DatabaseSchema>, context?: ContextDB): Promise<void> {
  const appUserName = context?.appUserName;
  const appUserPassword = context?.appUserPassword;
  const dbName = context?.dbname;

  if (!appUserName || !appUserPassword || !dbName) {
    throw new Error("Missing required context: appUserName, appUserPassword, or dbname");
  }

  if (!/^[a-zA-Z0-9_]+$/.test(appUserName)) {
    throw new Error("Invalid username format");
  }

  // Create now_millis() function (returns current timestamp as bigint milliseconds)
  await sql.raw(`
    CREATE OR REPLACE FUNCTION now_millis()
    RETURNS BIGINT AS $$
    BEGIN
      RETURN (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT;
    END;
    $$ LANGUAGE plpgsql IMMUTABLE;
  `).execute(db);

  // Create trigger function to auto-update 'updated' timestamp column
  await sql.raw(`
    CREATE OR REPLACE FUNCTION update_updated_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `).execute(db);

  // Create app user (identifier must be raw, password can be escaped string literal)
  await sql.raw(`CREATE USER ${appUserName} WITH PASSWORD '${appUserPassword.replace(/'/g, "''")}'`).execute(db);

  // Grant database access
  await sql.raw(`GRANT CONNECT ON DATABASE ${dbName} TO ${appUserName}`).execute(db);
  await sql.raw(`GRANT USAGE ON SCHEMA public TO ${appUserName}`).execute(db);

  // Grant permissions on tables
  await sql.raw(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${appUserName}`).execute(db);
  await sql.raw(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${appUserName}`).execute(db);

  // Grant permissions on sequences
  await sql.raw(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${appUserName}`).execute(db);
  await sql.raw(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ${appUserName}`).execute(db);

  // Grant function execution
  await sql.raw(`GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO ${appUserName}`).execute(db);
  await sql.raw(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO ${appUserName}`).execute(db);

  console.log(`App user ${appUserName} created successfully with all helper functions`);
}

export async function down(db: Kysely<DatabaseSchema>, context?: ContextDB): Promise<void> {
  const appUserName = context?.appUserName ?? "app_user";
  const dbName = context?.dbname ?? process.env.DB_NAME;

  console.log(`Dropping app user: ${appUserName}`);

  // Revoke all permissions
  await sql.raw(`REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM ${appUserName}`).execute(db);
  await sql.raw(`ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM ${appUserName}`).execute(db);

  await sql.raw(`REVOKE USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public FROM ${appUserName}`).execute(db);
  await sql.raw(`ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE USAGE, SELECT ON SEQUENCES FROM ${appUserName}`).execute(db);

  await sql.raw(`REVOKE SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM ${appUserName}`).execute(db);
  await sql.raw(`ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM ${appUserName}`).execute(db);

  await sql.raw(`REVOKE USAGE ON SCHEMA public FROM ${appUserName}`).execute(db);
  await sql.raw(`REVOKE CONNECT ON DATABASE ${dbName} FROM ${appUserName}`).execute(db);

  // Drop user (may fail if user owns objects)
  await sql.raw(`DROP USER IF EXISTS ${appUserName}`).execute(db);

  // Drop helper functions
  await sql.raw(`DROP FUNCTION IF EXISTS update_updated_column() CASCADE`).execute(db);
  await sql.raw(`DROP FUNCTION IF EXISTS now_millis()`).execute(db);

  console.log(`App user ${appUserName} and helper functions dropped`);
}
