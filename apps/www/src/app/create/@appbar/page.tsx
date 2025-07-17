'use client'

import { Fragment, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { AppBarPortal, TopBarContent } from '@/compositions/appbar'
import { useTextEditor } from '@/compositions/editor'

export default function CreatorPageAppBar() {
  const router = useRouter()
  const editor = useTextEditor()

  const handleCancel = useCallback(() => {
    // This is an implementation detail of the next-navigation-guard package and is not reliable
    const unstable_StackIndex = (window.history.state as Record<string, number>)
      .__next_navigation_guard_stack_index

    if (window.history.length > 1 && unstable_StackIndex !== 0) {
      // not at the top of the stack, so we can go back
      router.back()
    } else {
      // at the top of the stack, so we can replace the current page
      router.replace('/')
    }
  }, [router])

  const handlePost = useCallback(() => editor.controller.post(), [editor.controller])

  return (
    <Fragment>
      <AppBarPortal slots="topbar">
        <TopBarContent size="sm" name="Create" className="flex items-center justify-between pe-4">
          <Button className="text-base" variant="link" onClick={handleCancel}>
            Cancel
          </Button>

          <Button className="rounded-full px-5" variant="default" size="sm" onClick={handlePost}>
            Next
          </Button>
        </TopBarContent>
      </AppBarPortal>

      <AppBarPortal slots={['bottombar', 'bottombar-lg']}>{null}</AppBarPortal>
    </Fragment>
  )
}
