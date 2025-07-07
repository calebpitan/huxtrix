import { useId } from 'react'

import { InfoIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/auth'
import Google from '@/public/icons/google.svg'

export type ContinueWithGoogleProps = Readonly<{ redirectTo: string }>

export function ContinueWithGoogle({ redirectTo }: ContinueWithGoogleProps) {
  return (
    <div className="flex flex-col justify-items-center">
      <form
        action={async () => {
          'use server'
          await signIn('google', { redirectTo })
        }}
      >
        <Button size="lg" className="w-full rounded-full" type="submit">
          <Google />
          <span className="ms-4">Continue with Google</span>
        </Button>
      </form>
    </div>
  )
}

export type ContinueWithEmailProps = Readonly<{ redirectTo: string }>

export function ContinueWithEmail({ redirectTo }: ContinueWithEmailProps) {
  const magicLinkEmailInputId = useId()

  return (
    <div className="flex flex-col justify-items-center">
      {/* <div className="text-foreground/70 pb-4 text-sm">
            <div className="mb-2 text-center font-bold">Get a magic link</div>
          </div> */}

      <form
        action={async (formData) => {
          'use server'
          await signIn('resend', formData)
        }}
      >
        <div className="space-y-2">
          <Label htmlFor={magicLinkEmailInputId}>Email</Label>
          <Input
            id={magicLinkEmailInputId}
            name="email"
            className="placeholder:text-foreground/50 h-12 rounded-2xl"
            type="email"
            placeholder="neil.armstrong@example.com"
          />
          <div className="text-foreground/70 inline-flex items-center gap-2 text-xs">
            <InfoIcon width="1em" height="1em" />
            <span>
              You will get a short-lived, one-time link in your email that you can use to login.
            </span>
          </div>
        </div>

        <Button className="mt-8 h-12 w-full rounded-2xl font-bold" type="submit">
          <span>Continue</span>
        </Button>
      </form>
    </div>
  )
}
