import { ComponentProps } from 'react'

import { cva } from 'class-variance-authority'
import Link from 'next/link'

import { navItems } from '@/compositions/data/nav-items'
import { getAuthUser } from '@/lib/datasource/user'
import { cn } from '@/lib/utils'

export interface BottomBarProps extends Omit<ComponentProps<'nav'>, 'children'> {
  className?: string
}

const variants = cva('', {
  variants: {
    component: {
      navigation: 'sticky bottom-0 left-0 z-50 w-full md:bottom-4',
      list: `supports-[backdrop-filter]:bg-muted/60 border-border/50 flex w-full justify-between border-t py-1 backdrop-blur-xl md:mx-auto md:mb-6 md:w-auto md:max-w-2xl md:justify-center md:gap-12 md:rounded-full md:border-[0.5px] md:px-8 md:py-1.5 md:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]`,
      item: 'flex-1 md:flex-initial',
      link: 'text-foreground/50 hover:text-primary flex flex-col items-center justify-center py-1.5 transition-colors md:py-2',
    },
  },
})

export async function BottomBar({ className, ...props }: BottomBarProps) {
  const user = await getAuthUser('Bearer some jwt token of some sort')
  const items = navItems.map((item) => {
    if (item.label !== 'Profile') return item

    return {
      ...item,
      href: `/${user.username}`,
    }
  })

  return (
    <nav
      data-component="bottom-bar"
      aria-label="Primary"
      className={cn(variants({ component: 'navigation' }), className)}
      role="navigation"
      {...props}
    >
      <ul className={variants({ component: 'list' })}>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.href} className={variants({ component: 'item' })}>
              <Link
                href={item.href}
                aria-label={item.aria}
                className={variants({ component: 'link' })}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="mt-0.5 text-xs">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

BottomBar.displayName = 'BottomBar'
