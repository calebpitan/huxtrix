'use client'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'

import { revokeBlob } from './blob'

export function PostImagePreview() {
  const { draft, updateDraft, state } = useTextEditor()
  const coverUrl = draft.coverUrl
  const editing = state.mode !== 'preview'
  if (!coverUrl) return null

  function clear() {
    revokeBlob(coverUrl)
    updateDraft({ coverUrl: null })
  }

  return (
    <div className="relative mt-3">
      {/* blob: URLs are session previews. next/image does not render them. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={coverUrl} alt="" className="aspect-video w-full rounded-lg object-cover" />
      {editing ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="bg-background/80 absolute right-2 top-2 rounded-full"
          aria-label="Remove image"
          onClick={clear}
        >
          <X />
        </Button>
      ) : null}
    </div>
  )
}
