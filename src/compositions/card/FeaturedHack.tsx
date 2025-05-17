'use client'

import { HTMLAttributes, useId, useState } from 'react'

import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type FeaturedHack = {
  id: number
  title: string
  author: string
  media: string
  type: 'image' | 'video'
}

export interface FeaturedHackCardProps extends HTMLAttributes<HTMLElement> {
  hack: FeaturedHack
}

export const FeaturedHackCard = ({ hack, className, ...props }: FeaturedHackCardProps) => {
  const [imgError, setImgError] = useState(false)
  const expandId = useId()
  return (
    <Card
      data-component="featured-hack-card"
      className={cn(
        'min-w-[320px] max-w-xs h-[420px] flex flex-col justify-between',
        'snap-center shadow-none border-1 border-muted/90',
        'bg-white dark:bg-zinc-900 relative',
        className,
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle className="text-lg font-bold line-clamp-2">{hack.title}</CardTitle>
        <CardDescription className="text-sm">By {hack.author}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        {hack.type === 'image' ? (
          !imgError ? (
            <Image
              src={hack.media}
              alt={hack.title}
              width={220}
              height={160}
              className="rounded-lg object-cover w-full h-40"
              onError={() => setImgError(true)}
            />
          ) : (
            <canvas
              width={220}
              height={160}
              className="rounded-lg w-full h-40 bg-gray-200 dark:bg-zinc-800"
              style={{ display: 'block' }}
            />
          )
        ) : (
          <video src={hack.media} controls className="rounded-lg object-cover w-full h-40" />
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Button variant="ghost" className="w-full flex flex-col items-center group relative">
          <span id={expandId} className="text-xs text-muted-foreground sr-only">
            Expand
          </span>

          <ChevronDown
            className="mt-1 h-6 w-6 text-primary group-hover:scale-125 transition-transform"
            aria-labelledby={expandId}
          />
        </Button>
      </CardFooter>
    </Card>
  )
}

FeaturedHackCard.displayName = 'FeaturedHackCard'
