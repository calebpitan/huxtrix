import { cache } from 'react'

import { TRPCError, initTRPC } from '@trpc/server'

import { Effect, Exit, ManagedRuntime } from 'effect'
import superjson from 'superjson'

import { Context, createContext, createContextInner } from './createContext'
import { mapEffectError } from './mapEffectError'
import { createTRPCMiddlewares } from './middlewares'

export type TRPCRoot = typeof t

const t = initTRPC.context<Context>().create({ transformer: superjson })

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory

export const createTRPCContext = createContext.pipe(Effect.map((v) => cache(v)))
export const createTRPCContextInner = createContextInner.pipe(Effect.map((v) => cache(v)))

export const publicProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.runtime) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'No runtime was provided' })
  }

  const runtime = ctx.runtime

  type Deps = typeof runtime extends ManagedRuntime.ManagedRuntime<infer R, never> ? R : never

  return next({
    ctx: {
      ...ctx,
      runtime,
      async runEffect<A, E, R extends Deps = never>(effect: Effect.Effect<A, E, R>): Promise<A> {
        const exit = await runtime.runPromiseExit(effect)

        if (Exit.isFailure(exit)) {
          throw mapEffectError(exit.cause)
        }

        return exit.value
      },
    },
  })
})

export const apiProcedure = publicProcedure.use((opts) => {
  if (!opts.ctx.req || !opts.ctx.res) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'You are missing `req` or `res` in your call.',
    })
  }

  return opts.next({
    ctx: {
      req: opts.ctx.req,
      res: opts.ctx.res,
    },
  })
})

export const protectedProcedure = apiProcedure.use((opts) => {
  if (!opts.ctx.session?.user?.email) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }

  return opts.next({
    ctx: {
      session: opts.ctx.session,
    },
  })
})

export const Middlewares = createTRPCMiddlewares(t)
