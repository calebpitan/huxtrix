import { SignIn } from '@/compositions/auth'

type SignInPageProps = Readonly<{ searchParams: Promise<{ error?: string; identifier?: string }> }>

export default async function SignInPage({ searchParams: searchParamsPromise }: SignInPageProps) {
  const searchParams = await searchParamsPromise

  const error = searchParams.error
    ? { code: searchParams.error, identifier: searchParams.identifier }
    : undefined

  return <SignIn error={error} />
}
