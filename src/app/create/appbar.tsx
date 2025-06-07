'use client'

import { Fragment, useCallback, useEffect, useMemo } from 'react'

// import { useNavigationGuard } from 'next-navigation-guard'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { TopBar, useAppBar } from '@/compositions/appbar'
import { useBreakpoint } from '@/hooks/use-breakpoint'

export interface CreatorPageAppBarProps {
  onPost?: () => void
}

const generateKey = <K extends string>(ns: K) => `${ns}-${import.meta.url}` as const

export function CreatorPageAppBar({ onPost }: CreatorPageAppBarProps) {
  const router = useRouter()
  const appbar = useAppBar()
  // const guard = useNavigationGuard({ enabled: (p) => p.type !== 'beforeunload' })
  const isGTEMediumScreen = useBreakpoint('md')

  const handleCancel = useCallback(() => {
    // This is an implementation detail of the next-navigation-guard package and is not reliable
    const unstable_StackIndex: number = window.history.state.__next_navigation_guard_stack_index
    if (window.history.length > 1 && unstable_StackIndex !== 0) {
      // not at the top of the stack, so we can go back
      router.back()
    } else {
      // at the top of the stack, so we can replace the current page
      router.replace('/')
    }
  }, [router])

  const handlePost = useCallback(() => onPost?.(), [onPost])

  const topbar = useMemo(() => {
    return (
      <TopBar key={generateKey('topbar')} className="lg:hidden" size="sm" name="">
        <div className="flex items-center justify-between pe-4">
          <Button className="text-base" variant="link" onClick={handleCancel}>
            Cancel
          </Button>

          <Button className="rounded-full px-5" variant="default" size="sm" onClick={handlePost}>
            Post
          </Button>
        </div>
      </TopBar>
    )
  }, [handleCancel, handlePost])

  // If the screen is below a medium size, we don't want to show the bottom bar
  // so we return an empty fragment, otherwise null, which retains the default bottom bar
  const bottombar = useMemo(() => {
    return !isGTEMediumScreen ? <Fragment key={generateKey('bottombar')} /> : null
  }, [isGTEMediumScreen])

  useEffect(() => {
    if (appbar.content.topbar !== topbar || appbar.content.bottombar !== bottombar) {
      appbar.setContent({ topbar, bottombar })
    }
  }, [appbar, bottombar, topbar])

  return <Fragment />
}
