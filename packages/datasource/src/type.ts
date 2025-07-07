import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'

import * as schema from './schema'

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
  [P in K as TransformModelKey<Exclude<P, number | symbol>>]: T[P]
}

export type Models = TransformSchema<Pick<SchemaModule, ModelKeys<SchemaModuleMembers>>>
export type Relations = TransformRel<Pick<SchemaModule, RelationKeys<SchemaModuleMembers>>>

export type Schema = Models & Relations
export type Database = PostgresJsDatabase<Schema>
