import { Fragment, HTMLAttributes, RefObject, memo, useId } from 'react'

import { PostCard } from '@/compositions/card/Post'
import { cn } from '@/lib/utils'

const demoImages = [
  '/images/Beautiful Image from Unsplash.jpg',
  '/images/Hello Aesthe Unsplash.jpg',
  '/images/Josh Hild Unsplash.jpg',
  '/images/Kelly Sikkema Unsplash.jpg',
  '/images/Danny Greenberg Unsplash.jpg',
]

function getRandomImages(id: number, getSerialized: (id: number) => string | undefined) {
  const count = Math.floor(Math.random() * 4) // 0-3 images
  const shuffled = demoImages.sort(() => 0.5 - Math.random())

  if (typeof window !== 'undefined') {
    const serialized = getSerialized(id)

    if (serialized !== undefined) {
      return serialized.trim() === '' ? [] : serialized.split(',')
    }
  }

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
  ref?: RefObject<HTMLDivElement | null>
}

export const LatestHacksSection = memo(
  ({ latestHacks, className, ...props }: LatestHacksSectionProps) => {
    const sectionLabelId = useId()
    const getSerialized = (id: number) =>
      document.getElementById(`latest-hack-${id}`)?.dataset.media

    return (
      <section
        data-component="latest-hacks-section"
        aria-describedby={sectionLabelId}
        className={cn('-mx-4 space-y-4 sm:-mx-8 md:mx-0', className)}
        {...props}
      >
        <h2 className="sr-only text-2xl font-bold" id={sectionLabelId}>
          Latest
        </h2>
        <div className="mx-auto w-full max-w-[470px]">
          <div className="flex flex-col">
            {latestHacks.map((hack) => {
              const media = getRandomImages(hack.id, getSerialized)

              return (
                <Fragment key={hack.id}>
                  <PostCard
                    id={'latest-hack-' + hack.id.toString()}
                    data-media={media.join(',')}
                    author={{ name: hack.author }}
                    title={hack.title}
                    summary={hack.summary}
                    upvotes={hack.upvotes}
                    tips={hack.tips}
                    media={media}
                  />
                </Fragment>
              )
            })}
          </div>
        </div>
      </section>
    )
  },
)

LatestHacksSection.displayName = 'LatestHacksSection'
