import { ComponentProps, cloneElement, isValidElement, useMemo } from 'react'

import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export interface TopBarProps
  extends ComponentProps<'header'>,
    Pick<VariantProps<typeof variants>, 'size'> {
  name: string
}

const variants = cva('', {
  variants: {
    components: {
      root: 'bg-background/95 supports-[backdrop-filter]:bg-muted/60 sticky top-0 z-50 w-full backdrop-blur-xl md:relative',
      content: 'flex items-center justify-center',
    },
    size: {
      xs: 'h-[var(--appbar-size-xs)] text-md',
      sm: 'h-[var(--appbar-size-sm)] text-lg',
      base: 'h-[var(--appbar-size-base)] text-xl',
      md: 'h-[var(--appbar-size-md)] text-xl',
      lg: 'h-[var(--appbar-size-lg)] text-xl',
    },
  },
})

export function TopBar({ children, className, name, size = 'base', ...props }: TopBarProps) {
  const content = useMemo(() => {
    return isValidElement<Record<string, unknown>>(children)
      ? cloneElement(children, {
          className: cn(children.props.className as string, variants({ size })),
        })
      : children
  }, [children, size])

  return (
    <header
      data-component="top-bar"
      className={cn(variants({ components: 'root' }), className)}
      {...props}
    >
      {content ? (
        content
      ) : (
        <div className={variants({ components: 'content', size })}>
          <span className="font-bold tracking-tight">{name}</span>
        </div>
      )}
    </header>
  )
}
