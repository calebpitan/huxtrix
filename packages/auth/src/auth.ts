import { DrizzleAdapter } from '@auth/drizzle-adapter'
import {
  AccountModel,
  Database,
  SessionModel,
  UserModel,
  VerificationTokenModel,
  sql,
} from '@hux/datasource'

import NextAuth from 'next-auth'
import type { NextAuthConfig, NextAuthResult } from 'next-auth'
import { Adapter } from 'next-auth/adapters'
import Google, { GoogleProfile } from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'

interface HxAuthResult extends NextAuthResult {
  auth: Auth
}

type InitAuthEmailOptions = { serverAddress: string }

export type InitAuthOptions = Pick<NextAuthConfig, 'pages' | 'debug'> & {
  email: InitAuthEmailOptions
  sessionStrategy?: 'jwt' | 'database'
  getIntent(): Promise<AuthIntent | undefined>
  getBaseUrl(): Promise<string>
}

export type Auth = NextAuthResult['auth']
export type AuthIntent = 'signin' | 'signup'

function createAdapter(session: Database): Adapter {
  const adapter = DrizzleAdapter(session, {
    accountsTable: AccountModel,
    usersTable: UserModel,
    sessionsTable: SessionModel,
    verificationTokensTable: VerificationTokenModel,
  })

  return adapter
}

export const AuthErrorCodes = {
  acoountNotFound: 'account_not_found',
  invalidEmail: 'invlaid_email',
} as const

/**
 * Initialize an authentication object that can be used to
 * setup authentication endpoints, sign in, and sign out from the server
 *
 * **Note:** These methods are only safe to be called from the server
 *
 * @param session The `PostgresJsDatabase` session instance
 * @returns The initialized authentication object
 */
export function initAuth(session: Database, options: InitAuthOptions): HxAuthResult {
  const result = NextAuth({
    adapter: createAdapter(session),
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
    pages: options.pages,
    session: { strategy: options.sessionStrategy ?? 'jwt' },
    callbacks: {
      async signIn({ user, email: emailOptions }) {
        const email = user.email?.trim()
        const pathname = options.pages?.signIn ?? '/api/auth/signin'
        const [intent, origin] = await Promise.all([
          await options.getIntent(),
          options.getBaseUrl(),
        ])

        if (!intent || intent === 'signup') {
          return true
        }

        // TODO: validate the email
        if (!email) {
          const query = new URLSearchParams({ error: AuthErrorCodes.invalidEmail })
          return `${origin}${pathname}?${query.toString()}`
        }

        const [{ exists }] = await session.execute<Record<'exists', boolean>>(sql`
          SELECT EXISTS (
            SELECT 1 
              FROM ${UserModel}
              WHERE ${UserModel.email} = ${email}
              AND ${UserModel.deletedAt} IS NULL
          )
        `)

        if (!exists) {
          const query = new URLSearchParams({
            error: AuthErrorCodes.acoountNotFound,
            identifier: email,
          })
          return `${origin}${pathname}?${query.toString()}`
        }

        return true
      },
    },
  })

  return result
}
