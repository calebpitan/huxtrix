import { ID } from '@hux/datasource'

import { Effect } from 'effect'
import z from 'zod'

import { apiProcedure } from '../../../server/trpc'
import { UserRepositoryDep } from '../../../services/injection'

export const getUserByID = apiProcedure
  .input(z.object({ id: ID }))
  .query(async ({ ctx, input }) => {
    return ctx.runEffect(
      Effect.gen(function* () {
        const repo = yield* UserRepositoryDep

        const result = yield* Effect.promise(() => repo.one(input.id))

        if (result.isErr()) {
          return yield* Effect.fail(result.error)
        }

        return result.value
      }),
    )
  })
