'use client'

import { type DragEvent, useRef, useState } from 'react'

import { ImageIcon, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'
import { cn } from '@/lib/utils'

import { revokeBlob } from '../post-composer/blob'

export function PublishCoverField() {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)
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

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    choose(event.dataTransfer.files?.[0])
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold">
          Cover image <span className="text-muted-foreground text-sm font-normal">Optional</span>
        </h2>
        <p className="text-muted-foreground text-sm">Shown on feed cards and in Featured.</p>
      </div>

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

      <div
        onDragEnter={(event) => {
          event.preventDefault()
          dragDepth.current += 1
          setDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => {
          dragDepth.current -= 1
          if (dragDepth.current <= 0) {
            dragDepth.current = 0
            setDragging(false)
          }
        }}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center',
          dragging && 'border-foreground',
        )}
      >
        {coverUrl ? (
          // blob: URLs are session previews. next/image does not render them.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="" className="aspect-video w-full rounded-xl object-cover" />
        ) : (
          <>
            <ImageIcon className="text-muted-foreground size-5" aria-hidden />
            <p className="text-sm font-medium">Drop an image here</p>
          </>
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => inputRef.current?.click()}
          >
            {coverUrl ? 'Replace' : 'Browse files'}
          </Button>
          {coverUrl ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Remove cover"
              onClick={clear}
            >
              <X />
            </Button>
          ) : null}
        </div>
        <p className="text-muted-foreground text-xs">16:9 works best</p>
      </div>
    </section>
  )
}
