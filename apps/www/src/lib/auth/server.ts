import 'server-only'

import { Auth, type InitAuthOptions, initAuth } from '@hux/auth'

import { cookies, headers } from 'next/headers'

import { config } from '@/lib/config/server'
import { database } from '@/lib/datasource'
import { getServerOrigin } from '@/lib/server'

const options: InitAuthOptions = {
  debug: config.env === 'development',
  email: { serverAddress: config.serverEmailAddress },
  async getBaseUrl() {
    const baseUrl = getServerOrigin(await headers()) ?? config.baseUrl
    return baseUrl
  },
  async getIntent() {
    const cookie = await cookies()
    const intent = cookie.get('auth.intent')?.value

    return intent === 'signin' || intent === 'signup' ? intent : undefined
  },
  pages: {
    signIn: '/signin',
  },
  sessionStrategy: 'jwt',
}

const { handlers, signIn, signOut, ...apis } = initAuth(database, options)

const auth: Auth = apis.auth

export { auth, handlers, signIn, signOut }
