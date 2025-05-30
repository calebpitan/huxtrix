import { NavigationGuardProvider } from 'next-navigation-guard'

import { SidebarProvider } from '@/components/ui/sidebar'
import { AppBarProvider, AppBarSlot, BottomBar, TopBar } from '@/compositions/appbar'
import { AppFooter } from '@/compositions/footer/AppFooter'
import { ThemeProvider } from '@/compositions/providers'

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NavigationGuardProvider>
        <AppBarProvider>
          <div data-component="root-layout" className="relative flex min-h-screen flex-col">
            <AppBarSlot slot="topbar">
              <TopBar className="flex-1 lg:hidden" name="Huxtrix" size="base" />
            </AppBarSlot>

            <div className="flex w-full flex-1 flex-col">
              <SidebarProvider className="min-h-[calc(100svh_-_var(--appbar-size-base))] w-full flex-1 lg:min-h-full">
                {children}
              </SidebarProvider>
            </div>

            <BottomBar data-breakpoint-excluded="lg" breakpoint="lg" strategy="exclude">
              <AppBarSlot slot="bottombar">{null}</AppBarSlot>
            </BottomBar>

            <AppFooter data-breakpoint-included="xl" breakpoint="xl" strategy="include" />
          </div>
        </AppBarProvider>
      </NavigationGuardProvider>
    </ThemeProvider>
  )
}

RootLayout.displayName = 'RootLayout'
