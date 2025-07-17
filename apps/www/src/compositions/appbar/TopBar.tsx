import { ComponentProps } from 'react'

import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export type TopBarProps = ComponentProps<'header'>

export interface TopBarContentProps
  extends ComponentProps<'div'>,
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
      xs: 'text-md h-[var(--appbar-size-xs)]',
      sm: 'h-[var(--appbar-size-sm)] text-lg',
      base: 'h-[var(--appbar-size-base)] text-xl',
      md: 'h-[var(--appbar-size-md)] text-xl',
      lg: 'h-[var(--appbar-size-lg)] text-xl',
    },
  },
})

export function TopBar({ children, className, ...props }: TopBarProps) {
  return (
    <header
      data-component="top-bar"
      className={cn(variants({ components: 'root' }), className)}
      {...props}
    >
      {children}
    </header>
  )
}

export function TopBarContent({ children, className, name, size, ...props }: TopBarContentProps) {
  return (
    <div className={cn(variants({ components: 'content', size }), className)} {...props}>
      {children ?? <span className="font-bold tracking-tight">{name}</span>}
    </div>
  )
}
