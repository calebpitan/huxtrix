import * as t from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

import { model } from './base'

const NAME = 'users'

export const UserModel = model(
  NAME,
  {
    family_name: t.varchar({ length: 255 }).notNull(),
    given_name: t.varchar({ length: 255 }).notNull(),
    username: t.varchar({ length: 128 }).notNull(),
  },
  (s) => [t.uniqueIndex(model.uq(NAME, s.username)).on(sql`LOWER(${s.username})`)],
)
