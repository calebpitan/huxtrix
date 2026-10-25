import { AlertCircleIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

import * as Surface from './surface'
import { Alternate } from './alternate'
import { ContinueWithEmail } from './choices-email'
import { ContinueWithGoogle } from './choices-google'
import { AuthPageError, formatAuthError } from './format-auth-error'
import { LegalNotice } from './legal-notice'

export interface SignInProps {
  redirectTo?: string
  error?: AuthPageError
}

export function SignIn({ error, redirectTo = '/' }: SignInProps) {
  const formatting = formatAuthError(error)

  return (
    <Surface.Backdrop>
      {formatting && (
        <Alert variant="destructive" className="w-lg bg-background/40 dark:bg-muted/40 max-w-full">
          <AlertCircleIcon />
          <AlertTitle>{formatting.title}</AlertTitle>
          <AlertDescription>
            <p>{formatting.message}</p>
          </AlertDescription>
        </Alert>
      )}

      <Surface.Surface type="top">
        <div className="space-y-4">
          <div className="text-center text-2xl font-bold tracking-tighter md:text-3xl">Sign In</div>
          <LegalNotice />
        </div>

        <ContinueWithGoogle redirectTo={redirectTo} />

        <Separator orientation="horizontal" />

        <ContinueWithEmail
          message="You will get a one-time link in your email that you can use to login"
          redirectTo={redirectTo}
        />
      </Surface.Surface>

      <Surface.Surface type="extension">
        <Alternate cta="Create account" message="Dont't have an account?" href="/signup" />
      </Surface.Surface>
    </Surface.Backdrop>
  )
}
