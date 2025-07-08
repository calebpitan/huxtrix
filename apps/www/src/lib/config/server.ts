import 'server-only'

import { z } from 'zod'

const ConfigSchema = z
  .object({
    DATABASE_URL: z.string().url(),
    SERVER_EMAIL_ADDRESS: z.string(),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    BASE_URL: z.string().url().default('http://localhost:3000'),
  })
  .transform((data) => ({
    datasourceUrl: data.DATABASE_URL,
    serverEmailAddress: data.SERVER_EMAIL_ADDRESS,
    env: data.NODE_ENV,
    baseUrl: data.BASE_URL,
  }))

export const config = ConfigSchema.parse(process.env)
