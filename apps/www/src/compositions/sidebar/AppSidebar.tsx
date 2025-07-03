import { ComponentProps, HTMLAttributes } from 'react'

import Link from 'next/link'

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu } from '@/components/ui/sidebar'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { cn, isFn } from '@/lib/utils'

type Brand = { name: string; icon?: React.ReactNode }
type SidebarItem = { title: string; icon: React.ReactNode; label: React.ReactNode; link: string }

export interface AppSidebarProps
  extends HTMLAttributes<HTMLDivElement>,
    ComponentProps<typeof Sidebar> {
  items: SidebarItem[]
  active?: string | ((item: SidebarItem) => boolean)
  brand: Brand
}

export const AppSidebar = ({ items, active, brand, ...props }: AppSidebarProps) => {
  return (
    <Sidebar data-component="app-sidebar" {...props}>
      <SidebarHeader className="mt-16 px-10">
        <span className="text-xl font-bold tracking-tight">{brand.name}</span>
      </SidebarHeader>

      <SidebarContent className="mt-16">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isFn(active) ? active(item) : item.link === active
            isActive.valueOf()

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton size="lg" className="text-foreground/80 rounded-none px-10">
                  <Link href={item.link} className="inline-flex w-full gap-6 rounded-none">
                    <span>{item.icon}</span>

                    <span className={cn('grow text-sm font-semibold md:text-base md:font-bold')}>
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
