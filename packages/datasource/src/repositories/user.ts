import { Result, err, ok } from 'neverthrow'

import { UserEntity, UserEntityMapper } from '../entities/user'
import { MultipleResultsFoundError, NoResultFoundError } from '../errors'
import { Database } from '../type'

export class UserRepository<S extends Database> {
  private readonly loadOptions = { accounts: true, sessions: true } as const

  constructor(private readonly session: S) {}

  async findByEmail(
    email: string,
  ): Promise<Result<UserEntity, MultipleResultsFoundError | NoResultFoundError>> {
    const [user, ...users] = await this.session.query.user.findMany({
      with: this.loadOptions,
      where(fields, op) {
        return op.and(op.eq(fields.email, email), op.isNull(fields.deletedAt))
      },
    })

    if (users.length > 0) {
      return err(new MultipleResultsFoundError())
    }

    if (typeof user === 'undefined') {
      return err(new NoResultFoundError())
    }

    return ok(UserEntityMapper.from(user))
  }

  async find(pk: string): Promise<UserEntity | undefined> {
    const user = await this.session.query.user.findFirst({
      with: this.loadOptions,
      where(fields, op) {
        return op.eq(fields.id, pk)
      },
    })

    if (!user) {
      return undefined
    }

    return UserEntityMapper.from(user)
  }

  async one(pk: string): Promise<Result<UserEntity, NoResultFoundError>> {
    const account = await this.find(pk)

    if (!account) {
      return err(new NoResultFoundError())
    }

    return ok(account)
  }

  async findall(offset?: number, limit?: number): Promise<UserEntity[]> {
    const users = await this.session.query.user.findMany({
      offset,
      limit,
      with: this.loadOptions,
    })

    return users.map(UserEntityMapper.from)
  }
}
