'use client'

import { Fragment, ReactNode } from 'react'

import { useAppBar } from './AppBarProvider'

export type AppBarSlotProps = {
  children: ReactNode
  slot: 'topbar' | 'bottombar'
}

export function AppBarSlot({ children, slot }: AppBarSlotProps) {
  const appbar = useAppBar()
  const content = appbar.content[slot]

  if (content !== null) {
    return <Fragment>{content}</Fragment>
  }

  return <Fragment>{children}</Fragment>
}
