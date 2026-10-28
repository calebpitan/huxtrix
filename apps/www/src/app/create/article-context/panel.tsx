'use client'

import { ChannelGuidelines } from './channel-guidelines'
import { ArticleDrafts } from './drafts'
import { ArticleOutline } from './outline'
import { PostingTo } from './posting-to'

export function ArticleContextPanel() {
  return (
    <div className="sticky top-0 flex w-full flex-col">
      <PostingTo />
      <div className="mt-5 empty:mt-0">
        <ChannelGuidelines />
      </div>
      <div className="mt-10">
        <ArticleOutline />
      </div>
      <div className="mt-10">
        <ArticleDrafts />
      </div>
    </div>
  )
}
