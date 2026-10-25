import { getQueryClient } from '@hux/trpc'

import { auth } from '../auth/server'
import { trpc } from '../trpc/server'
import { User } from './types'

export type { User }

export async function getSessionUser() {
  const session = await auth()

  if (!session) return null

  const qc = getQueryClient()
  return await qc.fetchQuery(
    trpc.user.getByID.queryOptions({
      id: session.user.id,
    }),
  )
}

export async function getUserByUsername(username: string) {
  const qc = getQueryClient()

  return await qc.fetchQuery(
    trpc.user.getByUsername.queryOptions({
      username,
    }),
  )
}
