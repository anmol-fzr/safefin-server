declare module "bun" {
  interface Env {
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    DATABASE_URL: string;
    PORT: string;
  }
}
