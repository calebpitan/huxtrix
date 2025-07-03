'use client'

import { ComponentProps, Fragment, ReactElement, Ref, cloneElement, useMemo } from 'react'

import { useCurrentBreakpoint } from '@/hooks/use-breakpoint'

import { useAppBar, useRegisterAppBarGeomImperatively } from './AppBarProvider'
import { AppBarSlot, AppBarSlotKey } from './AppBarSlot'

export interface AppBarPassthroughProps<S extends AppBarSlotKey>
  extends Pick<ComponentProps<typeof AppBarSlot<S>>, 'slot'> {
  children: ReactElement<ComponentProps<typeof AppBarSlot<AppBarSlotKey>>, typeof AppBarSlot<S>>
}

export function AppBarPassthrough<S extends AppBarSlotKey>(props: AppBarPassthroughProps<S>) {
  const appbar = useAppBar()
  const breakpoint = useCurrentBreakpoint()

  let ref: Ref<HTMLElement> | undefined = undefined

  if (props.slot === 'topbar') {
    ref = appbar.refs.topbar
  } else if (props.slot === 'bottombar-lg') {
    if (breakpoint === 'lg') {
      ref = appbar.refs.bottombar
    }
  } else {
    ref = appbar.refs.bottombar
  }

  const children = useMemo(() => cloneElement(props.children, { ref }), [props.children, ref])

  useRegisterAppBarGeomImperatively()

  return <Fragment>{children}</Fragment>
}
