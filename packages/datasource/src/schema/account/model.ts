import * as t from 'drizzle-orm/pg-core'
import { eq, getTableName, InferSelectModel, sql } from 'drizzle-orm'

import { model } from '../base'
import { UserModel } from '../user'

const NAME = 'accounts'

export type AccountModel = InferSelectModel<typeof AccountModel>

/**
 * @enum {AccountType}
 */
export const AccountType = {
  /** Magic link */
  email: 'email',
  /** OAuth/OpenID Connect */
  oidc: 'oidc',
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
    provider: t.text({ enum: [AccountSSOProvider.google] }).notNull(),
    providerAccountId: t.text().notNull(),
    type: t.text({ enum: [AccountType.email, AccountType.oidc] }).notNull(),
    userId: model.id().notNull(),
    access_token: t.text(),
    expires_at: t.integer(),
    id_token: t.text(),
    scope: t.text(),
    session_state: t.text(),
    refresh_token: t.text(),
    token_type: t.text(),
  },
  (s) => [
    t
      .foreignKey({
        columns: [s.userId],
        foreignColumns: [UserModel.id],
        name: model.fk(NAME, getTableName(UserModel), s.userId),
      })
      .onDelete('cascade'),
  ],
)
