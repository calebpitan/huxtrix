'use client'

import { HTMLAttributes, useState } from 'react'

import { cva } from 'class-variance-authority'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface Category {
  name: string
  icon: string
  members: string
}
export interface PopularCategoriesSectionProps extends HTMLAttributes<HTMLElement> {
  categories: Category[]
  className?: string
  ListProps?: HTMLAttributes<HTMLDivElement>
  axis?: 'horizontal' | 'vertical'
}

export const PopularCategoriesSection = ({
  categories,
  className,
  axis = 'horizontal',
  ListProps = {},
  ...props
}: PopularCategoriesSectionProps) => {
  const layout = axis
  const { className: listClassName, ...listProps } = ListProps
  const [joined, setJoined] = useState<Record<string, boolean>>({})

  return (
    <section
      data-component="popular-categories-section"
      className={cn('space-y-3', className)}
      {...props}
    >
      <h2
        className={cn(
          'text-sm font-bold',
          layout === 'horizontal' ? 'px-4 sm:px-8 xl:px-0' : 'px-2',
        )}
      >
        Popular
      </h2>
      <div
        className={cn(categoryVariants({ component: 'list', layout }), listClassName)}
        {...listProps}
      >
        {categories.map((cat) => {
          const isJoined = joined[cat.name] ?? false
          const toggleJoined = () =>
            setJoined((current) => ({
              ...current,
              [cat.name]: !current[cat.name],
            }))

          return (
            <div key={cat.name} className={categoryVariants({ component: 'item', layout })}>
              <span className={categoryVariants({ component: 'icon', layout })}>{cat.icon}</span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className={categoryVariants({ component: 'text', layout })}>{cat.name}</span>
                <span className="text-foreground/50 truncate text-xs">{cat.members}</span>
              </div>
              <JoinButton
                joined={isJoined}
                onClick={toggleJoined}
                className={layout === 'horizontal' ? 'mt-auto w-full' : 'ms-auto h-7'}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

PopularCategoriesSection.displayName = 'PopularCategoriesSection'

function JoinButton({
  joined,
  onClick,
  className,
}: {
  joined: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-pressed={joined}
      onClick={onClick}
      className={cn(
        'h-8 rounded-full border bg-transparent px-3 text-xs shadow-none',
        joined
          ? 'text-foreground/60 hover:bg-foreground/10 hover:text-foreground active:bg-foreground/15 dark:hover:bg-foreground/10 dark:active:bg-foreground/15 border-transparent dark:bg-transparent'
          : 'border-border text-foreground dark:border-input hover:border-amber-500 hover:bg-amber-500 hover:text-black active:scale-[0.97] active:border-amber-600 active:bg-amber-600 active:text-black dark:bg-transparent dark:hover:border-amber-500 dark:hover:bg-amber-500 dark:hover:text-black dark:active:border-amber-600 dark:active:bg-amber-600',
        className,
      )}
    >
      {joined ? 'Joined' : 'Join'}
    </Button>
  )
}

const categoryVariants = cva('', {
  variants: {
    component: {
      list: 'no-scrollbar flex',
      item: '',
      icon: 'inline-flex shrink-0 items-center justify-center rounded-full',
      text: 'font-semibold',
    },
    layout: { vertical: '', horizontal: '' },
  },
  compoundVariants: [
    {
      component: 'list',
      layout: 'vertical',
      className: 'flex-col gap-0.5',
    },
    {
      component: 'list',
      layout: 'horizontal',
      className:
        'w-full snap-x snap-mandatory scroll-ps-4 gap-3 overflow-x-auto px-4 sm:scroll-ps-8 sm:px-8',
    },
    {
      component: 'item',
      layout: 'vertical',
      className:
        'hover:bg-muted group flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors',
    },
    {
      component: 'item',
      layout: 'horizontal',
      className:
        'flex w-[calc((100%-0.75rem)/2.15)] shrink-0 snap-start flex-col gap-3 rounded-2xl bg-muted/50 p-3 sm:w-[calc((100%-1.5rem)/3.15)]',
    },
    {
      component: 'icon',
      layout: 'vertical',
      className: 'bg-muted size-9 text-base transition-colors group-hover:bg-background',
    },
    {
      component: 'icon',
      layout: 'horizontal',
      className: 'bg-background size-11 text-xl',
    },
    {
      component: 'text',
      layout: 'vertical',
      className: 'truncate text-sm',
    },
    {
      component: 'text',
      layout: 'horizontal',
      className: 'line-clamp-2 text-left text-sm leading-5',
    },
  ],
  defaultVariants: {
    layout: 'horizontal',
  },
})
