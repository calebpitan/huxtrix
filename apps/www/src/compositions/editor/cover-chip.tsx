'use client'

import { useRef } from 'react'

import { ImageIcon, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useTextEditor } from './TextEditorProvider'

function revokeBlob(url: string | null) {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
}

export function CoverChip() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { draft, updateDraft } = useTextEditor()
  const coverUrl = draft.coverUrl

  function choose(file: File | undefined) {
    if (!file?.type.startsWith('image/')) return
    revokeBlob(coverUrl)
    updateDraft({ coverUrl: URL.createObjectURL(file) })
  }

  function clear() {
    revokeBlob(coverUrl)
    updateDraft({ coverUrl: null })
  }

  return (
    <div className="flex items-center gap-1">
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
        variant="outline"
        size="lg"
        className={coverUrl ? 'rounded-full' : 'rounded-full border-dashed'}
        aria-label={coverUrl ? 'Replace cover' : undefined}
        onClick={() => inputRef.current?.click()}
      >
        {coverUrl ? (
          <img src={coverUrl} alt="" className="h-6 w-10 rounded-full object-cover" />
        ) : (
          <>
            <ImageIcon />
            Add cover
          </>
        )}
      </Button>
      {coverUrl ? (
        <Button variant="ghost" size="icon" aria-label="Remove cover" onClick={clear}>
          <X />
        </Button>
      ) : null}
    </div>
  )
}
