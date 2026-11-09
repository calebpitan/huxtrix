import { HTMLAttributes } from 'react'

import { Bookmark, Flag, Gift, Link, MoreVertical, Share, ThumbsUp } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { CardTitle } from '@/components/ui/card'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface FeedPreviewCardProps extends HTMLAttributes<HTMLDivElement> {
  author: {
    name: string
    avatarUrl?: string
  }
  title: string
  summary: string
  channel?: string | null
  coverUrl?: string | null
  className?: string
}

export const FeedPreviewCard = ({
  author,
  title,
  summary,
  channel,
  coverUrl,
  className,
  ...props
}: FeedPreviewCardProps) => {
  const channelLabel = channel?.trim() ? channel.trim() : null
  const titled = title.trim().length > 0
  const authorName = author.name.trim()

  return (
    <Card
      data-component="feed-preview-card"
      className={cn('w-full gap-3 rounded-2xl border py-4 shadow-none', className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="min-w-0 truncate text-sm">
            {authorName ? <span className="font-semibold">{author.name}</span> : null}
            {channelLabel ? (
              <span className="text-muted-foreground">
                {authorName ? ' · ' : ''}
                {channelLabel}
              </span>
            ) : null}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="More options" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-muted/80 backdrop-blur-sm">
            <DropdownMenuItem>
              <Share className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="mr-2 h-4 w-4" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Flag className="mr-2 h-4 w-4" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex flex-col gap-1">
          {titled ? <CardTitle className="text-sm leading-snug">{title}</CardTitle> : null}
          {summary ? (
            titled ? (
              <CardDescription>{summary}</CardDescription>
            ) : (
              <p className="text-sm leading-snug">{summary}</p>
            )
          ) : null}
        </div>
        {coverUrl ? (
          <div className="mt-3 aspect-video overflow-hidden rounded-lg">
            <img src={coverUrl} alt={title || 'Cover'} className="h-full w-full object-cover" />
          </div>
        ) : null}
      </CardContent>
      <CardFooter inert className="gap-4 px-4">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Works for me"
          className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
        >
          <ThumbsUp className="h-5 w-5" />
          <span className="text-xs font-medium">Works for me</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Bookmark"
          className="flex items-center gap-1 text-cyan-600 hover:bg-cyan-100 dark:text-cyan-400 dark:hover:bg-cyan-900/30"
        >
          <Bookmark className="h-5 w-5" />
          <span className="text-xs font-medium">Bookmark</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Tip the author"
          className="flex items-center gap-1 text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
        >
          <Gift className="h-5 w-5" />
          <span className="text-xs font-medium">Reward</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
