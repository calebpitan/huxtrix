import * as t from 'drizzle-orm/pg-core'
import { InferSelectModel, getTableName } from 'drizzle-orm'

import { TimestampModel, model } from '../base'
import { UserModel } from '../user/model'

const NAME = 'sessions'

export type SessionModel = InferSelectModel<typeof SessionModel>

/**
 * `sessionToken` is primary key and session model therefore doesn't have
 * an ID, the session token serves as ID
 */
export const SessionModel = t.pgTable(
  NAME,
  {
    userId: model.id().notNull(),
    sessionToken: t.text().primaryKey().notNull(),
    expires: t.timestamp({ withTimezone: true }).notNull(),
    createdAt: TimestampModel.createdAt,
    updatedAt: TimestampModel.updatedAt,
  },
  (s) => {
    return [
      t.index(model.ix(NAME, s.expires)).on(s.expires),
      t
        .foreignKey({
          name: model.fk(NAME, getTableName(UserModel), s.userId),
          columns: [s.userId],
          foreignColumns: [UserModel.id],
        })
        .onDelete('cascade'),
    ]
  },
)
