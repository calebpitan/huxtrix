import { HTMLAttributes } from 'react'

import { FeaturedHack, FeaturedHackCard } from '@/compositions/card/FeaturedHack'
import { cn } from '@/lib/utils'

export interface FeaturedHacksSectionProps extends HTMLAttributes<HTMLElement> {
  featuredHacks: FeaturedHack[]
  ContentProps?: HTMLAttributes<HTMLDivElement>
}

export const FeaturedHacksSection = ({
  featuredHacks,
  className,
  ContentProps = {},
  ...props
}: FeaturedHacksSectionProps) => {
  const { className: contentClassName, ...contentProps } = ContentProps

  return (
    <section
      data-component="featured-hacks-section"
      className={cn('space-y-4', className)}
      {...props}
    >
      <h2 className="text-sm font-bold">Featured</h2>

      <div
        className={cn(
          'no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4',
          contentClassName,
        )}
        {...contentProps}
      >
        {featuredHacks.map((hack) => (
          <FeaturedHackCard key={hack.id} hack={hack} />
        ))}
      </div>
    </section>
  )
}

FeaturedHacksSection.displayName = 'FeaturedHacksSection'
