import { cache } from 'react'

import { getLogger } from '@hux/logger'
import { TRPCError, initTRPC } from '@trpc/server'

import { Effect, Exit, ManagedRuntime } from 'effect'
import superjson from 'superjson'

import { Context, createContext, createContextInner } from './createContext'
import { mapEffectError, readPrettyCause } from './mapEffectError'
import { createTRPCMiddlewares } from './middlewares'

const SERVER_FAILURE_CODES = new Set<TRPCError['code']>([
  'INTERNAL_SERVER_ERROR',
  'NOT_IMPLEMENTED',
  'BAD_GATEWAY',
  'SERVICE_UNAVAILABLE',
  'GATEWAY_TIMEOUT',
])

const loggedFailure = Symbol.for('@hux/trpc/logged-failure')

function failureFields(error: unknown, fields: Record<string, unknown>) {
  const prettyCause = readPrettyCause(error)
  if (prettyCause === undefined) return fields
  return { ...fields, prettyCause }
}

function markLogged(error: unknown) {
  if (typeof error !== 'object' || error === null) return
  try {
    Object.defineProperty(error, loggedFailure, { value: true })
  } catch {
    // The error already carries the mark, or it rejects new properties.
  }
}

function logTRPCFailure(message: string, error: unknown, fields: Record<string, unknown>) {
  const log = getLogger()
  const loggedFields = failureFields(error, fields)
  if (error instanceof TRPCError && !SERVER_FAILURE_CODES.has(error.code)) {
    log.warn(message, { ...loggedFields, err: error })
  } else {
    log.error(message, error, loggedFields)
  }
  markLogged(error)
}

/** Logs request failures that the procedure middleware did not already record. */
export function logTRPCHandlerError(error: unknown, fields: { path?: string; type?: string }) {
  if (typeof error === 'object' && error !== null && loggedFailure in error) return
  logTRPCFailure('tRPC request failed', error, fields)
}

export type TRPCRoot = typeof t

const t = initTRPC.context<Context>().create({ transformer: superjson })

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory

export const createTRPCContext = createContext.pipe(Effect.map((v) => cache(v)))
export const createTRPCContextInner = createContextInner.pipe(Effect.map((v) => cache(v)))

export const publicProcedure = t.procedure.use(async ({ ctx, next, path, type }) => {
  if (!ctx.runtime) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'No runtime was provided' })
  }

  const runtime = ctx.runtime

  type Deps = typeof runtime extends ManagedRuntime.ManagedRuntime<infer R, never> ? R : never

  const started = Date.now()
  const result = await next({
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

  const fields = { path, type, durationMs: Date.now() - started }
  const log = getLogger()
  if (!result.ok) {
    logTRPCFailure('tRPC procedure failed', result.error, fields)
  } else if (type === 'mutation') {
    log.info('tRPC procedure completed', fields)
  } else {
    log.debug('tRPC procedure completed', fields)
  }

  return result
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
