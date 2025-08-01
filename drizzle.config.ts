import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    //url: envs.DB_URL,
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});

