import { relations } from 'drizzle-orm'

import { UserModel } from '../user/model'
import { SessionModel } from './model'

export const SessionRelations = relations(SessionModel.table, ({ one }) => ({
  user: one(UserModel.table, {
    fields: [SessionModel.table.userId],
    references: [UserModel.table.id],
  }),
}))
