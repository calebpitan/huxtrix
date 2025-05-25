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
        'sticky md:relative top-0 z-50 w-full bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-muted/60',
        className,
      )}
      {...props}
    >
      <div className="flex h-15 items-center justify-center">
        <span className="font-bold text-xl tracking-tight">{name}</span>
      </div>
    </header>
  )
}

AppBar.displayName = 'AppBar'
