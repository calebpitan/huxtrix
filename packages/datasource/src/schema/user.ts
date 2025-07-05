import * as t from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

import { model } from './base'

const NAME = 'users'

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
    /** The unique, user's name on the platform */
    name: t.text().notNull(),
  },
  (s) => [
    // unique index for email in lower
    t
      .uniqueIndex(model.uq(NAME, s.email))
      .on(sql`LOWER(${s.email})`)
      .where(sql`${s.deletedAt} IS NULL`),
    t
      .uniqueIndex(model.uq(NAME, s.name))
      .on(sql`LOWER(${s.name})`)
      .where(sql`${s.deletedAt} IS NULL`),
  ],
)
