import { HTMLAttributes, ReactElement } from 'react'

import { sidebarItems } from '@/compositions/data/sidebar-items'
import { AppFooter } from '@/compositions/footer/AppFooter'
import { BottomBar } from '@/compositions/navbar/BottomBar'
import { AppSidebar, AppSidebarProps } from '@/compositions/sidebar/AppSidebar'
import { cn } from '@/lib/utils'

export interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  SidebarProps?: Partial<Pick<AppSidebarProps, 'items' | 'variant' | 'brand'>>
  children: [ReactElement, ReactElement]
}

export const PageLayout = ({ children, className, SidebarProps, ...props }: PageLayoutProps) => {
  return (
    <div
      data-component="page-layout"
      className={cn('flex w-full basis-full flex-col gap-8 lg:flex-row', className)}
      {...props}
    >
      <aside className="hidden lg:block lg:w-62.5 lg:shrink-0">
        <AppSidebar
          className="[&>[data-slot=sidebar-inner]]:border-0"
          items={sidebarItems}
          variant="floating"
          brand={{ name: 'Huxtrix' }}
          {...SidebarProps}
        />
      </aside>

      <div
        className={cn(
          'flex w-full min-w-0 flex-row justify-center gap-8',
          'px-4 sm:px-8 lg:my-2 lg:px-0 lg:pe-8',
        )}
      >
        <div className="flex w-full min-w-0 flex-col items-center gap-8 xl:shrink">
          {children[0]}
          {/* For all screens except x-large */}
          <AppFooter className="md:order-1 lg:block xl:hidden" />
          {/* For large screens only */}
          <BottomBar className="hidden lg:block xl:hidden" />
        </div>

        <aside className="sticky top-0 hidden max-h-screen grow xl:block [&>:first-child]:ms-auto [&>:first-child]:w-62.5">
          {children[1]}
        </aside>
      </div>
    </div>
  )
}

PageLayout.displayName = 'PageLayout'
