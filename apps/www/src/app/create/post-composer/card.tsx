'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChannelChip } from '@/compositions/editor/channel-chip'

import { useSignedInAuthor } from '../signed-in-author'
import { PostComposerActions } from './actions'
import { GraphemeCount } from './count'
import { PostComposerField } from './field'
import { PostImagePreview } from './image-preview'
import { PostComposerPlate } from './plate'

export function PostComposerCard() {
  const author = useSignedInAuthor()

  return (
    <Card
      data-component="post-composer-card"
      className="w-full gap-3 rounded-2xl border py-4 shadow-none"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar>
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{author.initials}</AvatarFallback>
          </Avatar>
          {author.name ? (
            <span className="truncate text-sm font-semibold">{author.name}</span>
          ) : null}
        </div>
        <ChannelChip />
      </CardHeader>
      <CardContent className="px-4">
        <PostComposerPlate>
          <PostComposerField />
          <PostImagePreview />
          <div className="mt-2 flex items-center gap-1 border-t pt-2">
            <PostComposerActions />
            <GraphemeCount />
          </div>
        </PostComposerPlate>
      </CardContent>
    </Card>
  )
}
