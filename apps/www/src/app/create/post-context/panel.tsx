import { ChannelGuidelines } from '../article-context/channel-guidelines'
import { PostingTo } from '../article-context/posting-to'
import { InTheFeed } from './in-the-feed'

export function PostContextPanel() {
  return (
    <div className="sticky top-0 flex w-full flex-col">
      <InTheFeed />
      <div className="mt-10">
        <PostingTo />
      </div>
      <div className="mt-5 empty:mt-0">
        <ChannelGuidelines />
      </div>
    </div>
  )
}
