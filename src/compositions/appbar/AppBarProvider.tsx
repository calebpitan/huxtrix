'use client'

import { ReactElement, ReactNode, createContext, use, useCallback, useMemo, useState } from 'react'

type AppBarContent = { topbar: ReactElement | null; bottombar: ReactElement | null }
type Setter = (prev: AppBarContent) => AppBarContent

interface SetAppBarContent {
  (contents: Partial<AppBarContent>): void
  <K extends keyof AppBarContent, C extends AppBarContent[K]>(type: K, content: C): void
  (setter: Setter): void
}

export type AppBarContextType = { content: AppBarContent; setContent: SetAppBarContent }

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

export function AppBarProvider({ children }: AppBarProviderProps) {
  const [bars, setBars] = useState<AppBarContent>({ topbar: null, bottombar: null })

  type Args = [
    Partial<AppBarContent> | keyof AppBarContent | Setter,
    AppBarContent[keyof AppBarContent],
  ]
  const setContent = useCallback<SetAppBarContent>((typeOrContents: Args[0], content?: Args[1]) => {
    const { type, contents, setter } = {
      type: typeof typeOrContents === 'string' ? typeOrContents : undefined,
      contents: typeof typeOrContents === 'object' ? typeOrContents : undefined,
      setter: typeof typeOrContents === 'function' ? typeOrContents : undefined,
    }

    if (type !== undefined) {
      setBars((prev) => ({ ...prev, ...contents, [type]: content }))
    } else if (contents !== undefined) {
      setBars((prev) => ({ ...prev, ...contents }))
    } else if (setter !== undefined) {
      setBars(setter)
    }
  }, [])

  const contextValue = useMemo(() => ({ content: bars, setContent }), [bars, setContent])

  return <AppBarContext value={contextValue}>{children}</AppBarContext>
}
