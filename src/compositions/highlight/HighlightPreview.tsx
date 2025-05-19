import { HTMLAttributes } from 'react'

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
      className={cn('flex flex-col items-center focus:outline-none group', className)}
      {...props}
    >
      <span className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary group-focus:ring-2 group-focus:ring-primary/50 transition-all">
        {type === 'image' ? (
          <img src={src} alt={label} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <video
            src={src}
            className="w-full h-full object-cover"
            aria-label={label}
            tabIndex={-1}
            muted
            playsInline
            preload="metadata"
          />
        )}
      </span>
      <span className="mt-1 text-xs text-center max-w-[4.5rem] truncate">{label}</span>
    </button>
  )
}
