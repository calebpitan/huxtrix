import { BuildColumns, BuildExtraConfigColumns, sql } from 'drizzle-orm'
import { PgColumn, PgColumnBuilderBase, PgTableExtraConfigValue } from 'drizzle-orm/pg-core'
import { PgTableFn, PgTableWithColumns, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { PgColumnsBuilders } from 'drizzle-orm/pg-core/columns/all'
import { monotonicFactory } from 'ulid'

type ModelExtras = typeof namingConventions & {
  id: typeof id
  generateId: (seedTime?: number) => string
}

export type WithBase<T> = (T extends Record<string, unknown>
  ? T
  : T extends (...args: any) => infer R
    ? WithBase<R>
    : never) &
  typeof IDModel &
  typeof TimestampModel

export interface Model<TSchema extends string | undefined = undefined> extends PgTableFn<TSchema> {
  <TTableName extends string, TColumnsMap extends Record<string, PgColumnBuilderBase>>(
    name: TTableName,
    columns: TColumnsMap,
    extraConfig?: (
      self: BuildExtraConfigColumns<TTableName, WithBase<TColumnsMap>, 'pg'>,
    ) => PgTableExtraConfigValue[],
  ): PgTableWithColumns<{
    name: TTableName
    schema: TSchema
    columns: BuildColumns<TTableName, WithBase<TColumnsMap>, 'pg'>
    dialect: 'pg'
  }>

  <TTableName extends string, TColumnsMap extends Record<string, PgColumnBuilderBase>>(
    name: TTableName,
    columns: (columnTypes: PgColumnsBuilders) => TColumnsMap,
    extraConfig?: (
      self: BuildExtraConfigColumns<TTableName, WithBase<TColumnsMap>, 'pg'>,
    ) => PgTableExtraConfigValue[],
  ): PgTableWithColumns<{
    name: TTableName
    schema: TSchema
    columns: BuildColumns<TTableName, WithBase<TColumnsMap>, 'pg'>
    dialect: 'pg'
  }>
}

const _suffix = <T extends string, C extends PgColumn>(tb: T, ...cols: C[]) =>
  `${tb}_${cols.map((c) => `${c.name}`).join('_')}` as const

const _suffix2 = <T1 extends string, T2 extends string, C extends PgColumn>(
  ltb: T1,
  ftb: T2,
  ...cols: C[]
) => `${ltb}_${cols.map((c) => `${c.name}`).join('_')}_${ftb}` as const

const namingConventions = {
  /**
   * Generate a conventional name for a database index
   * @param tb The table that has the index
   * @param cols The columns to index
   * @returns A string that describes a name for an index constraint
   */
  ix: <T extends string, C extends PgColumn>(tb: T, ...cols: C[]) =>
    `ix_${_suffix(tb, ...cols)}` as const,

  /**
   * Generate a conventional name for a database unique index
   * @param tb The table that has the column(s) to add a unique constraint on
   * @param cols The columns to add the unique constraint on
   * @returns A string that describes a name for the unique constraint
   */
  uq: <T extends string, C extends PgColumn>(tb: T, ...cols: C[]) =>
    `uq_${_suffix(tb, ...cols)}` as const,

  /**
   * Generate a conventional name for a database check constraint
   * @param tb The table that would have the check constraint
   * @param name The name for the constraint that describe well what the check does
   * @returns A string that describes a name for the check constraint
   */
  ck: <T extends string, N extends string>(tb: T, name: N) => `ck_${tb}_${name}` as const,

  /**
   * Generate a conventional name for a database foreign key constraint
   * @param ltb The local table that has a reference to another table
   * @param ftb The foreign table that is being referenced
   * @param cols The local table columns of reference
   * @returns A string that describes a name for the foreign key constraint
   */
  fk: <T1 extends string, T2 extends string, C extends PgColumn>(ltb: T1, ftb: T2, ...cols: C[]) =>
    `fk_${_suffix2(ltb, ftb, ...cols)}` as const,

  /**
   * Generate a conventional name for a database primary key constraint
   * @param tb The table that has the primary key constraint
   * @returns A string that describes a name for the primary key constraint
   */
  pk: <T extends string>(tb: T) => `pk_${tb}` as const,
}

const ulid = monotonicFactory()

export const IDModel = {
  /**
   * ULID: exposable identifier
   */
  id: varchar({ length: 26 })
    .primaryKey()
    .$default(() => ulid()),
}

export const TimestampModel = {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp({ withTimezone: true }),
}

export function withBase<T extends Record<string, unknown>>(model: T): WithBase<T> {
  return {
    ...IDModel,
    ...model,
    ...TimestampModel,
  } as WithBase<T>
}

export const model: Model & ModelExtras = (name, columns, extraConfig) => {
  const message =
    'parameter 3 of "model@extraConfig" must return an array of "PgTableExtraConfigValue"'

  if (typeof columns === 'function') {
    if (typeof extraConfig === 'undefined') {
      return pgTable<typeof name, WithBase<typeof columns>>(name, (...args) =>
        withBase(columns(...args)),
      )
    }

    return pgTable<typeof name, WithBase<typeof columns>>(
      name,
      (...args) => withBase(columns(...args)),
      (...args) => {
        const config = extraConfig(...args)

        if (!Array.isArray(config)) {
          throw new Error(message)
        }

        return config
      },
    )
  }

  if (typeof extraConfig === 'undefined') {
    return pgTable<typeof name, WithBase<typeof columns>>(name, withBase(columns))
  }

  return pgTable<typeof name, WithBase<typeof columns>>(name, withBase(columns), (...args) => {
    const config = extraConfig(...args)

    if (!Array.isArray(config)) {
      throw new Error(message)
    }

    return config
  })
}

const id = () => varchar({ length: 26 })

model.id = id
model.ix = namingConventions.ix
model.uq = namingConventions.uq
model.ck = namingConventions.ck
model.fk = namingConventions.fk
model.pk = namingConventions.pk
model.generateId = (seedTime) => ulid(seedTime)
