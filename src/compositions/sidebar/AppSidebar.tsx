import { ComponentProps, HTMLAttributes } from 'react'

import Link from 'next/link'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

type Brand = {
  name: string
  icon?: React.ReactNode
}

type SidebarItem = {
  title: string
  icon: React.ReactNode
  label: React.ReactNode
  link: string
}

export interface AppSidebarProps
  extends HTMLAttributes<HTMLDivElement>,
    ComponentProps<typeof Sidebar> {
  items: SidebarItem[]
  active?: string | ((item: SidebarItem) => boolean)
  brand: Brand
}

function isFn(fn: any): fn is (...args: any[]) => any {
  return typeof fn === 'function'
}

export const AppSidebar = ({ items, active, brand, ...props }: AppSidebarProps) => {
  return (
    <Sidebar data-component="app-sidebar" {...props}>
      <SidebarHeader className="px-10 mt-16">
        <span className="font-bold text-xl tracking-tight">{brand.name}</span>
      </SidebarHeader>

      <SidebarContent className="mt-16">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isFn(active) ? active(item) : item.link === active

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton size="lg" className="rounded-none px-10 text-foreground/80">
                  <Link href={item.link} className="inline-flex gap-6 rounded-none w-full">
                    <span>{item.icon}</span>

                    <span className={cn('font-semibold md:font-bold text-sm md:text-base grow')}>
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
