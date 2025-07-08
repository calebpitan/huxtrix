'use client'

import { Fragment, useActionState, useId } from 'react'

import { AlertCircleIcon, InfoIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { emailSignInAction } from '@/lib/actions/auth'

export type ContinueWithEmailProps = Readonly<{ message: string; redirectTo: string }>

export function ContinueWithEmail({ message, redirectTo }: ContinueWithEmailProps) {
  const emailId = useId()

  const [state, action, pending] = useActionState(emailSignInAction, {
    errors: { email: undefined },
    success: undefined,
    message: 'Successful',
  })

  return (
    <div className="flex flex-col justify-items-center">
      <form action={action} noValidate>
        <div className="space-y-2">
          <Label htmlFor={emailId}>Email</Label>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Input
            id={emailId}
            className="placeholder:text-foreground/50 aria-[invalid=true]:[&_+_div]:text-destructive h-12 rounded-2xl"
            name="email"
            type="email"
            placeholder="neil.armstrong@example.com"
            aria-invalid={state.errors.email !== undefined}
          />

          <div className="text-foreground/70 inline-flex items-center gap-2 text-xs">
            {state.errors.email === undefined ? (
              <Fragment>
                <InfoIcon width="1em" height="1em" />
                <span>{message}</span>
              </Fragment>
            ) : (
              <Fragment>
                <AlertCircleIcon width="1em" height="1em" />
                <span>{state.errors.email.join(', ')}</span>
              </Fragment>
            )}
          </div>
        </div>

        <Button className="mt-8 h-12 w-full rounded-2xl font-bold" disabled={pending} type="submit">
          <span>Continue</span>
        </Button>
      </form>
    </div>
  )
}
