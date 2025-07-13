import { ID } from '@hux/datasource'

import { Effect } from 'effect'
import z from 'zod'

import { protectedProcedure } from '../../../server/trpc'
import { UserRepositoryDep } from '../../../services/injection'

export const updateUser = protectedProcedure
  .input(
    z.object({
      id: ID,
      data: z.object({
        firstName: z.string(),
        lastName: z.string(),
        username: z.string().regex(/^[A-Za-z](?:[A-Za-z0-9-])*$/),
      }),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return await ctx.runEffect(
      Effect.gen(function* () {
        const repo = yield* UserRepositoryDep

        const result = yield* Effect.promise(() =>
          repo.update(input.id, {
            name: {
              first: input.data.firstName,
              last: input.data.lastName,
            },
            username: input.data.username,
          }),
        )

        if (result.isErr()) {
          return yield* Effect.fail(result.error)
        }

        return result.value
      }),
    )
  })
