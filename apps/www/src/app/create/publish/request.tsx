'use client'

import { createContext, use, useCallback, useState } from 'react'

import { useTextEditor } from '@/compositions/editor'

import { ConfirmPostDialog } from '../confirm-post-dialog'

interface PublishRequestContextType {
  attempted: boolean
  requestPublish: () => void
}

const PublishRequestContext = createContext<PublishRequestContextType | null>(null)

export function usePublishRequest() {
  const context = use(PublishRequestContext)
  if (!context) {
    throw new Error('usePublishRequest must be used within a <PublishRequestProvider />')
  }
  return context
}

export function PublishRequestProvider({ children }: { children: React.ReactNode }) {
  const editor = useTextEditor()
  const [attempted, setAttempted] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const requestPublish = useCallback(() => {
    const draft = editor.draftRef.current
    if (draft.type !== 'article') return
    if (draft.title.trim().length === 0 || draft.channelId === null) {
      setAttempted(true)
      return
    }
    setConfirmOpen(true)
  }, [editor.draftRef])

  return (
    <PublishRequestContext value={{ attempted, requestPublish }}>
      {children}
      <ConfirmPostDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Publish this?"
        confirmLabel="Publish"
      />
    </PublishRequestContext>
  )
}
