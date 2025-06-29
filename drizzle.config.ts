import { defineConfig } from "drizzle-kit";
import { envs } from "./src/utils/envs";

export default defineConfig({
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: envs.DB_URL,
  },
  verbose: true,
  strict: true,
});

