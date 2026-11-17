'use client'

import { useTextEditor } from '@/compositions/editor'

export function PublishFeedNote() {
  const { draft } = useTextEditor()
  const missingSubtitle = draft.subtitle.trim().length === 0
  const missingCover = draft.coverUrl === null
  if (!missingSubtitle && !missingCover) return null

  return (
    <p className="text-muted-foreground text-sm">
      Your subtitle becomes the excerpt. Add a cover to show an image here.
    </p>
  )
}
