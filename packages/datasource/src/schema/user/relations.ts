import { relations } from 'drizzle-orm'

import { AccountModel } from '../account/model'
import { SessionModel } from '../session/model'
import { UserModel } from './model'

export type UserRelations = { accounts: AccountModel[]; sessions: SessionModel[] }

export const UserRelations = relations(UserModel, ({ many }) => ({
  accounts: many(AccountModel),
  sessions: many(SessionModel),
}))
