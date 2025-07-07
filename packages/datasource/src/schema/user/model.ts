import * as t from 'drizzle-orm/pg-core'
import { Many, Relations, sql } from 'drizzle-orm'

import { model } from '../base'
import type { UserRelations } from './relations'

const NAME = 'users'

type Rel<T> = T extends Relations<infer K, infer T> ? RelObject<T> : never
type RelObject<T> = T extends Record<infer K, any> ? { [P in K]: RelValue<T[P]> } : never
type RelValue<T> = T extends Many<infer V> ? T['sourceTable'] : never

export type UserBaseModel = typeof UserModel.$inferSelect
export type UserModel = UserBaseModel & UserRelations

export const UserModel = model(
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
