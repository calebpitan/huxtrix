import { HTMLAttributes } from 'react'

import Image from 'next/image'

import { cn } from '@/lib/utils'

export interface HighlightPreviewProps extends HTMLAttributes<HTMLButtonElement> {
  src: string
  type?: 'image' | 'video'
  label: string
  onClick?: () => void
  className?: string
}

export function HighlightPreview({
  src,
  type = 'image',
  label,
  onClick,
  className,
  ...props
}: HighlightPreviewProps) {
  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      className={cn('group flex flex-col items-center focus:outline-none', className)}
      {...props}
    >
      <span className="border-primary group-focus:ring-primary/50 relative h-16 w-16 overflow-hidden rounded-full border-3 transition-all group-focus:ring-2">
        {type === 'image' ? (
          <Image src={src} alt={label} className="h-full w-full object-cover" loading="lazy" fill />
        ) : (
          <video
            src={src}
            className="h-full w-full object-cover"
            aria-label={label}
            tabIndex={-1}
            muted
            playsInline
            preload="metadata"
          />
        )}
      </span>
      <span className="mt-1 max-w-[4.5rem] truncate text-center text-xs">{label}</span>
    </button>
  )
}
