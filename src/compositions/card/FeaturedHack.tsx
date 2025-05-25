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
    <article className="rounded-4xl bg-black p-1.25 dark:bg-white/70">
      <Card
        data-component="featured-hack-card"
        className={cn(
          'flex h-[420px] max-w-xs min-w-[320px] flex-col justify-between',
          'border-muted/70 snap-center border-0 shadow-none',
          'relative bg-white dark:bg-zinc-900',
          'bg-cover bg-center bg-no-repeat',
          'rounded-[--spacing(6.75)]', // parent radius - parent padding
          className,
        )}
        style={{ backgroundImage: `url('${hack.media}')` }}
        {...props}
      >
        <CardContent className="-m-6 flex flex-1 items-end justify-center overflow-hidden">
          <div
            className={cn(
              'w-full rounded-b-[--spacing(6.75)] p-6 pt-50 text-gray-50/90',
              'backdrop-blur-md backdrop-brightness-50 supports-[backdrop-filter]:bg-radial-[at_25%_25%]',
              'from-black/40 to-transparent to-75%',
              '[mask-image:linear-gradient(to_top,_white_32%,_transparent)]',
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="line-clamp-2 h-[2lh] text-lg font-bold">{hack.title}</div>
              <div className="text-sm text-gray-50/70">{hack.author}</div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-gray-50/70">
              <span className="flex items-center gap-1">
                <ThumbsUp
                  className="h-4 w-4"
                  aria-label={`Works for ${hack.interactions.upvotes} people`}
                />
                <span className="text-xs font-bold">{upvotes}</span>
              </span>

              <span className="flex items-center gap-1">
                <Bookmark
                  className="h-4 w-4"
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
