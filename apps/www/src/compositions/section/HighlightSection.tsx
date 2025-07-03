'use client'

import { Fragment, HTMLAttributes, useState } from 'react'

import { cva } from 'class-variance-authority'
import Image from 'next/image'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { highlights } from '@/compositions/data/highlight'
import { HighlightPreview } from '@/compositions/highlight/HighlightPreview'
import { cn } from '@/lib/utils'

export interface HighlightSectionProps extends HTMLAttributes<HTMLElement> {
  ContentProps?: HTMLAttributes<HTMLDivElement>
}

const variants = cva('', {
  variants: {
    component: {
      content: 'no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto',
      dialog:
        'max-w-screen! supports-[backdrop-filter]:bg-muted/80 bg-muted/70 backdrop-blur-xs safe-area-6 flex h-screen flex-col items-center justify-center rounded-none border-0 p-6',
      media: 'h-full rounded-lg object-cover',
    },
  },
})

export function HighlightSection({
  className,
  ContentProps = {},
  ...props
}: HighlightSectionProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<(typeof highlights)[0] | null>(null)
  const { className: contentClassName, ...contentProps } = ContentProps

  return (
    <section
      data-component="highlight-section"
      className={cn('inline-block', className)}
      {...props}
    >
      <div className={cn(variants({ component: 'content' }), contentClassName)} {...contentProps}>
        {highlights.map((h) => (
          <HighlightPreview
            className="snap-both"
            key={h.id}
            src={h.src}
            type={h.type as 'image' | 'video'}
            label={h.label}
            onClick={() => {
              setActive(h)
              setOpen(true)
            }}
          />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Highlight</DialogTitle>
        <DialogContent className={variants({ component: 'dialog' })}>
          {active && (
            <Fragment>
              {active.type === 'image' ? (
                <Image
                  width={1000}
                  height={3000}
                  src={active.src}
                  alt={active.label}
                  draggable={false}
                  className={variants({
                    component: 'media',
                    className: 'w-[calc((100dvh_-_--spacing(12))_*_0.56219865)]',
                  })}
                />
              ) : (
                <video
                  src={active.src}
                  controls
                  autoPlay
                  className={variants({
                    component: 'media',
                    className: 'w-[calc((100dvh_-_--spacing(12))_*_0.56219865)]',
                  })}
                />
              )}
              {/* <div className="my-2 text-center text-base font-medium">{active.label}</div> */}
            </Fragment>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
