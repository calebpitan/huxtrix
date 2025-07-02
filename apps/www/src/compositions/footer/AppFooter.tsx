import { ComponentProps } from 'react'

import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

type AppFooterStyleProps = VariantProps<typeof variants>

export interface AppFooterProps
  extends ComponentProps<'div'>,
    Pick<AppFooterStyleProps, 'breakpoint' | 'strategy'> {
  className?: string
}

const variants = cva('', {
  variants: {
    component: {
      footer: 'border-t-0 py-6 md:py-3',
      content: 'flex flex-col items-center justify-between gap-4 md:flex-row',
      paragraph: 'text-muted-foreground w-full text-center text-sm leading-loose',
    },
    breakpoint: { sm: '', md: '', lg: '', xl: '' },
    strategy: { include: '', exclude: '' },
  },
  compoundVariants: [
    {
      component: 'footer',
      breakpoint: 'sm',
      strategy: 'include',
      className: 'hidden sm:[display:revert] lg:hidden',
    },
    {
      component: 'footer',
      breakpoint: 'sm',
      strategy: 'exclude',
      className: 'sm:hidden md:[display:revert]',
    },
    {
      component: 'footer',
      breakpoint: 'md',
      strategy: 'include',
      className: 'hidden md:[display:revert] lg:hidden',
    },
    {
      component: 'footer',
      breakpoint: 'md',
      strategy: 'exclude',
      className: 'md:hidden lg:[display:revert]',
    },
    {
      component: 'footer',
      breakpoint: 'lg',
      strategy: 'include',
      className: 'hidden lg:[display:revert] xl:hidden',
    },
    {
      component: 'footer',
      breakpoint: 'lg',
      strategy: 'exclude',
      className: 'lg:hidden xl:[display:revert]',
    },
    {
      component: 'footer',
      breakpoint: 'xl',
      strategy: 'include',
      className: 'hidden xl:[display:revert]',
    },
    {
      component: 'footer',
      breakpoint: 'xl',
      strategy: 'exclude',
      className: 'xl:hidden',
    },
  ],
})

export const AppFooter = ({ className, breakpoint, strategy, ...props }: AppFooterProps) => {
  return (
    <div
      data-component="app-footer"
      className={cn(variants({ component: 'footer', breakpoint, strategy }), className)}
      {...props}
    >
      <div className={variants({ component: 'content' })}>
        <p className={variants({ component: 'paragraph' })}>
          <span>&copy;</span> 2025 HUXTRIX
        </p>
      </div>
    </div>
  )
}

AppFooter.displayName = 'AppFooter'
