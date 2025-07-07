import { relations } from 'drizzle-orm'

import { UserModel } from '../user/model'
import { AccountModel } from './model'

export const AccountRelations = relations(AccountModel, ({ one }) => ({
  user: one(UserModel, {
    fields: [AccountModel.userId],
    references: [UserModel.id],
  }),
}))
