'use client'

import { Button } from '@/components/ui/button'
import { FeedPreviewCard } from '@/compositions/card/FeedPreview'
import { draftExcerpt, previewChannelLabel } from '@/compositions/card/preview'
import { useTextEditor } from '@/compositions/editor'

import { useSignedInAuthor } from '../signed-in-author'

export function InTheFeed() {
  const { draft, state, toggleMode } = useTextEditor()
  const author = useSignedInAuthor()
  const previewing = state.mode === 'preview'

  return (
    <section className="flex flex-col gap-4 py-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">In the feed</h2>
        <Button type="button" variant="ghost" size="sm" onClick={toggleMode}>
          {previewing ? 'Edit' : 'Preview'}
        </Button>
      </div>
      <FeedPreviewCard
        author={{ name: author.name, initials: author.initials, avatarUrl: author.avatarUrl }}
        title={draft.title}
        summary={draftExcerpt(draft)}
        channel={previewChannelLabel(draft.channelId)}
        coverUrl={draft.coverUrl}
      />
    </section>
  )
}
