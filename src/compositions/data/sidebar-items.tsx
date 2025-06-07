import { Bell, Bookmark, Gift, Home, Settings } from 'lucide-react'

import { AppSidebarProps } from '../sidebar/AppSidebar'

export const sidebarItems: AppSidebarProps['items'] = [
  {
    icon: <Home />,
    label: 'Home',
    title: 'Home',
    link: '/',
  },
  {
    icon: <Bookmark />,
    label: 'Bookmarks',
    title: 'Bookmarks',
    link: '/bookmarks',
  },
  {
    icon: <Gift />,
    label: 'Rewards',
    title: 'Rewards',
    link: '/rewards',
  },
  {
    icon: <Bell />,
    label: 'Notifications',
    title: 'Notifications',
    link: '/notifications',
  },
  {
    icon: <Settings />,
    label: 'Settings',
    title: 'Settings',
    link: '/settings',
  },
]
