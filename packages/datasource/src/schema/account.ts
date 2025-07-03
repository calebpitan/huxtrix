import * as t from 'drizzle-orm/pg-core'
import { eq, sql } from 'drizzle-orm'

import { model } from './base'

const NAME = 'accounts'

/**
 * @enum {AccountType}
 */
export const AccountType = {
  managed: 'managed',
  sso: 'sso',
} as const

/**
 * @enum {AccountSSOProvider}
 */
export const AccountSSOProvider = {
  google: 'google',
} as const

export const AccountModel = model(
  NAME,
  {
    email: t.varchar({ length: 255 }).notNull(),
    password: t.varchar({ length: 255 }),
    accessToken: t.varchar({ length: 512 }),
    ssoProvider: t.varchar({ enum: [AccountSSOProvider.google] }),
    accountType: t
      .varchar({ enum: [AccountType.managed, AccountType.sso] })
      .notNull()
      .default(AccountType.managed),
  },
  (s) => [
    // unique index for email in lower
    t.uniqueIndex(model.uq(NAME, s.email)).on(sql`LOWER(${s.email})`),
    // check constraint to ensure necessary fields are compatible with account type
    t.check(
      model.ck(NAME, 'account_type_compat'),
      sql`(${eq(s.accountType, AccountType.managed)} AND ${s.password} IS NOT NULL) OR (${eq(s.accountType, AccountType.sso)} AND ${s.ssoProvider} IS NOT NULL)`,
    ),
  ],
)
