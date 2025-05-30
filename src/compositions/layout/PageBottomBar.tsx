'use client'

import { ComponentProps, Fragment, useEffect, useMemo } from 'react'

import { BottomBarItems, useAppBar } from '@/compositions/appbar'

export interface PageBottomBarProps {
  items: ComponentProps<typeof BottomBarItems>['items']
}

export function PageBottomBar({ items }: PageBottomBarProps) {
  const { content, setContent } = useAppBar()

  const bottombar = useMemo(() => <BottomBarItems items={items} />, [items])

  useEffect(() => {
    if (content.bottombar !== bottombar) {
      setContent({ bottombar })
    }
  }, [content.bottombar, setContent, bottombar])

  return <Fragment />
}
