import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

dotenv.config({ path: '.env.local' })

const dsn = new URL(process.env.DATABASE_URL!)

export default defineConfig({
  dialect: 'postgresql',
  schema: './packages/datasource/src/schema/*',
  casing: 'snake_case',
  strict: true,
  out: './drizzle',
  dbCredentials: { url: dsn.toString() },
  migrations: {
    schema: 'public',
  },
})
