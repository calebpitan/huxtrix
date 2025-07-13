import { appRouter, createTRPCContext, createTRPCRuntime } from '@hux/trpc'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { NextRequest } from 'next/server'

import { auth } from '@/lib/auth/server'
import { database } from '@/lib/datasource'

const handler = async (req: NextRequest) => {
  return await database.transaction(async (tx) => {
    const AppRuntime = createTRPCRuntime({ session: tx, auth })
    const createContext = await AppRuntime.runPromise(createTRPCContext)

    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      createContext: (opts) => createContext({ runtime: AppRuntime, ...opts }),
      onError: (opts) => console.error('An Error Occurred: ', opts.error),
    })

    return response
  })
}

export { handler as GET, handler as POST }
