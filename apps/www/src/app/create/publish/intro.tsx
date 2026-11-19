'use client'

import { useTextEditor } from '@/compositions/editor'

import { usePublishRequest } from './request'

export function PublishIntro() {
  const { draft } = useTextEditor()
  const { attempted } = usePublishRequest()
  const missingTitle = draft.title.trim().length === 0

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-extrabold tracking-tight">Ready to publish?</h1>
      <p className="text-muted-foreground text-base">
        Choose where it appears and add a few details. You can change these later.
      </p>
      {attempted && missingTitle ? (
        <p role="alert" className="text-destructive text-sm">
          Add a title before publishing.
        </p>
      ) : null}
    </div>
  )
}
