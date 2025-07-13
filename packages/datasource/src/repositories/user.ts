import { Result, err, ok } from 'neverthrow'

import { UserEntity, UserEntityMapper } from '../entities/user'
import { MultipleResultsFoundError, NoResultFoundError } from '../errors'
import { UserDict, UserModel } from '../schema'
import { DatabaseSession, LoadOptions } from '../type'
import { ExecutionOptions, Mapper, RepositoryFactory } from './base'

const KEY = 'user'
const LOAD_OPTIONS = { accounts: true, sessions: true } as const satisfies LoadOptions<'user'>

/**
 * Repository for managing user entities in the database.
 *
 * This repository provides methods for finding and managing user accounts with
 * comprehensive data loading. It automatically loads related accounts and sessions
 * data for all queries to provide complete user information.
 *
 * The repository supports various user lookup methods including email and username
 * searches, with built-in error handling for cases where multiple users are found
 * or no user exists. It also provides optimized existence checks for performance
 * when you only need to verify user existence without loading full data.
 *
 * All methods support soft-delete filtering through execution options, allowing
 * you to include or exclude deleted users as needed.
 *
 * @template S - The database session type
 *
 * @example
 * ```typescript
 * // Find a user by email with error handling
 * const result = await userRepo.findByEmail('user@example.com')
 * if (result.isOk()) {
 *   const user = result.value
 *   console.log(`Found user: ${user.username}`)
 * } else {
 *   console.log('User not found')
 * }
 *
 * // Check if a username is available
 * const exists = await userRepo.existsByUsername('john_doe')
 * if (!exists) {
 *   console.log('Username is available')
 * }
 * ```
 */
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
   *
   * @example
   * ```typescript
   * // Find user by email with proper error handling
   * const result = await userRepo.findByEmail('john.doe@example.com')
   *
   * if (result.isOk()) {
   *   const user = result.value
   *   console.log(`User: ${user.username}`)
   *   console.log(`Accounts: ${user.accounts?.length || 0}`)
   *   console.log(`Active sessions: ${user.sessions?.length || 0}`)
   * } else if (result.error instanceof NoResultFoundError) {
   *   console.log('User not found')
   * } else {
   *   console.log('Multiple users found with same email')
   * }
   * ```
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
   *
   * @example
   * ```typescript
   * // Find user by username with proper error handling
   * const result = await userRepo.findByUsername('john_doe')
   *
   * if (result.isOk()) {
   *   const user = result.value
   *   console.log(`Found user: ${user.email}`)
   * } else {
   *   console.log('User not found')
   * }
   * ```
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
   *
   * @example
   * ```typescript
   * // Check if email is already registered
   * const emailExists = await userRepo.existsByEmail('newuser@example.com')
   * if (emailExists) {
   *   console.log('Email is already registered')
   * } else {
   *   console.log('Email is available for registration')
   * }
   * ```
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
   *
   * @example
   * ```typescript
   * // Check if username is available
   * const usernameExists = await userRepo.existsByUsername('john_doe')
   * if (usernameExists) {
   *   console.log('Username is already taken')
   * } else {
   *   console.log('Username is available')
   * }
   * ```
   */
  async existsByUsername(username: string, options: ExecutionOptions = {}): Promise<boolean> {
    return this._existsBy(username, options, (m) => m.username)
  }
}
