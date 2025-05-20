import { HTMLAttributes, ReactElement, ReactNode } from 'react'

import { sidebarItems } from '@/compositions/data/sidebar-items'
import { AppSidebar, AppSidebarProps } from '@/compositions/sidebar/AppSidebar'
import { cn } from '@/lib/utils'

export interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  SidebarProps?: Partial<Pick<AppSidebarProps, 'items' | 'variant' | 'brand'>>
  children: ReactNode
  QuickActions?: ReactElement
}

export const PageLayout = ({
  children,
  className,
  SidebarProps,
  QuickActions,
  ...props
}: PageLayoutProps) => {
  return (
    <div
      data-component="page-layout"
      className={cn('flex flex-col lg:flex-row gap-8 w-full basis-full', className)}
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
          'flex flex-row gap-8 justify-center w-full min-w-0',
          'lg:my-2 px-4 sm:px-8 lg:px-0 lg:pe-8',
        )}
      >
        <div className="flex flex-col gap-8 xl:shrink w-full min-w-0 items-center">{children}</div>

        <aside className="sticky top-0 max-h-screen hidden xl:block grow [&>:first-child]:w-62.5 [&>:first-child]:ms-auto">
          {QuickActions}
        </aside>
      </div>
    </div>
  )
}

PageLayout.displayName = 'PageLayout'
