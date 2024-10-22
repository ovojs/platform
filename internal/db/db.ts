import { createClient } from "@libsql/client/web";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { type Env } from "@ovojs/runtime";
import * as schema from "./schema";
export type Database = LibSQLDatabase<typeof schema>;

let db: Database;
let db_readonly: Database;

export function openDB(env: Env, readonly?: boolean): Database {
  if (readonly) {
    if (!env.DATABASE_URL_READONLY || !env.DADABASE_TOKEN_READONLY)
      throw new Error("Bad database URL");
    db_readonly = drizzle(createClient({
      url: env.DATABASE_URL_READONLY,
      authToken: env.DADABASE_TOKEN_READONLY,
    }));
    return db_readonly;
  }
  if (!env.DATABASE_URL || !env.DATABASE_TOKEN)
    throw new Error("Bad database URL");
  db = drizzle(createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  }));
  return db;
}
