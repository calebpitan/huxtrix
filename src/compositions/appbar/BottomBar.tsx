import { ComponentProps } from 'react'

import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

type BottomBarStyleProps = VariantProps<typeof variants>

export interface BottomBarProps
  extends ComponentProps<'nav'>,
    Pick<BottomBarStyleProps, 'breakpoint' | 'strategy'> {
  className?: string
}

const variants = cva('', {
  variants: {
    component: {
      navigation: 'sticky bottom-0 left-0 z-50 w-full md:bottom-4',
    },
    breakpoint: { sm: '', md: '', lg: '', xl: '' },
    strategy: { include: '', exclude: '' },
  },
  compoundVariants: [
    {
      component: 'navigation',
      breakpoint: 'sm',
      strategy: 'include',
      className: 'hidden sm:[display:revert] lg:hidden',
    },
    {
      component: 'navigation',
      breakpoint: 'sm',
      strategy: 'exclude',
      className: 'sm:hidden md:[display:revert]',
    },
    {
      component: 'navigation',
      breakpoint: 'md',
      strategy: 'include',
      className: 'hidden md:[display:revert] lg:hidden',
    },
    {
      component: 'navigation',
      breakpoint: 'md',
      strategy: 'exclude',
      className: 'md:hidden lg:[display:revert]',
    },
    {
      component: 'navigation',
      breakpoint: 'lg',
      strategy: 'include',
      className: 'hidden lg:[display:revert] xl:hidden',
    },
    {
      component: 'navigation',
      breakpoint: 'lg',
      strategy: 'exclude',
      className: 'lg:hidden xl:[display:revert]',
    },
    {
      component: 'navigation',
      breakpoint: 'xl',
      strategy: 'include',
      className: 'hidden xl:[display:revert]',
    },
    {
      component: 'navigation',
      breakpoint: 'xl',
      strategy: 'exclude',
      className: 'xl:hidden',
    },
  ],
})

export async function BottomBar({
  className,
  children,
  breakpoint,
  strategy,
  ...props
}: BottomBarProps) {
  return (
    <nav
      data-component="bottom-bar"
      aria-label="Primary"
      className={cn(variants({ component: 'navigation', breakpoint, strategy }), className)}
      role="navigation"
      {...props}
    >
      {children}
    </nav>
  )
}

BottomBar.displayName = 'BottomBar'
