import { Compass, Home, PlusCircle, Search, User } from 'lucide-react'

import { Links } from '@/lib/links'

interface GetNavItemsOptions {
  pageUrl: URL | null
  defaultItems?: Array<NavItem>
}

export type NavItem = (typeof navItems)[number]

export const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: <Home />,
    aria: 'Home',
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: <Compass />,
    aria: 'Explore',
  },
  {
    href: '/create',
    label: 'Create',
    icon: <PlusCircle />,
    aria: 'Create new hack',
  },
  {
    href: '/search',
    label: 'Search',
    icon: <Search />,
    aria: 'Search',
  },
  {
    href: Links.signin(),
    label: 'Profile',
    icon: <User />,
    aria: 'Profile',
  },
] as const

export function getNavItems<U extends Record<'username', string | null>>(
  user: U | null,
  options: GetNavItemsOptions,
) {
  const { pageUrl, defaultItems = navItems } = options

  const items = defaultItems
    .filter((item) => item.label !== 'Profile' || user !== undefined)
    .map((item) => {
      const href =
        item.label !== 'Profile'
          ? item.href
          : user
            ? user.username
              ? `/${user.username}`
              : Links.profile.edit
            : Links.signin(pageUrl?.href)
      const isActive = href === pageUrl?.pathname

      return { ...item, href, isActive }
    })

  return items
}
