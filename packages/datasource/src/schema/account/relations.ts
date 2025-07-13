import { relations } from 'drizzle-orm'

import { UserDict, UserModel } from '../user/model'
import { AccountModel } from './model'

export type AccountRelations = { user?: UserDict }

export const AccountRelations = relations(AccountModel.table, ({ one }) => ({
  user: one(UserModel.table, {
    fields: [AccountModel.table.userId],
    references: [UserModel.table.id],
  }),
}))
