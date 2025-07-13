import { relations } from 'drizzle-orm'

import { AccountDict, AccountModel } from '../account/model'
import { SessionDict, SessionModel } from '../session/model'
import { UserModel } from './model'

export type UserRelations = { accounts?: AccountDict[]; sessions?: SessionDict[] }

export const UserRelations = relations(UserModel.table, ({ many }) => ({
  accounts: many(AccountModel.table),
  sessions: many(SessionModel.table),
}))
