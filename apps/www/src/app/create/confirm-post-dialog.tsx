'use client'

import { useEffect, useState } from 'react'

import * as AppDialog from '@/components/dialog/app-dialog'
import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'
import { useCurrentBreakpoint } from '@/hooks/use-breakpoint'
import { cn } from '@/lib/utils'

export function ConfirmPostDialog({
  open,
  onOpenChange,
  title = 'Post this?',
  description = 'Cancel leaves the draft as it is.',
  confirmLabel = 'Post',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmLabel?: string
}) {
  const editor = useTextEditor()
  const breakpoint = useCurrentBreakpoint()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  const dialogType = ready && breakpoint !== 'base' ? 'float' : 'swipe'

  function confirm() {
    editor.controller.post()
    onOpenChange(false)
  }

  return (
    <AppDialog.Root
      type={dialogType}
      open={open}
      title={title}
      description={description}
      onOpenChange={onOpenChange}
      SwipeContentProps={{ className: 'rounded-t-4xl' }}
      activeDetent={0.5}
    >
      <div className={cn('flex flex-col gap-4 sm:gap-6', { 'mb-5': dialogType === 'swipe' })}>
        <Button size="lg" variant="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button size="lg" onClick={confirm}>
          {confirmLabel}
        </Button>
      </div>
    </AppDialog.Root>
  )
}
