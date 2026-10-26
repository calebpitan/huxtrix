import { MultipleResultsFoundError, NoResultFoundError } from '@hux/datasource'
import { TRPCError } from '@trpc/server'

import { type Cause, pretty } from 'effect/Cause'

import { mapUserEffectError } from './errors/user/mapError'

function mapGenericError(error: unknown): TRPCError {
  if (error instanceof NoResultFoundError) {
    return new TRPCError({ code: 'NOT_FOUND', message: error.message, cause: error })
  }

  if (error instanceof MultipleResultsFoundError) {
    return new TRPCError({ code: 'CONFLICT', message: error.message, cause: error })
  }

  if (error instanceof Error) {
    return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message, cause: error })
  }

  return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unknown error', cause: error })
}

const prettyCauseKey = Symbol.for('@hux/trpc/pretty-cause')

export function readPrettyCause(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !(prettyCauseKey in error)) return undefined
  const value = (error as { [prettyCauseKey]?: unknown })[prettyCauseKey]
  return typeof value === 'string' ? value : undefined
}

function withPrettyCause(error: TRPCError, cause: Cause<unknown>): TRPCError {
  Object.defineProperty(error, prettyCauseKey, { value: pretty(cause) })
  return error
}

export function mapEffectError(cause: Cause<unknown>): TRPCError {
  switch (cause._tag) {
    case 'Fail':
      return mapUserEffectError(cause.error) ?? mapGenericError(cause.error)
    default:
      return withPrettyCause(
        new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unknown error',
        }),
        cause,
      )
  }
}
