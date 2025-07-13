import { GetColumnData, eq, sql } from 'drizzle-orm'
import { Result, err, ok } from 'neverthrow'

import { UserEntity, UserEntityMapper } from '../entities/user'
import { MultipleResultsFoundError, NoResultFoundError } from '../errors'
import { UserDict, UserModel } from '../schema'
import { DatabaseSession, LoadOptions, TCols } from '../type'
import { ExecutionOptions, Mapper, RepositoryFactory } from './base'

const KEY = 'user'
const LOAD_OPTIONS = { accounts: true, sessions: true } as const satisfies LoadOptions<'user'>

export class UserRepository<S extends DatabaseSession> extends RepositoryFactory(
  KEY,
  UserModel.table,
  LOAD_OPTIONS,
)<S, UserEntity, Mapper<UserDict, UserEntity>> {
  /**
   * Creates a new UserRepository instance with the given database session.
   *
   * The repository is configured to load related accounts and sessions data
   * automatically for all queries.
   *
   * @param session - The database session to use for all operations
   */
  constructor(public readonly session: S) {
    super(session, UserEntityMapper)
  }

  /**
   * Finds a user by their email address.
   *
   * This method ensures that only one user is returned. If multiple users
   * are found with the same email, it returns a MultipleResultsFoundError.
   * If no user is found, it returns a NoResultFoundError.
   *
   * The returned user includes related accounts and sessions data.
   *
   * @param email - The email address to search for
   * @param options - Execution options including redaction strategy for soft-deleted users
   * @returns Promise that resolves to a Result containing the user entity or an error
   */
  async findByEmail(
    email: string,
    options: ExecutionOptions = {},
  ): Promise<Result<UserEntity, MultipleResultsFoundError | NoResultFoundError>> {
    const [user, ...users] = await this._findBy(email, options, (m) => m.email)

    if (users.length > 0) {
      return err(new MultipleResultsFoundError())
    }

    if (typeof user === 'undefined') {
      return err(new NoResultFoundError())
    }

    return ok(user)
  }

  /**
   * Finds a user by their username.
   *
   * This method ensures that only one user is returned. If multiple users
   * are found with the same username, it returns a MultipleResultsFoundError.
   * If no user is found, it returns a NoResultFoundError.
   *
   * The returned user includes related accounts and sessions data.
   *
   * @param username - The username to search for
   * @param options - Execution options including redaction strategy for soft-deleted users
   * @returns Promise that resolves to a Result containing the user entity or an error
   */
  async findByUsername(
    username: string,
    options: ExecutionOptions = {},
  ): Promise<Result<UserEntity, MultipleResultsFoundError | NoResultFoundError>> {
    const [user, ...users] = await this._findBy(username, options, (m) => m.username)

    if (users.length > 0) {
      return err(new MultipleResultsFoundError())
    }

    if (typeof user === 'undefined') {
      return err(new NoResultFoundError())
    }

    return ok(user)
  }

  /**
   * Checks if a user exists with the given email address.
   *
   * This method uses an optimized EXISTS query for better performance
   * when you only need to check existence without loading the full user data.
   *
   * @param email - The email address to check
   * @param options - Execution options including redaction strategy for soft-deleted users
   * @returns Promise that resolves to true if a user exists with the email, false otherwise
   */
  async existsByEmail(email: string, options: ExecutionOptions = {}): Promise<boolean> {
    return this._existsBy(email, options, (m) => m.email)
  }

  /**
   * Checks if a user exists with the given username.
   *
   * This method uses an optimized EXISTS query for better performance
   * when you only need to check existence without loading the full user data.
   *
   * @param username - The username to check
   * @param options - Execution options including redaction strategy for soft-deleted users
   * @returns Promise that resolves to true if a user exists with the username, false otherwise
   */
  async existsByUsername(username: string, options: ExecutionOptions = {}): Promise<boolean> {
    return this._existsBy(username, options, (m) => m.username)
  }
}
