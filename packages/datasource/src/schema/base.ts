import { PgColumn, PgTableFn, integer, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { varchar } from 'drizzle-orm/pg-core'

const _suffix = <T extends string, C extends PgColumn>(tb: T, ...cols: C[]) =>
  `${tb}${cols.map((c) => `_${c.name}`).join('')}`

const _suffix2 = <T1 extends string, T2 extends string, C extends PgColumn>(
  ltb: T1,
  ftb: T2,
  ...cols: C[]
) => `${ltb}${cols.map((c) => `_${c.name}`).join('')}${ftb}`

const naming_convention = {
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

export const IDModel = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  /**
   * ULID exposable identifier
   */
  sid: varchar({ length: 26 }).unique().notNull(),
}

export const TimestampModel = {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp({ withTimezone: true }),
}

export function withBase<T extends Record<string, unknown>>(model: T) {
  return {
    ...IDModel,
    ...model,
    ...TimestampModel,
  }
}

export const model: PgTableFn & typeof naming_convention = (name, columns, extraConfig) => {
  const message =
    'parameter 3 of "model@extraConfig" must return an array of "PgTableExtraConfigValue"'
  if (typeof columns === 'function') {
    if (typeof extraConfig === 'undefined') {
      return pgTable(name, (...args) => withBase(columns(...args)))
    }

    return pgTable(
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
    return pgTable(name, withBase(columns))
  }

  return pgTable(name, withBase(columns), (...args) => {
    const config = extraConfig(...args)

    if (!Array.isArray(config)) {
      throw new Error(message)
    }

    return config
  })
}

model.ix = naming_convention.ix
model.uq = naming_convention.uq
model.ck = naming_convention.ck
model.fk = naming_convention.fk
model.pk = naming_convention.pk
