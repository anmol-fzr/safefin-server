import { drizzle } from 'drizzle-orm/node-postgres';
import { envs } from '../utils/envs';
import * as schema from "@/db/schema"

export const db = drizzle(envs.DB_URL, {
  schema
});
