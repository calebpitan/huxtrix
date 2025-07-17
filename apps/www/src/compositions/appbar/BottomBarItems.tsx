'use client'

import { ComponentProps, ReactNode, cloneElement, isValidElement } from 'react'

import { cva } from 'class-variance-authority'
import { Icon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Item {
  href: string
  isActive: boolean
  label: string
  icon: ReactNode
}

export interface BottomBarItemsProps extends Omit<ComponentProps<'ul'>, 'children'> {
  items: Item[]
}

const variants = cva('', {
  variants: {
    component: {
      list: `supports-[backdrop-filter]:bg-muted/60 border-border/50 safe-area-b-1 flex w-full justify-between border-t py-1 backdrop-blur-xl md:mx-auto md:mb-6 md:w-auto md:max-w-2xl md:justify-center md:gap-12 md:rounded-full md:border-[0.5px] md:px-8 md:py-1.5 md:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]`,
      item: 'flex-1 md:flex-initial',
      link: `hover:text-primary flex flex-col items-center justify-center py-1.5 transition-colors md:py-2`,
    },
    active: { true: '' },
  },
  compoundVariants: [
    {
      component: 'link',
      active: true,
      className: 'text-foreground',
    },
    {
      component: 'link',
      active: false,
      className: 'text-foreground/50',
    },
  ],
})

export function BottomBarItems({ items }: BottomBarItemsProps) {
  const pathname = usePathname()

  return (
    <ul className={variants({ component: 'list' })}>
      {items.map((item) => {
        const icon = isValidElement<ComponentProps<typeof Icon>>(item.icon)
          ? cloneElement(item.icon, { className: 'h-5 w-5', 'aria-hidden': 'true' })
          : item.icon

        return (
          <li key={item.href} className={variants({ component: 'item' })}>
            <Link
              href={item.href}
              aria-label={item.label}
              className={variants({
                component: 'link',
                active: item.href === pathname,
              })}
            >
              {icon}
              <span className="mt-0.5 text-xs">{item.label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
