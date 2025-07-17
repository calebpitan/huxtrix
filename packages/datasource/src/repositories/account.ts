import { AccountEntity, AccountEntityMapper } from '../entities/account'
import { AccountDict, AccountModel } from '../schema/account/model'
import { UserModel } from '../schema/user/model'
import { DatabaseSession, LoadOptions } from '../type'
import { ExecutionOptions, Mapper, RepositoryFactory } from './base'

const KEY = 'account'
const LOAD_OPTIONS = { user: true } as const satisfies LoadOptions<'account'>

/**
 * Repository for managing account entities in the database.
 *
 * This repository provides methods for finding and managing OAuth/OIDC accounts
 * and email-based authentication accounts. It automatically loads related user
 * data for all queries to provide complete account information.
 *
 * The repository supports both email-based authentication (magic links) and
 * OAuth/OpenID Connect providers (currently Google). Each account is associated
 * with a user and contains provider-specific tokens and metadata.
 *
 * @template S - The database session type
 *
 * @example
 * ```typescript
 * // Find all accounts for a user by email
 * const accounts = await accountRepo.findByEmail('user@example.com')
 *
 * // Check if an account exists for a provider
 * const exists = await accountRepo.existsByEmail('user@example.com')
 * ```
 */
export class AccountRepository<S extends DatabaseSession> extends RepositoryFactory(
  KEY,
  AccountModel.table,
  LOAD_OPTIONS,
)<S, AccountEntity, Mapper<AccountDict, AccountEntity>> {
  /**
   * Creates a new AccountRepository instance with the given database session.
   *
   * The repository is configured to automatically load related user data
   * for all queries, providing complete account information including
   * the associated user details.
   *
   * @param session - The database session to use for all operations
   */
  constructor(public readonly session: S) {
    super(session, AccountEntityMapper)
  }

  /**
   * Finds all accounts associated with a user by their email address.
   *
   * This method searches for accounts by looking up the user's email address
   * in the users table and then finding all accounts associated with that user.
   * It's safe to select from "users"."email" since we preload the `user`
   * relationship in our `LOAD_OPTIONS`.
   *
   * The returned accounts include complete user information and can represent
   * multiple authentication methods for the same user (e.g., both Google OAuth
   * and email-based authentication).
   *
   * @param email - The email address of the user whose accounts to find
   * @param options - Execution options including redaction strategy for soft-deleted accounts
   * @returns Promise that resolves to an array of account entities with user data
   *
   * @example
   * ```typescript
   * // Find all accounts for a user
   * const accounts = await accountRepo.findByEmail('john.doe@example.com')
   *
   * // Each account will include the user data
   * accounts.forEach(account => {
   *   console.log(`Account ${account.provider.name} for user ${account.user?.username}`)
   * })
   * ```
   */
  async findByEmail(email: string, options: ExecutionOptions = {}): Promise<AccountEntity[]> {
    // it's safe to select from "users"."email" since we preload `user` in our `LOAD_OPTIONS`
    const accounts = await this._findBy(email, options, () => UserModel.table.email)

    return accounts
  }
}
