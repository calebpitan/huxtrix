'use client'

import { useTextEditor } from '@/compositions/editor'
import { draftStatusLabel, draftWordCount } from '@/compositions/editor/draft-text'

export function DraftStatus() {
  const editor = useTextEditor()

  if (editor.draft.type !== 'article') return null

  const words = draftWordCount(editor.draft)

  return (
    <p className="text-muted-foreground flex min-w-0 items-center gap-2 text-sm">
      {editor.saved && <span className="size-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />}
      <span className="truncate">{draftStatusLabel(editor.saved, words)}</span>
    </p>
  )
}
