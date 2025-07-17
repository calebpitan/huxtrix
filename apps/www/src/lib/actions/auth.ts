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

export const emailSignInAction = async (formState: EmailSignInFormState, formData: FormData) => {
  const validation = await EmailSchema.safeParseAsync({
    email: formData.get('email'),
    redirectTo: formData.get('redirectTo'),
  })

  if (!validation.success) {
    return {
      ...formState,
      success: false,
      errors: validation.error.flatten().fieldErrors,
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
