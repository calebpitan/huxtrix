import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'
import { userRouter } from './user/router'

export const appRouter = createTRPCRouter({
  user: userRouter,
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      }
    }),
})

export type AppRouter = typeof appRouter
