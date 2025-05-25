import { HTMLAttributes } from 'react'

import { Bookmark, Flag, Gift, Link, MoreVertical, Share, ThumbsUp } from 'lucide-react'

import { PostImage } from '@/components/images/PostImage'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { CardTitle } from '@/components/ui/card'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface PostCardProps extends HTMLAttributes<HTMLDivElement> {
  author: {
    name: string
    avatarUrl?: string
  }
  title: string
  summary: string
  upvotes?: number
  tips?: number
  media?: string[]
  className?: string
}

export const PostCard = ({
  author,
  title,
  summary,
  upvotes = 0,
  tips = 0,
  media,
  className,
  ...props
}: PostCardProps) => {
  return (
    <Card
      data-component="post-card"
      className={cn(
        'bg-background border-muted/90 rounded-none border-0 shadow-none not-[:last-of-type]:border-b-1',
        className,
      )}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-base font-semibold">{author.name}</span>
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
      <CardContent className="max-h-[585px] pb-2">
        <CardTitle className="mb-4 text-lg font-medium">{title}</CardTitle>
        <CardDescription className="text-foreground/80 mb-2 text-sm">
          {summary} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio quod magni in
          dolorum molestiae modi reiciendis mollitia officiis, exercitationem distinctio inventore
          eaque beatae voluptatem. Explicabo expedita ullam debitis eveniet! Illum?
        </CardDescription>
        {media && media.length > 0 && (
          <div className={media.length === 1 ? 'mt-2' : 'mt-2 grid grid-cols-2 gap-2'}>
            {media.map((src, i) => (
              <PostImage
                key={src}
                src={src}
                alt={title + ' media ' + (i + 1)}
                className={media.length === 1 ? 'w-full' : 'w-full'}
                aspectRatio={media.length === 1 ? 4 / 3 : 1}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-2 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Works for me"
          className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
        >
          <ThumbsUp className="h-5 w-5" />
          <span className="text-xs font-medium">Works for me</span>
          {upvotes > 0 && <span className="ml-1 text-xs">{upvotes}</span>}
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
          {tips > 0 && <span className="ml-1 text-xs">{tips}</span>}
        </Button>
      </CardFooter>
    </Card>
  )
}
