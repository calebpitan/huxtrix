import { DrizzleConfig } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'

import { AccountModel, SessionModel, UserModel, VerificationTokenModel } from './schema'
import { AccountRelations, SessionRelations, UserRelations } from './schema'
import { Schema } from './type'

export function datasource(url: string, config: Pick<DrizzleConfig, 'logger'> = {}) {
  return drizzle<Schema>(url, {
    casing: 'snake_case',
    ...config,
    schema: {
      account: AccountModel.table,
      accountRelations: AccountRelations,
      session: SessionModel.table,
      sessionRelations: SessionRelations,
      user: UserModel.table,
      userRelations: UserRelations,
      verificationToken: VerificationTokenModel.table,
    },
  })
}
