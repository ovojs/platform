import { createClient } from "@libsql/client/web";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { env } from "@ovojs/runtime";

let db: LibSQLDatabase;

export function openDB() {
  if (!db) {
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });
    db = drizzle(client);
  }
  return db;
}