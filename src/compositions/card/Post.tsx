import { HTMLAttributes } from 'react'

import { Bookmark, Link, Flag, Gift, MoreVertical, Share, ThumbsUp } from 'lucide-react'

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
      className={cn('rounded-none shadow-none border-1 border-t-0 border-muted/90', className)}
      {...props}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-base">{author.name}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="More options" className="rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-muted/80 backdrop-blur-sm">
            <DropdownMenuItem>
              <Share className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="w-4 h-4 mr-2" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Flag className="w-4 h-4 mr-2" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-2 max-h-[585px]">
        <CardTitle className="font-medium text-lg mb-4">{title}</CardTitle>
        <CardDescription className="text-foreground/80 text-sm mb-2">
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
      <CardFooter className="flex items-center gap-4 mt-2">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Works for me"
          className="flex items-center gap-1 text-primary"
        >
          <ThumbsUp className="w-5 h-5" />
          <span className="text-xs font-medium">Works for me</span>
          {upvotes > 0 && <span className="ml-1 text-xs">{upvotes}</span>}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Bookmark" className="rounded">
          <Bookmark className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Tip the author"
          className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
        >
          <Gift className="w-5 h-5" />
          <span className="text-xs font-medium">Tip</span>
          {tips > 0 && <span className="ml-1 text-xs">{tips}</span>}
        </Button>
      </CardFooter>
    </Card>
  )
}
