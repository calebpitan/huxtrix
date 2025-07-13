import * as t from 'drizzle-orm/pg-core'
import { InferSelectModel, getTableName } from 'drizzle-orm'

import { DataStructureProxy, model } from '../base'
import { UserModel } from '../user'
import { AccountRelations } from './relations'

const NAME = 'accounts'

export type AccountDictBase = InferSelectModel<typeof accounts>
export type AccountDict = AccountDictBase & AccountRelations

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

export const accounts = model(
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
        foreignColumns: [UserModel.table.id],
        name: model.fk(NAME, getTableName(UserModel.table), s.userId),
      })
      .onDelete('cascade'),
  ],
)

export class AccountModel extends DataStructureProxy<AccountDict>() {
  public static readonly table = accounts

  static new(data: AccountDict) {
    return new AccountModel(data)
  }

  toStruct() {
    return this.__data__
  }

  toJSON() {
    return this.__data__
  }
}
