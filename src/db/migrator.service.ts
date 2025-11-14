import { sql, Migrator, FileMigrationProvider, Migration, Kysely, MigrationProvider } from "kysely";
import { promises as fs } from "fs";
import * as path from "path";
import { DatabaseSchema } from "./index";
import { ContextDB } from "./ContextDB";
import { getAdminDb } from "./postgresDB";

const migrationFolder =
  process.env.DB_SSL === "true"
    ? path.join(process.cwd(), "db", "migrations") // Lambda: /var/task/db/migrations
    : path.join(__dirname, "migrations");
interface ContextualMigration {
  up: (db: Kysely<DatabaseSchema>, context?: ContextDB) => Promise<void>;
  down?: (db: Kysely<DatabaseSchema>, context?: ContextDB) => Promise<void>;
}

class ContextualFileMigrationProvider implements MigrationProvider {
  private fileMigrationProvider: FileMigrationProvider;
  private context: ContextDB;

  constructor(fileMigrationProvider: FileMigrationProvider, context: ContextDB) {
    this.fileMigrationProvider = fileMigrationProvider;
    this.context = context;
  }

  async getMigrations(): Promise<Record<string, ContextualMigration>> {
    const migrations = await this.fileMigrationProvider.getMigrations();

    // Wrap ALL migrations with context
    const wrappedMigrations: Record<string, Migration> = {};

    for (const [name, migration] of Object.entries(migrations)) {
      const contextualMigration = migration as ContextualMigration;
      wrappedMigrations[name] = {
        up: (db) => contextualMigration.up(db, this.context),
        ...(contextualMigration.down && { down: (db) => contextualMigration.down!(db, this.context) }),
      };
    }

    return wrappedMigrations;
  }
}

export async function migrateToLatest(context: ContextDB) {
  const db = await getAdminDb(context);
  const migrator = new Migrator({
    db,
    provider: new ContextualFileMigrationProvider(
      new FileMigrationProvider({
        fs,
        path,
        migrationFolder,
      }),
      context
    ),
  });
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

export async function migrateDown(context: ContextDB) {
  const db = await getAdminDb(context);
  const migrator = new Migrator({
    db,
    provider: new ContextualFileMigrationProvider(
      new FileMigrationProvider({
        fs,
        path,
        migrationFolder,
      }),
      context
    ),
  });

  const { error, results } = await migrator.migrateDown();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was rolled back successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to roll back migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

export async function dropAllTables(context?: ContextDB) {
  const db = await getAdminDb(context);
  await sql`drop owned by current_user;`.execute(db);
  await db.destroy();
}
