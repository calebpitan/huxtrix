'use client'

import { TopBarContent } from '@/compositions/appbar'
import { AppBarPortal } from '@/compositions/appbar'
import { useBreakpoint } from '@/hooks/use-breakpoint'

export interface PageTopBarProps {
  title?: string
}

export function PageTopBar({ title = 'Huxtrix' }: PageTopBarProps) {
  const isGTELargeScreen = useBreakpoint('lg')

  if (isGTELargeScreen) {
    return null
  }

  return (
    <AppBarPortal slots="topbar">
      <TopBarContent size="base" name={title} />
    </AppBarPortal>
  )
}
