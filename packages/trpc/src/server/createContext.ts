import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

import { Effect } from 'effect'

import { AuthMiddlewareDep, DatabaseSessionDep } from '../services/injection'
import { createTRPCRuntime } from './createRuntime'

export interface TRPCUser {
  id: string
  email: string
  name: string
  image: string | null
}

export interface TRPCSession {
  expires: string
  user: TRPCUser
}

export type TRPCSessionFn = () => Promise<TRPCSession | null>

export interface CreateTRPCContextOptions extends FetchCreateContextFnOptions {
  runtime: ReturnType<typeof createTRPCRuntime>
}

export interface CreateInnerTRPCContextOptions extends Partial<CreateTRPCContextOptions> {
  session: TRPCSession | null
  runtime: ReturnType<typeof createTRPCRuntime>
}

export type ContextOuter = Awaited<ReturnType<Effect.Effect.Success<typeof createContext>>>
export type ContextInner = Awaited<ReturnType<Effect.Effect.Success<typeof createContextInner>>>
export type Context = ContextInner | ContextOuter

export const createContext = Effect.gen(function* () {
  const { auth } = yield* AuthMiddlewareDep
  const getContextInner = yield* createContextInner

  return async function createContext(opts: CreateTRPCContextOptions) {
    const session = await auth()
    const contextInner = await getContextInner({ ...opts, session })
    return {
      ...contextInner,
      info: opts.info,
      req: opts.req,
      res: { headers: opts.resHeaders } as Record<'headers', Headers>,
      runtime: opts.runtime,
      session,
    }
  }
})

export const createContextInner = Effect.gen(function* () {
  const database = yield* DatabaseSessionDep

  return async function createInnerContext(opts: CreateInnerTRPCContextOptions) {
    return {
      db: database,
      info: opts.info,
      req: opts.req,
      res: { headers: opts.resHeaders } as Record<'headers', Headers | undefined>,
      session: opts.session,
      runtime: opts.runtime,
    }
  }
})
