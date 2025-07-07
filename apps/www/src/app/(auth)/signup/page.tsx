import { SignUp } from '@/compositions/auth'

type SignUpPageProps = Readonly<{ searchParams: Promise<{ error?: string; identifier?: string }> }>

export default async function SignUpPage({ searchParams: searchParamsPromise }: SignUpPageProps) {
  const searchParams = await searchParamsPromise

  const error = searchParams.error
    ? { code: searchParams.error, identifier: searchParams.identifier }
    : undefined

  return <SignUp error={error} />
}
