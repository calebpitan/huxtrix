import { Compass, Home, PlusCircle, Search, User } from 'lucide-react'

export const navItems = [
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
