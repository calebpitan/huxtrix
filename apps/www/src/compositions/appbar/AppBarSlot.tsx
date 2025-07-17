import { ReactNode, Ref } from 'react'

import { Discriminate } from '@/lib/types'

import { BottomBar, BottomBarProps } from './BottomBar'
import { TopBar, TopBarProps } from './TopBar'

interface AppBarSlotBaseProps {
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

type ForwardedProps<S extends AppBarSlotKey> = {
  topbar: Omit<TopBarProps, 'slot'> & Discriminate<S, 'slot'>
  bottombar: Omit<BottomBarProps, 'slot'> & Discriminate<S, 'slot'>
  'bottombar-lg': Omit<BottomBarProps, 'slot'> & Discriminate<S, 'slot'>
}[S]

export type AppBarSlotKey = 'topbar' | 'bottombar' | 'bottombar-lg'

export type AppBarSlotProps<S extends AppBarSlotKey> = AppBarSlotBaseProps & ForwardedProps<S>

export function AppBarSlot<S extends AppBarSlotKey>(props: AppBarSlotProps<S>) {
  if (props.slot === 'topbar') {
    const { slot, children, ref, ...rest } = props

    return (
      <TopBar id={slot} ref={ref} {...rest}>
        {children}
      </TopBar>
    )
  }

  const { slot, children, ref, ...rest } = props

  return (
    <BottomBar id={slot} ref={ref} {...rest}>
      {children}
    </BottomBar>
  )
}
