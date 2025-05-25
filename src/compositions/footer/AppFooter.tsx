import { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export interface AppFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const AppFooter = ({ className, ...props }: AppFooterProps) => {
  return (
    <div
      data-component="app-footer"
      className={cn('border-t-0 py-6 md:py-3', className)}
      {...props}
    >
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-muted-foreground w-full text-center text-sm leading-loose">
          <span>&copy;</span> 2025 HUXTRIX
        </p>
      </div>
    </div>
  )
}

AppFooter.displayName = 'AppFooter'
