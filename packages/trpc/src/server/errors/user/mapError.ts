import { TRPCError } from '@trpc/server'

import { UserExistsError } from './exists'

export function mapUserEffectError(error: unknown): TRPCError | undefined {
  if (error instanceof UserExistsError) {
    return new TRPCError({
      code: 'CONFLICT',
      message: error.message,
      cause: error,
    })
  }
}
