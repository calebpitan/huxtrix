import { useId } from 'react'

import { InfoIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { signIn } from '@/lib/auth'
import Google from '@/public/icons/google.svg'

export function SignIn() {
  const magicLinkEmailInputId = useId()
  return (
    <div className="bg-muted dark:bg-background bg-radial-[at_80%_75%] mask-radial-at-bottom-left flex w-full flex-col items-center justify-items-center gap-8 from-fuchsia-300 via-indigo-300 to-orange-200 py-12 dark:[background-image:none]">
      <div className="bg-background/40 dark:bg-muted/40 lg:rounded-4xl w-lg border-border max-w-full space-y-8 border p-4 sm:p-8 lg:p-12">
        <div className="space-y-4">
          <div className="text-center text-2xl font-bold md:text-3xl">Sign In</div>
          <div className="text-accent-foreground text-justify text-sm">
            <p>
              By continuing, you agree to our{' '}
              <Link
                href="/tos"
                className="font-medium underline underline-offset-4 transition-[text-underline-offset] duration-300 hover:underline-offset-2"
              >
                User Agreement
              </Link>{' '}
              and acknowledge that you understand the{' '}
              <Link
                href="/privacy"
                className="font-medium underline underline-offset-4 transition-[text-underline-offset] duration-300 hover:underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-items-center">
          <form
            action={async () => {
              'use server'
              await signIn('google')
            }}
          >
            <Button size="lg" className="w-full rounded-full" type="submit">
              <Google />
              <span className="ms-4">Continue with Google</span>
            </Button>
          </form>
        </div>

        <Separator orientation="horizontal" />

        <div>
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
      </div>

      <div className="bg-background/40 dark:bg-muted/40 w-lg border-border max-w-full space-y-8 border p-2 ps-4 lg:rounded-full">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-foreground/70">Dont&apos;t have an account?</div>
          <Button size="sm" className='rounded-full bg-fuchsia-500/30 dark:bg-fuchsia-300/70 dark:hover:bg-fuchsia-300/60 hover:bg-fuchsia-500/20 text-black'>Create Account</Button>
        </div>
      </div>
    </div>
  )
}
