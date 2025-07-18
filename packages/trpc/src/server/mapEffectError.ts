import { MultipleResultsFoundError, NoResultFoundError } from '@hux/datasource'
import { TRPCError } from '@trpc/server'

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

export function mapEffectError(error: unknown): TRPCError {
  console.error('Mapping Error: ', error)

  const trpcError = mapUserEffectError(error) ?? mapGenericError(error)

  return trpcError
}
