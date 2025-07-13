import * as t from 'drizzle-orm/pg-core'
import { InferSelectModel, sql } from 'drizzle-orm'

import { DataStructureProxy, model } from '../base'
import type { UserRelations } from './relations'

const NAME = 'users'

export type UserDictBase = InferSelectModel<typeof users>
export type UserDict = UserDictBase & UserRelations
export type UsersTable = typeof users

export const users = model(
  NAME,
  {
    /** The unique, user's email address */
    email: t.text().notNull(),
    /**
     * According to next-auth, this is the timestamp of when the user was created,
     * after the first sign-in using email magic link provider
     */
    emailVerified: t.timestamp({ withTimezone: true }),
    /** The user's first name */
    familyName: t.text().default('').notNull(),
    /** The user's last name */
    givenName: t.text().default('').notNull(),
    /** The user's avatar image */
    image: t.text(),
    /** A concatenation of `givenName` and `familyName`} */
    name: t.text().default('').notNull(),
    /** The unique, user's name on the platform */
    username: t.text(),
  },
  (s) => [
    // unique index for email in lower
    t
      .uniqueIndex(model.uq(NAME, s.email))
      .on(sql`LOWER(${s.email})`)
      .where(sql`${s.deletedAt} IS NULL`),
    t
      .uniqueIndex(model.uq(NAME, s.username))
      .on(sql`LOWER(${s.username})`)
      .where(sql`${s.username} IS NOT NULL AND ${s.deletedAt} IS NULL`),
  ],
)

export class UserModel extends DataStructureProxy<UserDict>() {
  public static readonly table = users

  static new(data: UserDict) {
    return new UserModel(data)
  }

  toStruct() {
    return this.__data__
  }

  toJSON() {
    return this.__data__
  }
}
