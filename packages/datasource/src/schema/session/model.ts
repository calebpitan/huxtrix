import * as t from 'drizzle-orm/pg-core'
import { InferSelectModel, getTableName } from 'drizzle-orm'

import { DataStructureProxy, TimestampModel, model } from '../base'
import { UserModel } from '../user/model'

const NAME = 'sessions'

export type SessionDict = InferSelectModel<typeof sessions>

/**
 * `sessionToken` is primary key and session model therefore doesn't have
 * an ID, the session token serves as ID
 */
export const sessions = t.pgTable(
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
          name: model.fk(NAME, getTableName(UserModel.table), s.userId),
          columns: [s.userId],
          foreignColumns: [UserModel.table.id],
        })
        .onDelete('cascade'),
    ]
  },
)

export class SessionModel extends DataStructureProxy<SessionDict>() {
  public static readonly table = sessions

  toStruct() {
    return this.__data__
  }

  toJSON() {
    return this.__data__
  }
}
