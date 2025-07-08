import { Metadata } from 'next'

import { SignUp } from '@/compositions/auth'

type SignUpPageProps = Readonly<{ searchParams: Promise<{ error?: string; identifier?: string }> }>

export const metadata: Metadata = {
  title: 'Create an account — Huxtrix',
  description: 'Join creators from across the world and make a big change from a small place.',
}

export default async function SignUpPage({ searchParams: searchParamsPromise }: SignUpPageProps) {
  const searchParams = await searchParamsPromise

  const error = searchParams.error
    ? { code: searchParams.error, identifier: searchParams.identifier }
    : undefined

  return <SignUp error={error} />
}
