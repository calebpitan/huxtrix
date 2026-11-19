'use client'

import { Fragment, useCallback, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { AppBarPortal, TopBarContent } from '@/compositions/appbar'
import { useTextEditor } from '@/compositions/editor'

import { ConfirmPostDialog } from '../confirm-post-dialog'
import { usePublishRequest } from '../publish/request'

export default function CreatorPageAppBar() {
  const router = useRouter()
  const pathname = usePathname()
  const editor = useTextEditor()
  const { requestPublish } = usePublishRequest()
  const [postOpen, setPostOpen] = useState(false)
  const onCreate = pathname === '/create'
  const onPublish = pathname === '/create/publish'
  const primaryIsPost = onCreate && editor.draft.type === 'post'

  const handleLeading = useCallback(() => {
    if (onPublish) {
      router.push('/create')
      return
    }

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
  }, [onPublish, router])

  const handlePrimary = useCallback(() => {
    if (onPublish) {
      requestPublish()
      return
    }

    if (editor.draft.type === 'post') {
      setPostOpen(true)
      return
    }

    router.push('/create/publish')
  }, [editor.draft.type, onPublish, requestPublish, router])

  return (
    <Fragment>
      <AppBarPortal slots="topbar">
        <TopBarContent size="sm" name="Create" className="flex items-center justify-between pe-4">
          <Button className="text-base" variant="link" onClick={handleLeading}>
            {onPublish ? 'Back' : 'Cancel'}
          </Button>

          <Button className="rounded-full px-5" variant="default" size="sm" onClick={handlePrimary}>
            {onPublish ? 'Publish' : primaryIsPost ? 'Post' : 'Next'}
          </Button>
        </TopBarContent>
      </AppBarPortal>

      {onCreate && <ConfirmPostDialog open={postOpen} onOpenChange={setPostOpen} />}

      <AppBarPortal slots={['bottombar', 'bottombar-lg']}>{null}</AppBarPortal>
    </Fragment>
  )
}
