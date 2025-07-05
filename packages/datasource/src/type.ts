import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'

import * as schema from './schema'

type ModelKeys<K extends string> = K extends `${infer S}Model`
  ? S extends 'ID' | 'Timestamp'
    ? never
    : K
  : never

export type Schema = Pick<typeof schema, ModelKeys<keyof typeof schema>>

export type Database = PostgresJsDatabase<Schema>
