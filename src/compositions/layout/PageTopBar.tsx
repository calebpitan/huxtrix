'use client'

import { Fragment, useEffect, useMemo } from 'react'

import { TopBar, useAppBar } from '@/compositions/appbar'
import { useBreakpoint } from '@/hooks/use-breakpoint'

export interface PageTopBarProps {
  title?: string
}

export function PageTopBar({ title = 'Huxtrix' }: PageTopBarProps) {
  const { content, setContent } = useAppBar()
  const isGTELargeScreen = useBreakpoint('lg')

  // If the screen is above a large size, we don't want to show the top bar
  // so we return an empty fragment, otherwise we return the top bar
  const topbar = useMemo(() => {
    return isGTELargeScreen ? (
      <Fragment key="no-topbar-on-large-screens" />
    ) : (
      <TopBar key="default-topbar" className="flex-1 lg:hidden" size="base" name={title} />
    )
  }, [isGTELargeScreen, title])

  useEffect(() => {
    if (content.topbar !== topbar) {
      setContent({ topbar })
    }
  }, [content.topbar, setContent, topbar])

  return <Fragment />
}
