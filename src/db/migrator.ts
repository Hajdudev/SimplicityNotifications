import dotenv from "dotenv";
const dotEnvFile =
  process.env.ENVIRONMENT === "prod" ? ".env.prod" : process.env.ENVIRONMENT === "dev" ? ".env.dev" : ".env.local";
dotenv.config({ path: dotEnvFile });

import { getEnvVarCachedOrThrow } from "../utils/utils";
import { ContextDB } from "./ContextDB";
import { dropAllTables, migrateDown, migrateToLatest } from "./migrator.service";

// Run migrations based on command line argument
const command = process.argv[2];

const context: ContextDB = {
  appUserName: getEnvVarCachedOrThrow("APP_USER_NAME"),
  appUserPassword: getEnvVarCachedOrThrow("APP_USER_PASSWORD"),
  dbname: getEnvVarCachedOrThrow("DB_NAME"),
  host: getEnvVarCachedOrThrow("DB_HOST"),
  port: getEnvVarCachedOrThrow("DB_PORT"),
  username: getEnvVarCachedOrThrow("DB_USER"),
  password: getEnvVarCachedOrThrow("DB_PASSWORD"),
};

if (command === "up") {
  migrateToLatest(context);
} else if (command === "down") {
  migrateDown(context);
} else if (command === "drop all tables") {
  dropAllTables(context);
} else {
  console.log("Usage: npm run migrate up|down|drop all tables");
}
