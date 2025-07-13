import { AccountEntity, AccountEntityMapper } from '../entities/account'
import { AccountDict, AccountModel } from '../schema/account/model'
import { UserModel } from '../schema/user/model'
import { DatabaseSession, LoadOptions } from '../type'
import { FindAllOptions, Mapper, RepositoryFactory } from './base'

const KEY = 'account'
const LOAD_OPTIONS = { user: true } as const satisfies LoadOptions<'account'>

export class AccountRepository<S extends DatabaseSession> extends RepositoryFactory(
  KEY,
  AccountModel.table,
  LOAD_OPTIONS,
)<S, AccountEntity, Mapper<AccountDict, AccountEntity>> {
  constructor(public readonly session: S) {
    super(session, AccountEntityMapper)
  }

  async findByEmail(email: string): Promise<AccountEntity[]> {
    const result = await this.session.query.account.findMany({
      with: LOAD_OPTIONS,
      where(_fields, op) {
        return op.eq(UserModel.table.email, email)
      },
    })

    const accounts = result.map((account) => AccountEntityMapper.from(AccountModel.new(account)))

    return accounts
  }
}
