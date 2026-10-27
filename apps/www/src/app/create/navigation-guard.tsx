'use client'

import { useEffect, useState } from 'react'

import { useNavigationGuard } from 'next-navigation-guard'

import * as AppDialog from '@/components/dialog/app-dialog'
import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'
import { useCurrentBreakpoint } from '@/hooks/use-breakpoint'
import { cn } from '@/lib/utils'

function staysInCreate(to: string) {
  try {
    const path = new URL(to, 'http://localhost').pathname
    return path === '/create' || path.startsWith('/create/')
  } catch {
    return false
  }
}

export function CreateNavigationGuard() {
  const editor = useTextEditor()
  const guard = useNavigationGuard({
    enabled: ({ to, type }) =>
      type !== 'beforeunload' && editor.draftRef.current.body.length > 0 && !staysInCreate(to),
  })

  const [isPresented, setIsPresented] = useState(() => guard.active)
  const [ready, setReady] = useState(false)

  const breakpoint = useCurrentBreakpoint()
  const dialogType = ready && breakpoint !== 'base' ? 'float' : 'swipe'

  useEffect(() => {
    setReady(true)
  }, [])

  if (guard.active !== isPresented) {
    setIsPresented(guard.active)
  }

  function handleOpenChange(open: boolean) {
    guard.reject()
    setIsPresented(open)
  }

  function handleSaveDraft() {
    editor.controller.save()
    setIsPresented(false)
    guard.accept()
  }

  function handleDiscard() {
    setIsPresented(false)
    guard.accept()
  }

  return (
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
        <Button className="text-red-500" size="lg" variant="secondary" onClick={handleDiscard}>
          Discard
        </Button>
      </div>
    </AppDialog.Root>
  )
}
