import { HTMLAttributes } from 'react'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export type Category = { name: string; icon: string }
export interface PopularCategoriesSectionProps extends HTMLAttributes<HTMLElement> {
  categories: Category[]
  className?: string
  innerClassName?: string
  axis?: 'horizontal' | 'vertical'
}

export const PopularCategoriesSection = ({
  categories,
  className,
  innerClassName,
  axis = 'horizontal',
  ...props
}: PopularCategoriesSectionProps) => {
  const layout = axis

  return (
    <section
      data-component="popular-categories-section"
      className={cn('space-y-4', className)}
      {...props}
    >
      <h2 className="text-sm font-bold px-4 sm:px-8 xl:px-0">Popular</h2>
      <div className={cn(categoryVariants({ component: 'list', layout }), innerClassName)}>
        {categories.map((cat) => (
          <div key={cat.name} className={categoryVariants({ component: 'item', layout })}>
            <span className={categoryVariants({ component: 'icon', layout })}>{cat.icon}</span>
            <span className={categoryVariants({ component: 'text', layout })}>{cat.name}</span>
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
      item: 'w-full bg-muted/70 dark:bg-muted/60 border-primary/20 snap-center transition-shadow cursor-pointer rounded-lg',
      icon: '',
      text: 'font-semibold',
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
      className: 'text-2xl',
    },
    {
      component: 'icon',
      layout: 'horizontal',
      className: 'text-3xl mb-2',
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
