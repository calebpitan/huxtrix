import { Metadata } from 'next'

import { SignIn } from '@/compositions/auth'

type SignInPageProps = Readonly<{ searchParams: Promise<{ error?: string; identifier?: string }> }>

export const metadata: Metadata = {
  title: 'Sign in to your account — Huxtrix',
  description: 'Pick up where you left off! Improve your experience by singing in',
}

export default async function SignInPage({ searchParams: searchParamsPromise }: SignInPageProps) {
  const searchParams = await searchParamsPromise

  const error = searchParams.error
    ? { code: searchParams.error, identifier: searchParams.identifier }
    : undefined

  return <SignIn error={error} />
}
