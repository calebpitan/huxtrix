'use client'

import { HTMLAttributes } from 'react'

import { Compass, Home, PlusCircle, Search, User } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
    aria: 'Home',
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: Compass,
    aria: 'Explore',
  },
  {
    href: '/submit',
    label: 'Create',
    icon: PlusCircle,
    aria: 'Create new hack',
  },
  {
    href: '/search',
    label: 'Search',
    icon: Search,
    aria: 'Search',
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
    aria: 'Profile',
  },
]

export interface BottomBarProps extends HTMLAttributes<HTMLElement> {
  className?: string
}

export const BottomBar = ({ className, ...props }: BottomBarProps) => {
  return (
    <nav
      data-component="bottom-bar"
      aria-label="Primary"
      className={cn('sticky bottom-0 md:bottom-4 left-0 z-50 w-full', className)}
      role="navigation"
      {...props}
    >
      <ul
        className={cn(`
        flex w-full justify-between
        supports-[backdrop-filter]:bg-muted/60
        backdrop-blur-xl
        border-t border-border/50
        
        md:w-auto md:max-w-2xl md:mx-auto
        md:rounded-full md:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]
        md:border-[0.5px] md:gap-12
        md:justify-center md:mb-6
        md:px-8 md:py-1.5 py-1
      `)}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.href} className="flex-1 md:flex-initial">
              <Link
                href={item.href}
                aria-label={item.aria}
                className={`
                  flex flex-col items-center justify-center
                  py-1.5 md:py-2
                  text-foreground/50 hover:text-primary
                  transition-colors
                `}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs mt-0.5">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

BottomBar.displayName = 'BottomBar'
