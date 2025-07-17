import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth/server'
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
