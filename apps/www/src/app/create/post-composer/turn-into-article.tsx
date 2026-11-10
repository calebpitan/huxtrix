'use client'

import { ArrowRight, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'

import { postParagraphValue, serializePostBody } from './body'

export function TurnIntoArticle() {
  const { draft, updateDraft } = useTextEditor()

  function onConvert() {
    updateDraft({
      type: 'article',
      body: serializePostBody(postParagraphValue(draft.body)),
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-auto w-full justify-between whitespace-normal rounded-2xl bg-transparent px-4 py-3 text-left font-normal shadow-none dark:bg-transparent"
      onClick={onConvert}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="bg-foreground/10 flex size-10 shrink-0 items-center justify-center rounded-full">
          <FileText aria-hidden />
        </span>
        <span className="min-w-0 whitespace-normal">
          <span className="block text-sm font-semibold">Going long? Turn this into an article</span>
          <span className="text-muted-foreground block text-xs font-normal leading-snug">
            Your text carries over. Add a title, headings, images and code blocks.
          </span>
        </span>
      </span>
      <ArrowRight aria-hidden />
    </Button>
  )
}
