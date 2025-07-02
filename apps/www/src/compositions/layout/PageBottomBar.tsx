import { ComponentProps } from 'react'

import { AppBarPortal, BottomBarItems } from '@/compositions/appbar'

export interface PageBottomBarProps {
  items: ComponentProps<typeof BottomBarItems>['items']
}

export function PageBottomBar({ items }: PageBottomBarProps) {
  return (
    <AppBarPortal slots={['bottombar', 'bottombar-lg']}>
      <BottomBarItems items={items} />
    </AppBarPortal>
  )
}
