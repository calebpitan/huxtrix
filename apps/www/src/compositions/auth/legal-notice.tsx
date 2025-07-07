import Link from 'next/link'

export function LegalNotice() {
  return (
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
  )
}
