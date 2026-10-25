import { Fragment, ReactNode } from 'react'

import { AuthErrorCodes } from '@hux/auth'

export interface AuthPageError {
  code: string
  identifier?: string
}

export interface FormattedAuthError {
  title: string
  message: ReactNode
}

const providerFailureCodes = new Set<string>([
  AuthErrorCodes.OAuthSignin,
  AuthErrorCodes.OAuthCallback,
  AuthErrorCodes.OAuthCreateAccount,
  AuthErrorCodes.Callback,
  AuthErrorCodes.EmailSignin,
])

export function formatAuthError(error?: AuthPageError): FormattedAuthError | undefined {
  if (!error?.code) {
    return undefined
  }

  switch (error.code) {
    case AuthErrorCodes.acoountNotFound:
      return {
        title: 'Account Not Found',
        message: error.identifier ? (
          <Fragment>
            User with email address <strong>{error.identifier}</strong> does not exist
          </Fragment>
        ) : (
          'User account not found'
        ),
      }

    case AuthErrorCodes.SessionRequired:
      return undefined

    case AuthErrorCodes.Configuration:
      return {
        title: 'Server error',
        message: 'Something is wrong with sign-in on our side.',
      }

    case AuthErrorCodes.AccessDenied:
      return {
        title: 'Access denied',
        message: 'This account is not allowed to sign in.',
      }

    case AuthErrorCodes.Verification:
      return {
        title: 'Link expired',
        message: 'The email link is no longer valid. It may have been used or it expired.',
      }

    case AuthErrorCodes.OAuthAccountNotLinked:
      return {
        title: 'Account already linked',
        message: 'Sign in with the method used originally.',
      }

    default:
      if (providerFailureCodes.has(error.code)) {
        return {
          title: 'Sign-in failed',
          message: 'The provider could not finish. Try again.',
        }
      }

      return {
        title: 'Something went wrong',
        message: 'Sign-in could not be completed.',
      }
  }
}
