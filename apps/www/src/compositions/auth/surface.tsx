import { ReactNode } from 'react'

import { VariantProps, cva } from 'class-variance-authority'

type SurfaceProps = Readonly<{ children: ReactNode } & VariantProps<typeof surfaceVariants>>
type BackdropProps = Readonly<{ children: ReactNode }>

const surfaceVariants = cva(
  'bg-background/40 dark:bg-muted/40 w-lg border-border max-w-full border',
  {
    variants: {
      type: {
        top: 'lg:rounded-4xl space-y-8 p-4 sm:p-8 lg:p-12',
        extension: 'p-2 ps-4 lg:rounded-full',
      },
    },
  },
)

export function Surface({ type, children }: SurfaceProps) {
  return <div className={surfaceVariants({ type })}>{children}</div>
}

export function Backdrop({ children }: BackdropProps) {
  return (
    <div className="bg-muted dark:bg-background bg-radial-[at_80%_75%] mask-radial-at-bottom-left flex w-full flex-col items-center justify-center gap-8 from-fuchsia-300 via-indigo-300 to-orange-200 py-12 dark:[background-image:none]">
      {children}
    </div>
  )
}
