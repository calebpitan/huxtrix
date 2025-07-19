import 'server-only'

import { type AppRouter, createExternalTRPC } from '@hux/trpc'

import { evaluate } from '../utils'

export function getUrl() {
  const base = evaluate(() => {
    if (typeof window !== 'undefined') return ''
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return 'http://localhost:3000'
  })

  return `${base}/api/trpc`
}

export const trpc = createExternalTRPC<AppRouter>({ externalUrl: getUrl() })
