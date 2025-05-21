'use client'

import { HTMLAttributes, useState } from 'react'

import Image from 'next/image'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { highlights } from '@/compositions/data/highlight'
import { HighlightPreview } from '@/compositions/highlight/HighlightPreview'
import { cn } from '@/lib/utils'

export interface HighlightSectionProps extends HTMLAttributes<HTMLDivElement> {
  innerClassName?: string
}

export function HighlightSection({ className, innerClassName, ...props }: HighlightSectionProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<(typeof highlights)[0] | null>(null)

  return (
    <section
      data-component="highlight-section"
      className={cn('inline-block', className)}
      {...props}
    >
      <div
        className={cn(
          'flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory',
          innerClassName,
        )}
      >
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
        <DialogContent className="max-w-md flex flex-col items-center">
          {active && (
            <>
              {active.type === 'image' ? (
                <Image
                  src={active.src}
                  alt={active.label}
                  className="w-full max-h-[60vh] rounded-lg object-contain"
                  width={1000}
                  height={3000}
                  objectFit="contain"
                />
              ) : (
                <video
                  src={active.src}
                  controls
                  autoPlay
                  className="w-full max-h-[60vh] rounded-lg object-contain"
                />
              )}
              <div className="mt-2 text-center text-base font-medium">{active.label}</div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
