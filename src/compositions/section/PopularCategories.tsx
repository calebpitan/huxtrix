import { HTMLAttributes } from 'react'

import { cva } from 'class-variance-authority'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type Category = { name: string; icon: string }
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

  return (
    <section
      data-component="popular-categories-section"
      className={cn('space-y-4', className)}
      {...props}
    >
      <h2 className="px-4 text-sm font-bold sm:px-8 xl:px-0">Popular</h2>
      <div
        className={cn(categoryVariants({ component: 'list', layout }), listClassName)}
        {...listProps}
      >
        {categories.map((cat) => (
          <div key={cat.name} className={categoryVariants({ component: 'item', layout })}>
            <span className={categoryVariants({ component: 'icon', layout })}>{cat.icon}</span>
            <div className="flex flex-col">
              <span className={categoryVariants({ component: 'text', layout })}>{cat.name}</span>
              <span className={'text-foreground/60 text-xs'}>289k members</span>
            </div>
            <Button
              className="ms-auto h-6 rounded-full bg-amber-500 text-black hover:bg-amber-500/80 active:scale-95"
              size="sm"
            >
              Join
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}

PopularCategoriesSection.displayName = 'PopularCategoriesSection'

const categoryVariants = cva('', {
  variants: {
    component: {
      list: 'flex gap-4 cursor-pointer snap-x snap-mandatory overflow-x-auto no-scrollbar',
      item: 'w-full bg-muted/70 dark:bg-muted/60 border-primary/20 snap-center transition-shadow cursor-pointer rounded-2xl',
      icon: 'rounded-full bg-amber-500/70 size-8 inline-flex items-center justify-center',
      text: 'font-medium text-sm',
    },
    layout: { vertical: '', horizontal: '' },
  },
  compoundVariants: [
    {
      component: 'list',
      layout: 'vertical',
      className: 'flex-col items-center gap-3 px-1 py-3',
    },
    {
      component: 'list',
      layout: 'horizontal',
      className: 'flex-row items-center min-w-[90px] px-4 sm:px-8 py-4',
    },
    {
      component: 'item',
      layout: 'vertical',
      className: 'flex items-center gap-3 px-4 py-3',
    },
    {
      component: 'item',
      layout: 'horizontal',
      className: 'flex flex-col items-center justify-center min-w-[90px] py-4',
    },
    {
      component: 'icon',
      layout: 'vertical',
      className: 'text-xl',
    },
    {
      component: 'icon',
      layout: 'horizontal',
      className: 'text-2xl mb-2',
    },
    {
      component: 'text',
      layout: 'vertical',
      className: 'text-base',
    },
    {
      component: 'text',
      layout: 'horizontal',
      className: 'text-sm text-center',
    },
  ],
  defaultVariants: {
    layout: 'horizontal',
  },
})
