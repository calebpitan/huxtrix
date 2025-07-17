import { HTMLAttributes } from 'react'

import { cva } from 'class-variance-authority'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface Category {
  name: string
  icon: string
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
      list: 'no-scrollbar flex cursor-pointer snap-x snap-mandatory gap-4 overflow-x-auto',
      item: 'bg-muted/70 dark:bg-muted/60 border-primary/20 w-full cursor-pointer snap-center rounded-2xl transition-shadow',
      icon: 'inline-flex size-8 items-center justify-center rounded-full bg-amber-500/70',
      text: 'text-sm font-medium',
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
      className: 'min-w-[90px] flex-row items-center px-4 py-4 sm:px-8',
    },
    {
      component: 'item',
      layout: 'vertical',
      className: 'flex items-center gap-3 px-4 py-3',
    },
    {
      component: 'item',
      layout: 'horizontal',
      className: 'flex min-w-[90px] flex-col items-center justify-center py-4',
    },
    {
      component: 'icon',
      layout: 'vertical',
      className: 'text-xl',
    },
    {
      component: 'icon',
      layout: 'horizontal',
      className: 'mb-2 text-2xl',
    },
    {
      component: 'text',
      layout: 'vertical',
      className: 'text-base',
    },
    {
      component: 'text',
      layout: 'horizontal',
      className: 'text-center text-sm',
    },
  ],
  defaultVariants: {
    layout: 'horizontal',
  },
})
