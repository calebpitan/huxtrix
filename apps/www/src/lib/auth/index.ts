import 'server-only'

import { Auth, initAuth } from '@hux/auth'

import { SERVER_EMAIL_ADDRESS } from '@/lib/config/server'
import { database } from '@/lib/datasource'

const { handlers, signIn, signOut, ...apis } = initAuth(database, {
  email: { serverAddress: SERVER_EMAIL_ADDRESS },
})

const auth: Auth = apis.auth

export { auth, handlers, signIn, signOut }
