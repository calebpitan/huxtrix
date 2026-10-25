import { TRPCError } from '@trpc/server'

import { UserExistsError } from './exists'
import { UserNotFoundError } from './notfound'

export function mapUserEffectError(error: unknown): TRPCError | undefined {
  if (error instanceof UserExistsError) {
    return new TRPCError({
      code: 'CONFLICT',
      message: error.message,
      cause: error,
    })
  }

  if (error instanceof UserNotFoundError) {
    return new TRPCError({
      code: 'NOT_FOUND',
      message: error.message,
      cause: error
    })
  }
}
