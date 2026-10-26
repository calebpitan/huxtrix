'use server'

import { getLogger, withLogContext } from '@hux/logger'

import z from 'zod'

import { signIn } from '@/lib/auth/server'

interface EmailSignInFormState {
  errors: { email?: string[] }
  message?: string
  success?: boolean
}

const EmailSchema = z.object({
  email: z.email(),
  redirectTo: z.string().default('/'),
})

function toFieldErrors<T extends Record<string, unknown>>(
  a: Partial<Record<keyof T, { errors: string[] }>>,
) {
  return Object.fromEntries(
    Object.entries(a).map(([k, v]) => {
      return [k as keyof T, v?.errors] as const
    }),
  ) as Partial<Record<keyof T, string[]>>
}

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof error.digest === 'string' &&
    error.digest.startsWith('NEXT_REDIRECT')
  )
}

export const emailSignInAction = async (formState: EmailSignInFormState, formData: FormData) => {
  return withLogContext({ action: 'emailSignIn' }, async () => {
    const log = getLogger()
    const validation = await EmailSchema.safeParseAsync({
      email: formData.get('email'),
      redirectTo: formData.get('redirectTo'),
    })

    if (!validation.success) {
      const errors = toFieldErrors(z.treeifyError(validation.error).properties!)
      log.warn('email sign in validation failed', {
        fields: errors,
      })
      return {
        ...formState,
        success: false,
        errors,
      }
    }

    try {
      const data = validation.data

      Object.entries(data).forEach(([k, v]) => formData.set(k, v))

      await signIn('resend', formData)
    } catch (e) {
      if (isNextRedirect(e)) throw e
      log.error('email sign in failed', e)
      return {
        ...formState,
        success: false,
        message: e instanceof Error ? e.message : 'Sign in failed',
      }
    }

    return formState
  })
}
