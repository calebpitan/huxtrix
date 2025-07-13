import { HxAuthResult } from '@hux/auth'
import { AccountRepository, DatabaseSession, UnitOfWork, UserRepository } from '@hux/datasource'

import { Context } from 'effect'

export class AuthMiddlewareDep extends Context.Tag('AuthMiddlewareDep')<
  AuthMiddlewareDep,
  Pick<HxAuthResult, 'auth'>
>() {}

export class DatabaseSessionDep extends Context.Tag('DatabaseSessionDep')<
  DatabaseSessionDep,
  DatabaseSession
>() {}

export class UserRepositoryDep extends Context.Tag('UserRepositoryDep')<
  UserRepositoryDep,
  UserRepository<DatabaseSession>
>() {}

export class AccountRepositoryDep extends Context.Tag('AccountRepositoryDep')<
  AccountRepositoryDep,
  AccountRepository<DatabaseSession>
>() {}

export class UserUoWDep extends Context.Tag('UserUoWDep')<
  UserUoWDep,
  UnitOfWork<UserRepository<DatabaseSession>>
>() {}
