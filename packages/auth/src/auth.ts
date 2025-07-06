import { DrizzleAdapter } from '@auth/drizzle-adapter'
import {
  AccountModel,
  Database,
  SessionModel,
  UserModel,
  VerificationTokenModel,
} from '@hux/datasource'

import NextAuth from 'next-auth'
import type { NextAuthResult } from 'next-auth'
import { Adapter } from 'next-auth/adapters'
import Google, { GoogleProfile } from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'

interface HxAuthResult extends NextAuthResult {
  auth: Auth
}

type InitAuthEmailOptions = { serverAddress: string }
type InitAuthOptions = { email: InitAuthEmailOptions; debug?: boolean }

export type Auth = NextAuthResult['auth']

function createAdapter(db: Database): Adapter {
  const adapter = DrizzleAdapter(db, {
    accountsTable: AccountModel,
    usersTable: UserModel,
    sessionsTable: SessionModel,
    verificationTokensTable: VerificationTokenModel,
  })

  return adapter
}

/**
 * Initialize an authentication object that can be used to
 * setup authentication endpoints, sign in, and sign out from the server
 *
 * **Note:** These methods are only safe to be called from the server
 *
 * @param db The `PostgresJsDatabase` instance
 * @returns The initialized authentication object
 */
export function initAuth(db: Database, options: InitAuthOptions): HxAuthResult {
  const result = NextAuth({
    adapter: createAdapter(db),
    providers: [
      Google<GoogleProfile>({
        profile(profile) {
          return {
            email: profile.email,
            image: profile.picture,
            name: profile.name,
            givenName: profile.given_name,
            familyName: profile.family_name,
          }
        },
      }),
      Resend({ from: options.email.serverAddress }),
    ],
    debug: options.debug,
  })

  return result
}
