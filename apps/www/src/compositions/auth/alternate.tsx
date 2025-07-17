import Link from 'next/link'

import { Button } from '@/components/ui/button'

export interface AlternateProps {
  message: string
  href: string
  cta: string
}

export function Alternate(props: AlternateProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-foreground/70 text-sm font-medium">{props.message}</div>
      <Button
        size="sm"
        variant="link"
        asChild
        className="rounded-full bg-fuchsia-500/30 text-black hover:bg-fuchsia-500/20 dark:bg-fuchsia-300/70 dark:hover:bg-fuchsia-300/60"
      >
        <Link href={props.href}>{props.cta}</Link>
      </Button>
    </div>
  )
}
