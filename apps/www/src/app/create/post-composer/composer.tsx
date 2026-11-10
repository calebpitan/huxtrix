'use client'

import { PostComposerCard } from './card'
import { TurnIntoArticle } from './turn-into-article'

export function PostComposer() {
  return (
    <div
      data-component="post-composer"
      className="mx-auto flex w-full max-w-xl flex-col gap-4 px-2 pb-16 pt-8 lg:px-0"
    >
      <PostComposerCard />
      <TurnIntoArticle />
    </div>
  )
}
