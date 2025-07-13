/// <reference path="../../../node_modules/next-auth/jwt.d.ts" />

import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { AccountModel, Database, SessionModel, UserModel } from '@hux/datasource'
import { VerificationTokenModel, sql, ulid } from '@hux/datasource'

import NextAuth from 'next-auth'
import type { NextAuthConfig, NextAuthResult } from 'next-auth'
import { Adapter } from 'next-auth/adapters'

import Google, { GoogleProfile } from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'

type InitAuthEmailOptions = { serverAddress: string }

export type InitAuthOptions = Pick<NextAuthConfig, 'pages' | 'debug'> & {
  email: InitAuthEmailOptions
  sessionStrategy?: 'jwt' | 'database'
  getIntent(): Promise<AuthIntent | undefined>
  getBaseUrl(): Promise<string>
}

export type Auth = NextAuthResult['auth']
export type AuthIntent = 'signin' | 'signup'

export interface HxAuthResult extends NextAuthResult {
  auth: Auth
}

function createAdapter(session: Database): Adapter {
  const adapter = DrizzleAdapter(session, {
    accountsTable: AccountModel.table,
    usersTable: UserModel.table,
    sessionsTable: SessionModel.table,
    verificationTokensTable: VerificationTokenModel.table,
  })

  return adapter
}

export const AuthErrorCodes = {
  acoountNotFound: 'account_not_found',
  invalidEmail: 'invlaid_email',
  SessionRequired: 'SessionRequired',
  OAuthAccountNotLinked: 'OAuthAccountNotLinked',
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
            id: ulid(),
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

        const [result] = await session.execute<Record<'exists', boolean>>(sql`
          SELECT EXISTS (
            SELECT 1 
              FROM ${UserModel.table}
              WHERE ${UserModel.table.email} = ${email}
              AND ${UserModel.table.deletedAt} IS NULL
          )
        `)

        if (!result!.exists) {
          const query = new URLSearchParams({
            error: AuthErrorCodes.acoountNotFound,
            identifier: email,
          })
          return `${origin}${pathname}?${query.toString()}`
        }

        return true
      },
      jwt({ token, user }) {
        if (user) {
          token.id = user.id
        }

        return token
      },
      session({ session, token }) {
        if (token) {
          session.user.id = token.id
        }
        return session
      },
    },
  })

  return result
}

export type { Session } from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    image: string | null
  }
  interface Session {
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    exp: number
    iat: number
    jti: number
    name: string | null
    picture: string | null
    sub: string
  }
}
