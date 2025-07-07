import { relations } from 'drizzle-orm'

import { UserModel } from '../user/model'
import { SessionModel } from './model'

export const SessionRelations = relations(SessionModel, ({ one }) => ({
  user: one(UserModel, {
    fields: [SessionModel.userId],
    references: [UserModel.id],
  }),
}))
