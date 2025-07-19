import { neon } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema"

const getDb = (dbUrl: CloudflareBindings["DATABASE_URL"]): ReturnType<typeof drizzle> => {
  const sql = neon(dbUrl);
  return drizzle(sql, { schema });
}

export { getDb }
