import { AccountRepository, DatabaseSession, UserRepository } from '@hux/datasource'

import { Effect, Layer, ManagedRuntime } from 'effect'

import { AccountRepositoryDep, AuthMiddlewareDep, DatabaseSessionDep } from '../services/injection'
import { UserRepositoryDep } from '../services/injection'
import type { TRPCSessionFn } from './createContext'

interface TRPCRuntimeOptions<F extends TRPCSessionFn = TRPCSessionFn> {
  session: DatabaseSession
  auth: F
}

export function createTRPCRuntime(options: TRPCRuntimeOptions) {
  const DatabaseSessionLayer = Layer.succeed(DatabaseSessionDep, options.session)
  const AuthMiddlewareLayer = Layer.succeed(AuthMiddlewareDep, { auth: options.auth })
  const BaseLayer = Layer.mergeAll(DatabaseSessionLayer, AuthMiddlewareLayer)

  const AccountRepositoryLayer = Layer.effect(
    AccountRepositoryDep,
    Effect.gen(function* () {
      const session = yield* DatabaseSessionDep
      return new AccountRepository(session)
    }),
  ).pipe(Layer.provide(BaseLayer))

  const UserRepositoryLayer = Layer.effect(
    UserRepositoryDep,
    Effect.gen(function* () {
      const session = yield* DatabaseSessionDep
      return new UserRepository(session)
    }),
  ).pipe(Layer.provide(BaseLayer))

  const AppLayer = Layer.mergeAll(AccountRepositoryLayer, UserRepositoryLayer, BaseLayer)
  const AppRuntime = ManagedRuntime.make(AppLayer)

  return AppRuntime
}
