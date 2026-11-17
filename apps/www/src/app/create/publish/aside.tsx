'use client'

import { FeedPreviewCard } from '@/compositions/card/FeedPreview'
import { draftExcerpt, previewChannelLabel } from '@/compositions/card/preview'
import { useTextEditor } from '@/compositions/editor'

import { useSignedInAuthor } from '../signed-in-author'
import { PublishPreviewButton } from './PublishPreviewButton'
import { PublishChecklist } from './checklist'
import { PublishFeedNote } from './feed-note'

export function PublishAside() {
  const { draft } = useTextEditor()
  const author = useSignedInAuthor()

  return (
    <div className="sticky top-0 flex w-full flex-col">
      <section className="flex flex-col gap-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">In the feed</h2>
          <PublishPreviewButton />
        </div>
        <FeedPreviewCard
          author={{ name: author.name, initials: author.initials, avatarUrl: author.avatarUrl }}
          title={draft.title}
          summary={draftExcerpt(draft)}
          channel={previewChannelLabel(draft.channelId)}
          coverUrl={draft.coverUrl}
        />
        <PublishFeedNote />
      </section>
      <div className="mt-10">
        <PublishChecklist />
      </div>
    </div>
  )
}
