import { ComponentProps } from 'react'

import { Discriminate } from '@/lib/types'
import { cn } from '@/lib/utils'

export type PopoverArrowGraphicProps =
  | (ComponentProps<'svg'> & Discriminate<'vector'>)
  | (ComponentProps<'div'> & Discriminate<'dom'>)

export function PopoverArrowGraphic(props: PopoverArrowGraphicProps) {
  if (props.type === 'vector') {
    const { type: _, ...rest } = props
    return (
      <svg {...rest}>
        <polygon className="fill-muted/100" points="0,0 30,0 15,10" />
        <path
          d="M 0 0 L 15 10 L 30 0"
          stroke="var(--border)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    )
  }

  const { type: _, className, ...rest } = props

  return (
    <div
      className={cn(
        'bg-border flex! h-2 w-4 items-start justify-center',
        '[clip-path:_polygon(0_0,50%_100%,100%_0)]',
        className,
      )}
      {...rest}
    >
      <div className="bg-muted/60 h-[6.5px] w-3.25 backdrop-blur-2xl [clip-path:_polygon(0_0,50%_100%,100%_0)]" />
    </div>
  )
}
