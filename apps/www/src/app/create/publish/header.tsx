'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'

import { SaveDraftButton } from '../save-draft-button'
import { usePublishRequest } from './request'

export function PublishHeader() {
  const router = useRouter()
  const editor = useTextEditor()
  const { requestPublish } = usePublishRequest()

  return (
    <header className="bg-background sticky top-0 z-40 hidden w-full shrink-0 px-2 lg:block lg:px-0">
      <div className="flex w-full items-center gap-3 py-2">
        <Button
          type="button"
          variant="ghost"
          className="rounded-full font-bold"
          onClick={() => router.push('/create')}
        >
          <ArrowLeft aria-hidden />
          Back to editing
        </Button>

        <div className="ms-auto flex min-w-0 items-center justify-end gap-3">
          {editor.saved ? (
            <p className="text-muted-foreground flex min-w-0 items-center gap-2 text-sm">
              <span className="size-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
              <span className="truncate">Draft saved</span>
            </p>
          ) : null}
          <SaveDraftButton />
          <Button
            type="button"
            size="lg"
            className="h-11 rounded-full px-7 font-bold"
            onClick={requestPublish}
          >
            Publish
          </Button>
        </div>
      </div>
    </header>
  )
}
