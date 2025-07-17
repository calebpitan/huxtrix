'use client'

import { ReactNode, RefObject, createContext, use } from 'react'
import { useEffect, useMemo, useRef } from 'react'

import { ElementSize, useElementSize } from '@/hooks/use-element-size'

interface AppBarRefs {
  topbar: RefObject<HTMLElement | null>
  bottombar: RefObject<HTMLElement | null>
}
interface AppBarSizes {
  topbar: ElementSize
  bottombar: ElementSize
}

export interface AppBarContextType {
  refs: AppBarRefs
}

export interface AppBarProviderProps {
  children: ReactNode
}

const AppBarContext = createContext<AppBarContextType | null>(null)

export function useAppBar() {
  const context = use(AppBarContext)
  if (!context) {
    throw new Error('useAppBar must be used within an <AppBarProvider />')
  }
  return context
}

export function useAppBarGeometry(): AppBarSizes {
  const appbar = useAppBar()
  const topbarSize = useElementSize(appbar.refs.topbar)
  const bottombarSize = useElementSize(appbar.refs.bottombar)

  return { bottombar: bottombarSize, topbar: topbarSize }
}

export function useRegisterAppBarGeomImperatively() {
  const geom = useAppBarGeometry()
  useEffect(() => {
    document.documentElement.style.setProperty(`--topbar-height`, geom.topbar.height + 'px')
    document.documentElement.style.setProperty(`--bottombar-height`, geom.bottombar.height + 'px')
  }, [geom.bottombar.height, geom.topbar.height])
}

export function AppBarProvider({ children }: AppBarProviderProps) {
  const topbarRef = useRef<HTMLElement>(null)
  const bottombarRef = useRef<HTMLElement>(null)

  const contextValue = useMemo<AppBarContextType>(
    () => ({
      refs: {
        topbar: topbarRef,
        bottombar: bottombarRef,
      },
    }),
    [],
  )

  return <AppBarContext value={contextValue}>{children}</AppBarContext>
}
