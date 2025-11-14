import "./utils/pgTypes"; // <-- must come first!

import { Kysely, PostgresDialect, CamelCasePlugin } from "kysely";
import { Pool, PoolConfig } from "pg";
import type { DatabaseSchema } from "./index";
import type { ContextDB } from "./ContextDB";

const isProduction = process.env.NODE_ENV === "production";

function createAdminPool(context?: ContextDB): Pool {
  const config: PoolConfig = {
    host: context?.host ?? process.env.DB_HOST ?? "localhost",
    port: parseInt(context?.port ?? process.env.DB_PORT ?? "5432", 10),
    database: context?.dbname ?? process.env.DB_NAME,
    user: context?.username ?? process.env.DB_USER,
    password: context?.password ?? process.env.DB_PASSWORD,
    max: isProduction ? 20 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  return new Pool(config);
}

function createUserPool(): Pool {
  const config: PoolConfig = {
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    database: process.env.DB_NAME,
    user: process.env.APP_USER_NAME,
    password: process.env.APP_USER_PASSWORD,
    max: isProduction ? 20 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  return new Pool(config);
}

let userDb: Kysely<DatabaseSchema> | null = null;

/**
 * Returns admin DB connection (for migrations, schema changes).
 * Accepts optional context to override connection settings.
 * Creates a new instance each time (not cached).
 */
export async function getAdminDb(context?: ContextDB): Promise<Kysely<DatabaseSchema>> {
  return new Kysely<DatabaseSchema>({
    dialect: new PostgresDialect({ pool: createAdminPool(context) }),
    plugins: [new CamelCasePlugin()],
  });
}

/**
 * Returns application user DB connection (for normal app queries).
 * Uses APP_USER_NAME and APP_USER_PASSWORD env vars.
 * Cached as singleton.
 */
export function getUserDb(): Kysely<DatabaseSchema> {
  if (!userDb) {
    userDb = new Kysely<DatabaseSchema>({
      dialect: new PostgresDialect({ pool: createUserPool() }),
      plugins: [new CamelCasePlugin()],
    });
  }
  return userDb;
}

/**
 * Close user DB connection. Call on graceful shutdown.
 */
export async function closeAllDb() {
  if (userDb) {
    await userDb.destroy();
    userDb = null;
  }
}
