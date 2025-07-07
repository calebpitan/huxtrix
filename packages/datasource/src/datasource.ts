import { DrizzleConfig } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'

import { AccountModel, SessionModel, UserModel, VerificationTokenModel } from './schema'
import { Schema } from './type'

export function datasource(url: string, config: Pick<DrizzleConfig, 'logger'> = {}) {
  return drizzle<Schema>(url, {
    casing: 'snake_case',
    ...config,
    schema: {
      account: AccountModel,
      session: SessionModel,
      user: UserModel,
      verificationToken: VerificationTokenModel,
    },
  })
}
