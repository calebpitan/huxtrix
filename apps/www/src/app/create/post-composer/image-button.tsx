'use client'

import { useRef } from 'react'

import { ImageIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'

import { revokeBlob } from './blob'

export function PostImageButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { draft, updateDraft } = useTextEditor()
  const coverUrl = draft.coverUrl

  function choose(file: File | undefined) {
    if (!file?.type.startsWith('image/')) return
    revokeBlob(coverUrl)
    updateDraft({ coverUrl: URL.createObjectURL(file) })
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          choose(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label={coverUrl ? 'Replace image' : 'Add image'}
        onClick={() => inputRef.current?.click()}
      >
        <ImageIcon />
      </Button>
    </>
  )
}
