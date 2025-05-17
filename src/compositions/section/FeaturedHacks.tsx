import { HTMLAttributes } from 'react'

import { FeaturedHack, FeaturedHackCard } from '@/compositions/card/FeaturedHack'
import { cn } from '@/lib/utils'

export interface FeaturedHacksSectionProps extends HTMLAttributes<HTMLElement> {
  featuredHacks: FeaturedHack[]
  className?: string
}

export const FeaturedHacksSection = ({
  featuredHacks,
  className,
  ...props
}: FeaturedHacksSectionProps) => {
  return (
    <section
      data-component="featured-hacks-section"
      className={cn('space-y-4 -mx-4 sm:-mx-8', className)}
      {...props}
    >
      <h2 className="text-sm font-bold px-4 sm:px-8">Featured</h2>
      <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 px-4 sm:px-8">
        {featuredHacks.map((hack) => (
          <FeaturedHackCard key={hack.id} hack={hack} />
        ))}
      </div>
    </section>
  )
}

FeaturedHacksSection.displayName = 'FeaturedHacksSection'
