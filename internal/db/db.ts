import { createClient } from "@libsql/client/web";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { type Env } from "@ovojs/runtime";
import * as schema from "./schema";
export type Database = LibSQLDatabase<typeof schema>;

let db: Database;
let db_writable: Database;

export function openDB(env: Env, writable?: boolean): Database {
  if (writable) {
    if (!db_writable) {
      const client = createClient({
        url: env.DATABASE_URL,
        authToken: env.DATABASE_TOKEN,
      });
      db_writable = drizzle(client);
    }
    return db_writable;
  }
  if (!db) {
    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_TOKEN,
    });
    db = drizzle(client);
  }
  return db;
}
