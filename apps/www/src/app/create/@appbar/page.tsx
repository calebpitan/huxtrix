'use client'

import { Fragment, useCallback, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { AppBarPortal, TopBarContent } from '@/compositions/appbar'
import { useTextEditor } from '@/compositions/editor'

import { ConfirmPostDialog } from '../confirm-post-dialog'

export default function CreatorPageAppBar() {
  const router = useRouter()
  const pathname = usePathname()
  const editor = useTextEditor()
  const [postOpen, setPostOpen] = useState(false)
  const onCreate = pathname === '/create'
  const primaryIsPost = onCreate && editor.draft.type === 'post'

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

  const handlePrimary = useCallback(() => {
    if (!onCreate) {
      editor.controller.post()
      return
    }

    if (editor.draft.type === 'post') {
      setPostOpen(true)
      return
    }

    router.push('/create/publish')
  }, [editor.controller, editor.draft.type, onCreate, router])

  return (
    <Fragment>
      <AppBarPortal slots="topbar">
        <TopBarContent size="sm" name="Create" className="flex items-center justify-between pe-4">
          <Button className="text-base" variant="link" onClick={handleCancel}>
            Cancel
          </Button>

          <Button className="rounded-full px-5" variant="default" size="sm" onClick={handlePrimary}>
            {primaryIsPost ? 'Post' : 'Next'}
          </Button>
        </TopBarContent>
      </AppBarPortal>

      {onCreate && <ConfirmPostDialog open={postOpen} onOpenChange={setPostOpen} />}

      <AppBarPortal slots={['bottombar', 'bottombar-lg']}>{null}</AppBarPortal>
    </Fragment>
  )
}
