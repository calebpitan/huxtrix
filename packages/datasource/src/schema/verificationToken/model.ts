import * as t from 'drizzle-orm/pg-core'
import { InferSelectModel } from 'drizzle-orm'

import { DataStructureProxy, model } from '../base'

const NAME = 'verification_tokens'

export type VerificationTokenDict = InferSelectModel<typeof verificationTokens>

export const verificationTokens = model(NAME, {
  identifier: t.varchar().notNull(),
  token: t.varchar().notNull(),
  expires: t.timestamp({ withTimezone: true }).notNull(),
})

export class VerificationTokenModel extends DataStructureProxy<VerificationTokenDict>() {
  public static readonly table = verificationTokens

  toStruct() {
    return this.__data__
  }

  toJSON() {
    return this.__data__
  }
}
