import { DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm'
import { PgTable, PgTableWithColumns } from 'drizzle-orm/pg-core'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import * as schema from './schema'

export type Constructor<T, P extends Array<any> = []> = new (...args: P) => T


type SchemaModule = typeof schema
type SchemaModuleMembers = keyof SchemaModule

/**
 * Get the keys from the exports that end in "Model",
 * excluding "IDModel" and "TimestampModel" only
 */
type ModelKeys<K extends string> = K extends `${infer S}Model`
  ? S extends 'ID' | 'Timestamp'
    ? never
    : K
  : never

/**
 * Get the keys from the exports that end in "Relations",
 */
type RelationKeys<K extends string> = K extends `${string}Relations` ? K : never

/**
 * Transform the model keys, removing "Model" from them and converting them from
 * PascalCase to camelCase
 */
type TransformModelKey<ModelKey extends string> = ModelKey extends `${infer S}${infer Rest}Model`
  ? `${Lowercase<S>}${Rest}`
  : never

/**
 * Transform the relations keys, removing "Relations" from them and converting them from
 * PascalCase to camelCase
 */
type TransformRelKey<RelKey extends string> = RelKey extends `${infer S}${infer Rest}`
  ? `${Lowercase<S>}${Rest}`
  : never

/**
 * Applies `TransformRelKey<K>` on the keys of the generic relations `T` given.
 */
type TransformRel<T extends Record<string, unknown>, K extends keyof T = keyof T> = {
  [P in K as TransformRelKey<Exclude<P, number | symbol>>]: T[P]
}

/**
 * Applies `TransformModelKey<K>` on the keys of the generic schema `T` given.
 */
type TransformSchema<T extends Record<string, unknown>, K extends keyof T = keyof T> = {
  [P in K as TransformModelKey<Exclude<P, number | symbol>>]: T[P] extends Record<'table', PgTable> ? T[P]['table'] : never
}

export type Models = TransformSchema<Pick<SchemaModule, ModelKeys<SchemaModuleMembers>>>
export type Relations = TransformRel<Pick<SchemaModule, RelationKeys<SchemaModuleMembers>>>

export type Schema = Models & Relations
export type Database = PostgresJsDatabase<Schema>
export type DatabaseSession = Parameters<Parameters<Database['transaction']>[0]>[0]

export type DeepReadonly<T> = T extends (...args: any[]) => any // Functions are left as-is
  ? T
  : T extends Array<infer U> // Arrays are mapped recursively
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object // Objects are mapped recursively
      ? T extends Date
        ? T
        : { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T // Primitives remain unchanged

export type GetTableConfig<T> = T extends PgTable<infer C> ? C : never
export type GetQueryConfig<K extends keyof Models> = DBQueryConfig<
  'one' | 'many',
  true,
  ExtractTablesWithRelations<Schema>,
  ExtractTablesWithRelations<Schema>[K]
>
export type LoadOptions<K extends keyof Models> = NonNullable<GetQueryConfig<K>['with']>

export type ForUpdate<K extends keyof Models, T extends Record<string, any>> = Partial<
  Omit<T, 'id' | 'createdAt' | 'updatedAt' | keyof LoadOptions<K>>
>

export type TCols<T> = T extends PgTableWithColumns<infer C> ? C['columns'] : never