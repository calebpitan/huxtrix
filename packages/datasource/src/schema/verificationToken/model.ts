import * as t from 'drizzle-orm/pg-core'
import { InferSelectModel } from 'drizzle-orm'

import { model } from '../base'

const NAME = 'verification_tokens'

export type VerificationTokenModel = InferSelectModel<typeof VerificationTokenModel>

export const VerificationTokenModel = model(NAME, {
  identifier: t.varchar().notNull(),
  token: t.varchar().notNull(),
  expires: t.timestamp({ withTimezone: true }).notNull(),
})
