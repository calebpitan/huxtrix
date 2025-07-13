import type { ExtractTablesWithRelations, GetColumnData, InferSelectModel, SQL } from 'drizzle-orm'
import { type UpdateTableConfig, and, eq, isNotNull, isNull, or, sql } from 'drizzle-orm'
import type { PgColumn, PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core'
import { type Result, err, ok } from 'neverthrow'

import { NoResultFoundError } from '../errors'
import { DatabaseSession, LoadOptions, Schema } from '../type'

type BaseColumns = { id: PgColumn; createdAt: PgColumn; updatedAt: PgColumn; deletedAt: PgColumn }

type Table<C extends BaseColumns = BaseColumns> = PgTableWithColumns<
  UpdateTableConfig<TableConfig, { columns: C }>
>

type TKeys<S extends Schema> = Exclude<keyof ExtractTablesWithRelations<S>, 'session'>

type TCols<S extends Schema, K extends TKeys<S>> = Bound<
  ExtractTablesWithRelations<S>[K]['columns'],
  BaseColumns
>

type Bound<T, I> = T extends I ? T : never

export type FindAllOptions = { limit?: number; offset?: number }
export type ExecutionOptions = { redacted?: 'exclude' | 'include' | 'only' }

export interface Mapper<M extends Record<string, unknown>, E extends Record<string, any>> {
  struct(shape: E): E
  from(model: M): E
  into(entity: E): M
  pinto(entity: Partial<E>): Partial<M>
}

export abstract class AbstractRepository<S extends DatabaseSession, E extends Record<string, any>> {
  constructor(protected readonly session: S) {}

  abstract find(pk: string, options?: ExecutionOptions): Promise<E | undefined>
  abstract findall(options?: FindAllOptions & ExecutionOptions): Promise<E[]>
  abstract one(pk: string, options?: ExecutionOptions): Promise<Result<E, NoResultFoundError>>
  abstract delete(pk: string, options?: ExecutionOptions): Promise<Result<E, NoResultFoundError>>
  abstract update(
    pk: string,
    partial: Partial<E>,
    options?: ExecutionOptions,
  ): Promise<Result<E, NoResultFoundError>>
}

// TODO: Write UNIT  TESTS especially since type integrity could not be guranteed within module

export function RepositoryFactory<
  Key extends TKeys<Schema>,
  Model extends Table<TCols<Schema, Key>>,
  const Options extends LoadOptions<Key>,
>(key: Key, model: Model, loadopts: Options) {
  return class Repository<
    S extends DatabaseSession,
    E extends Record<string, any>,
    M extends Mapper<InferSelectModel<Model>, E>,
  > extends AbstractRepository<S, E> {
    /**
     * Creates a new Repository instance with the given database session and entity mapper.
     *
     * @param session - The database session to use for all operations
     * @param mapper - The mapper instance to convert between database models and entities
     */
    constructor(
      public readonly session: S,
      public readonly mapper: M,
    ) {
      super(session)
    }

    /**
     * Applies redaction filtering to a base SQL condition.
     *
     * This method handles soft-delete filtering by checking the `deletedAt` column
     * based on the redaction option:
     * - `'exclude'`: Only returns non-deleted records (default)
     * - `'include'`: Returns both deleted and non-deleted records
     * - `'only'`: Only returns deleted records
     *
     * @protected
     * @param redacted - The redaction strategy to apply
     * @param base - The base SQL condition to combine with redaction filtering
     * @returns A combined SQL condition with redaction filtering applied
     */
    _withRedacted(redacted: ExecutionOptions['redacted'] = 'exclude', base: SQL = sql`TRUE`) {
      switch (redacted) {
        case 'exclude':
          return and(base, isNull(model.deletedAt))
        case 'include':
          return and(base, or(isNull(model.deletedAt), isNotNull(model.deletedAt)))
        case 'only':
          return and(base, isNotNull(model.deletedAt))
      }
    }

    /**
     * Checks if a record exists by a specific attribute value.
     *
     * This is a generic method that can check existence by any column value.
     * It uses an optimized EXISTS query for better performance.
     *
     * @protected
     * @param attribute - The attribute value to search for
     * @param options - Execution options including redaction strategy
     * @param selector - Function to select the column to search in
     * @returns Promise that resolves to true if a record exists, false otherwise
     */
    async _existsBy<Col extends PgColumn, Attr extends GetColumnData<Col, 'raw'>>(
      attribute: Attr,
      options: ExecutionOptions,
      selector: (m: Model) => Col,
    ): Promise<boolean> {
      const condition = this._withRedacted(options.redacted, eq(selector(model), attribute))

      const [result] = await this.session.execute<Record<'exists', boolean>>(sql`
        SELECT EXISTS (
          SELECT 1 
            FROM ${model}
            WHERE ${condition}
        )
      `)

      return result?.exists ?? false
    }

    /**
     * Finds all records by a specific attribute value.
     *
     * This is a generic method that can find records by any column value.
     * It includes related data based on the configured load options.
     *
     * @protected
     * @param attribute - The attribute value to search for
     * @param options - Execution options including redaction strategy
     * @param selector - Function to select the column to search in
     * @returns Promise that resolves to an array of entities matching the criteria
     */
    async _findBy<Col extends PgColumn, Attr extends GetColumnData<Col, 'raw'>>(
      attribute: Attr,
      options: ExecutionOptions,
      selector: (m: Model) => Col,
    ): Promise<E[]> {
      const result = await this.session.query[key].findMany({
        with: loadopts,
        where: (_fields, op) => {
          return this._withRedacted(options.redacted, op.eq(selector(model), attribute))
        },
      })

      // @ts-expect-error - Drizzle type inference limitations
      return result.map(this.mapper.from)
    }

    /**
     * Checks if a record exists by its primary key.
     *
     * @param pk - The primary key value to check
     * @param options - Execution options including redaction strategy
     * @returns Promise that resolves to true if a record exists, false otherwise
     */
    async exists(pk: string, options: ExecutionOptions = {}): Promise<boolean> {
      return await this._existsBy(pk, options, (m) => m.id)
    }

    /**
     * Finds a single record by its primary key.
     *
     * Returns undefined if no record is found. This method includes
     * related data based on the configured load options.
     *
     * @param pk - The primary key value to search for
     * @param options - Execution options including redaction strategy
     * @returns Promise that resolves to the found entity or undefined
     */
    async find(pk: string, options: ExecutionOptions = {}): Promise<E | undefined> {
      const result = await this.session.query[key].findFirst({
        with: loadopts,
        where: (_fields, op) => {
          return this._withRedacted(options.redacted, op.eq(model.id, pk))
        },
      })

      if (typeof result === 'undefined') {
        return undefined
      }

      // @ts-expect-error - Drizzle type inference limitations
      const data = this.mapper.from(result)

      return data
    }

    /**
     * Finds a single record by its primary key, returning a Result type.
     *
     * This method is similar to `find()` but returns a Result type that
     * explicitly handles the case where no record is found.
     *
     * @param pk - The primary key value to search for
     * @param options - Execution options including redaction strategy
     * @returns Promise that resolves to a Result containing the entity or an error
     */
    async one(pk: string, options: ExecutionOptions = {}): Promise<Result<E, NoResultFoundError>> {
      const entity = await this.find(pk, options)

      if (!entity) {
        return err(new NoResultFoundError())
      }

      return ok(entity)
    }

    /**
     * Finds all records with optional pagination and filtering.
     *
     * This method supports pagination through limit and offset parameters,
     * and includes related data based on the configured load options.
     *
     * @param options - Options for pagination and execution
     * @param options.limit - Maximum number of records to return
     * @param options.offset - Number of records to skip
     * @param options.redacted - Redaction strategy for soft-deleted records
     * @returns Promise that resolves to an array of entities
     */
    async findall(options: FindAllOptions & ExecutionOptions = {}): Promise<E[]> {
      const result = await this.session.query[key].findMany({
        offset: options.offset,
        limit: options.limit,
        with: loadopts,
        where: (_fields, _op) => {
          return this._withRedacted(options.redacted)
        },
      })

      // @ts-expect-error - Drizzle type inference limitations
      const data = result.map(this.mapper.from)

      return data
    }

    /**
     * Updates a record by its primary key.
     *
     * This method automatically excludes `createdAt` and `updatedAt` fields
     * from the update operation to prevent accidental modification of audit fields.
     *
     * @param pk - The primary key value of the record to update
     * @param partial - Partial entity data containing the fields to update
     * @param options - Execution options including redaction strategy
     * @returns Promise that resolves to a Result containing the updated entity or an error
     */
    async update(
      pk: string,
      partial: Partial<E>,
      options: ExecutionOptions = {},
    ): Promise<Result<E, NoResultFoundError>> {
      const { createdAt, updatedAt, ...values } = this.mapper.pinto(partial)
      const [result] = await this.session
        .update(model)
        // @ts-expect-error - Drizzle type inference limitations
        .set(values)
        .where(this._withRedacted(options.redacted, eq(model.id, pk)))
        .returning()

      if (typeof result === 'undefined') {
        return err(new NoResultFoundError())
      }

      // @ts-expect-error - Drizzle type inference limitations
      const data = this.mapper.from(result)

      return ok(data)
    }

    /**
     * Deletes a record by its primary key.
     *
     * This method performs a hard delete, permanently removing the record
     * from the database. Consider using soft deletes (setting `deletedAt`)
     * for data that should be recoverable.
     *
     * @param pk - The primary key value of the record to delete
     * @param options - Execution options including redaction strategy
     * @returns Promise that resolves to a Result containing the deleted entity or an error
     */
    async delete(
      pk: string,
      options: ExecutionOptions = {},
    ): Promise<Result<E, NoResultFoundError>> {
      const [result] = await this.session
        .delete(model)
        .where(this._withRedacted(options.redacted, eq(model.id, pk)))
        .returning()

      if (typeof result === 'undefined') {
        return err(new NoResultFoundError())
      }

      return ok(this.mapper.from(result))
    }
  }
}
