import { Fragment, HTMLAttributes, useId } from 'react'

import { PostCard } from '@/compositions/card/Post'
import { cn } from '@/lib/utils'

const demoImages = [
  '/images/Beautiful Image from Unsplash.jpg',
  '/images/Hello Aesthe Unsplash.jpg',
  '/images/Josh Hild Unsplash.jpg',
  '/images/Kelly Sikkema Unsplash.jpg',
  '/images/Danny Greenberg Unsplash.jpg',
]

function getRandomImages() {
  const count = Math.floor(Math.random() * 4) // 0-3 images
  const shuffled = demoImages.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export interface LatestHack {
  id: number
  title: string
  author: string
  summary: string
  upvotes?: number
  tips?: number
}

export interface LatestHacksSectionProps extends HTMLAttributes<HTMLElement> {
  latestHacks: LatestHack[]
  className?: string
}

export const LatestHacksSection = ({
  latestHacks,
  className,
  ...props
}: LatestHacksSectionProps) => {
  const sectionLabelId = useId()

  return (
    <section
      data-component="latest-hacks-section"
      aria-describedby={sectionLabelId}
      className={cn('md:w-full -mx-4 sm:-mx-8 md:mx-0 space-y-4', className)}
      {...props}
    >
      <h2 className="text-2xl font-bold sr-only" id={sectionLabelId}>
        Latest
      </h2>
      <div className="w-full max-w-[470px] mx-auto">
        <div className="flex flex-col">
          {latestHacks.map((hack) => (
            <Fragment key={hack.id}>
              <PostCard
                author={{ name: hack.author }}
                title={hack.title}
                summary={hack.summary}
                upvotes={hack.upvotes}
                tips={hack.tips}
                media={getRandomImages()}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

LatestHacksSection.displayName = 'LatestHacksSection'
