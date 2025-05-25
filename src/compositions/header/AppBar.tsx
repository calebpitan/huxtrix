import { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export interface AppBarProps extends HTMLAttributes<HTMLDivElement> {
  name: string
}

export const AppBar = ({ className, name, ...props }: AppBarProps) => {
  return (
    <header
      data-component="app-bar"
      className={cn(
        'bg-background/95 supports-[backdrop-filter]:bg-muted/60 sticky top-0 z-50 w-full backdrop-blur-xl md:relative',
        className,
      )}
      {...props}
    >
      <div className="flex h-15 items-center justify-center">
        <span className="text-xl font-bold tracking-tight">{name}</span>
      </div>
    </header>
  )
}

AppBar.displayName = 'AppBar'
