import { HTMLAttributes } from 'react'

import { FeaturedHack, FeaturedHackCard } from '@/compositions/card/FeaturedHack'
import { cn } from '@/lib/utils'

export interface FeaturedHacksSectionProps extends HTMLAttributes<HTMLElement> {
  featuredHacks: FeaturedHack[]
  innerClassName?: string
}

export const FeaturedHacksSection = ({
  featuredHacks,
  className,
  innerClassName,
  ...props
}: FeaturedHacksSectionProps) => {
  return (
    <section
      data-component="featured-hacks-section"
      className={cn('space-y-4', className)}
      {...props}
    >
      <h2 className="text-sm font-bold">Featured</h2>
      <div
        className={cn(
          'flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4',
          innerClassName,
        )}
      >
        {featuredHacks.map((hack) => (
          <FeaturedHackCard key={hack.id} hack={hack} />
        ))}
      </div>
    </section>
  )
}

FeaturedHacksSection.displayName = 'FeaturedHacksSection'
