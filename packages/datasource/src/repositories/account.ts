import { eq } from 'drizzle-orm'
import { Result, err, ok } from 'neverthrow'

import { AccountEntity, AccountEntityMapper } from '../entities/account'
import { NoResultFoundError } from '../errors'
import { AccountModel } from '../schema/account/model'
import { UserModel } from '../schema/user/model'
import { Database } from '../type'

export class AccountRepository<S extends Database> {
  constructor(private readonly session: S) {}

  async findByEmail(email: string): Promise<AccountEntity[]> {
    const result = await this.session
      .select({ account: AccountModel })
      .from(AccountModel)
      .innerJoin(UserModel, eq(AccountModel.userId, UserModel.id))
      .where(eq(UserModel.email, email))

    const accounts = result.map(({ account }) => AccountEntityMapper.from(account))

    return accounts
  }

  async find(pk: string): Promise<AccountEntity | undefined> {
    const model = await this.session.query.account.findFirst({
      with: { user: true },
      where(fields, op) {
        return op.eq(fields.id, pk)
      },
    })

    if (!model) {
      return undefined
    }

    return AccountEntityMapper.from(model)
  }

  async one(pk: string): Promise<Result<AccountEntity, NoResultFoundError>> {
    const account = await this.find(pk)

    if (!account) {
      return err(new NoResultFoundError())
    }

    return ok(account)
  }

  async findall(offset?: number, limit?: number): Promise<AccountEntity[]> {
    const accounts = await this.session.query.account.findMany({ offset, limit })

    return accounts.map(AccountEntityMapper.from)
  }
}
