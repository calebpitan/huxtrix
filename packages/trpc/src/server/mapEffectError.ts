import { MultipleResultsFoundError, NoResultFoundError } from '@hux/datasource'
import { TRPCError } from '@trpc/server'

export function mapEffectError(error: unknown): TRPCError {
  console.error('Mapping Error: ', error)

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
