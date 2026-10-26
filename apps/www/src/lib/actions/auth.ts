'use server'

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

export const emailSignInAction = async (formState: EmailSignInFormState, formData: FormData) => {
  const validation = await EmailSchema.safeParseAsync({
    email: formData.get('email'),
    redirectTo: formData.get('redirectTo'),
  })

  if (!validation.success) {
    return {
      ...formState,
      success: false,
      errors: toFieldErrors(z.treeifyError(validation.error).properties!),
    }
  }

  try {
    const data = validation.data

    Object.entries(data).forEach(([k, v]) => formData.set(k, v))

    await signIn('resend', formData)
  } catch (e) {
    if (e instanceof Error) {
      return {
        ...formState,
        success: false,
        message: e.message,
      }
    }
  }

  return formState
}
