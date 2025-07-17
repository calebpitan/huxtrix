'use client'

import { Fragment, useCallback, useState } from 'react'

import { useNavigationGuard } from 'next-navigation-guard'

import * as AppDialog from '@/components/dialog/app-dialog'
import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'
import { ArticleEditor } from '@/compositions/editor/ArticleEditor'
import { useCurrentBreakpoint } from '@/hooks/use-breakpoint'
import { cn } from '@/lib/utils'

export function PostCreator() {
  const editor = useTextEditor()
  const guard = useNavigationGuard({
    enabled: (p) => p.type !== 'beforeunload' && editor.state.content.length > 0,
  })

  const [isPresented, setIsPresented] = useState(() => guard.active)

  const breakpoint = useCurrentBreakpoint()
  const dialogType = breakpoint === 'base' ? 'swipe' : 'float'

  if (guard.active !== isPresented) {
    setIsPresented(guard.active)
  }

  const makePost = useCallback(() => {
    console.log('Making post of content: %s', editor.state.content)
  }, [editor.state.content])

  const saveDraft = useCallback(() => {
    console.log('Saving draft of content: %s', editor.state.content)
  }, [editor.state.content])

  editor.controller.handle('post', makePost)
  editor.controller.handle('save', saveDraft)

  function handleOpenChange(p: boolean) {
    guard.reject()
    setIsPresented(p)
  }

  function handleSaveDraft() {
    // TODO: Save draft
    void Promise.resolve(saveDraft())
      .then(() => setIsPresented(false))
      .then(() => guard.accept())
  }

  function handleDsicard() {
    void Promise.resolve()
      .then(() => setIsPresented(false))
      .then(() => guard.accept())
  }

  return (
    <Fragment>
      <div style={{ height: '100%' }}>
        <ArticleEditor onChange={(value) => editor.setContent(value)} />
      </div>

      <AppDialog.Root
        type={dialogType}
        open={isPresented}
        title="Unsaved changes will be lost"
        description="What would you like to do with the changes you've made?"
        onOpenChange={handleOpenChange}
        SwipeContentProps={{ className: 'rounded-t-4xl' }}
        activeDetent={0.5}
      >
        <div className={cn('flex flex-col gap-4 sm:gap-6', { 'mb-5': dialogType === 'swipe' })}>
          <Button size="lg" variant="secondary" onClick={handleSaveDraft}>
            Save draft
          </Button>
          <Button className="text-red-500" size="lg" variant="secondary" onClick={handleDsicard}>
            Discard
          </Button>
        </div>
      </AppDialog.Root>
    </Fragment>
  )
}
