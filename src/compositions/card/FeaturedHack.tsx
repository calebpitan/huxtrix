import { HTMLAttributes } from 'react'

import { Bookmark, ThumbsUp } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn, formatNumber } from '@/lib/utils'

type Interactions = {
  upvotes: number
  bookmarks: number
}

export type FeaturedHack = {
  id: number
  title: string
  author: string
  media: string
  type: 'image' | 'video'
  interactions: Interactions
}

export interface FeaturedHackCardProps extends HTMLAttributes<HTMLElement> {
  hack: FeaturedHack
}

export const FeaturedHackCard = ({ hack, className, ...props }: FeaturedHackCardProps) => {
  const upvotes = formatNumber(hack.interactions.upvotes)
  const bookmarks = formatNumber(hack.interactions.bookmarks)

  return (
    <article className="bg-black dark:bg-white/70 rounded-4xl p-1.25">
      <Card
        data-component="featured-hack-card"
        className={cn(
          'min-w-[320px] max-w-xs h-[420px] flex flex-col justify-between',
          'snap-center shadow-none border-0 border-muted/70',
          'bg-white dark:bg-zinc-900 relative',
          'bg-no-repeat bg-cover bg-center',
          'rounded-[--spacing(6.75)]', // parent radius - parent padding
          className,
        )}
        style={{ backgroundImage: `url('${hack.media}')` }}
        {...props}
      >
        <CardContent className="flex-1 flex items-end justify-center -m-6 overflow-hidden">
          <div
            className={cn(
              'w-full p-6 pt-50 rounded-b-[--spacing(6.75)] text-gray-50/90',
              'backdrop-blur-md backdrop-brightness-50 supports-[backdrop-filter]:bg-radial-[at_25%_25%]',
              'from-black/40 to-transparent to-75%',
              '[mask-image:linear-gradient(to_top,_white_32%,_transparent)]',
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="text-lg font-bold line-clamp-2 h-[2lh]">{hack.title}</div>
              <div className="text-sm text-gray-50/70">{hack.author}</div>
            </div>

            <div className="flex items-center gap-2 text-gray-50/70 mt-4">
              <span className="flex items-center gap-1">
                <ThumbsUp
                  className="w-4 h-4"
                  aria-label={`Works for ${hack.interactions.upvotes} people`}
                />
                <span className="text-xs font-bold">{upvotes}</span>
              </span>

              <span className="flex items-center gap-1">
                <Bookmark
                  className="w-4 h-4"
                  aria-label={`Bookmarked by ${hack.interactions.bookmarks} people`}
                />
                <span className="text-xs font-bold">{bookmarks}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}

FeaturedHackCard.displayName = 'FeaturedHackCard'
