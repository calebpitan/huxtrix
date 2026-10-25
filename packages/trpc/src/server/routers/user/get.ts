import { ID } from '@hux/datasource'

import z from 'zod'

import { apiProcedure } from '../../../server/trpc'
import { queryUserByID, queryUserByUsername } from '../../../services/user/query'

export const getUserByID = apiProcedure
  .input(z.object({ id: ID }))
  .query(async ({ ctx, input }) => {
    return ctx.runEffect(queryUserByID(input.id))
  })

export const getUserByUsername = apiProcedure
  .input(z.object({ username: z.string() }))
  .query(async ({ ctx, input }) => {
    return ctx.runEffect(queryUserByUsername(input.username))
  })
