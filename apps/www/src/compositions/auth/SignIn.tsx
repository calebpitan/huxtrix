import { Fragment } from 'react'

import { AuthErrorCodes } from '@hux/auth'

import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { evaluate } from '@/lib/utils'

import * as Surface from './surface'
import { ContinueWithEmail, ContinueWithGoogle } from './choices'
import { LegalNotice } from './legal-notice'

export interface SignInProps {
  redirectTo?: string
  error?: { code: string; identifier?: string }
}

export function SignIn({ error, redirectTo = '/' }: SignInProps) {
  const formatting = evaluate(() => {
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
      default:
        return {
          title: 'Unknown Error',
          message: 'An unknown error has occured, please try signing in at another time',
        }
    }
  })

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

        <ContinueWithEmail redirectTo={redirectTo} />
      </Surface.Surface>

      <Surface.Surface type="extension">
        <div className="flex items-center justify-between">
          <div className="text-foreground/70 text-sm font-medium">Dont&apos;t have an account?</div>
          <Button size="sm" variant="link" asChild>
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </Surface.Surface>
    </Surface.Backdrop>
  )
}
