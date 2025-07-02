import { HTMLAttributes, ReactElement } from 'react'

import { cva } from 'class-variance-authority'

import { AppBarPassthrough, AppBarSlot } from '@/compositions/appbar'
import { sidebarItems } from '@/compositions/data/sidebar-items'
import { AppSidebar, AppSidebarProps } from '@/compositions/sidebar/AppSidebar'
import { cn } from '@/lib/utils'

export interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  SidebarProps?: Partial<Pick<AppSidebarProps, 'items' | 'variant' | 'brand'>>
  children: [ReactElement, ReactElement]
}

const variants = cva('', {
  variants: {
    components: {
      'parent-half-page': 'flex w-full basis-full flex-col lg:flex-row',
      'child-half-page':
        'flex h-full w-full min-w-0 flex-row justify-center px-4 sm:px-8 lg:px-0 lg:py-2 lg:pe-8',
    },
  },
})

export function PageLayout({ children, className, SidebarProps, ...props }: PageLayoutProps) {
  return (
    <div
      data-component="page-layout"
      className={cn(variants({ components: 'parent-half-page' }), 'gap-8', className)}
      {...props}
    >
      <aside className="hidden lg:block lg:w-fit lg:max-w-64 lg:shrink-0">
        <AppSidebar
          className="[&>[data-slot=sidebar-inner]]:border-0"
          items={sidebarItems}
          variant="floating"
          brand={{ name: 'Huxtrix' }}
          {...SidebarProps}
        />
      </aside>

      <div className={cn(variants({ components: 'child-half-page' }), 'gap-8')}>
        <div className="flex h-full w-full min-w-0 flex-col items-center gap-8 xl:shrink">
          {/* <main className="grid grid-flow-row h-full gap-8">{children[0]}</main> */}
          <main className="flex h-full w-full flex-col items-center gap-8">{children[0]}</main>

          <AppBarPassthrough slot="bottombar">
            {/* <BreakpointPassthrough breakpoints="lg" strategy="include"> */}
            <AppBarSlot
              slot="bottombar-lg"
              data-breakpoint-included="lg"
              breakpoint="lg"
              strategy="include"
              className="lg:mb-0"
            />
            {/* </BreakpointPassthrough> */}
          </AppBarPassthrough>
        </div>

        <aside className="sticky top-0 hidden max-h-screen grow xl:block [&>:first-child]:ms-auto [&>:first-child]:w-64">
          {children[1]}
        </aside>
      </div>
    </div>
  )
}

PageLayout.displayName = 'PageLayout'
