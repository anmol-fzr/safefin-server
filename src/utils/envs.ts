export const envs = {
  DB_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  BETTER_AUTH: Object.freeze({
    SECRET: process.env.BETTER_AUTH_SECRET,
    URL: process.env.BETTER_AUTH_URL
  })
} as const

