import { TRPCReactProvider } from '@hux/trpc/react'

import { NavigationGuardProvider } from 'next-navigation-guard'

import { SidebarProvider } from '@/components/ui/sidebar'
import { AppBarPassthrough, AppBarProvider, AppBarSlot } from '@/compositions/appbar'
import { ThemeProvider } from '@/compositions/providers'
import { SessionProvider } from '@/lib/auth/client'
import { evaluate } from '@/lib/utils'

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

function getUrl() {
  const base = evaluate(() => {
    if (typeof window !== 'undefined') return ''
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return 'http://localhost:3000'
  })

  return `${base}/api/trpc`
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NavigationGuardProvider>
        <SessionProvider>
          <TRPCReactProvider url={getUrl()}>
            <AppBarProvider>
              <div data-component="root-layout" className="relative flex min-h-dvh flex-col">
                <AppBarPassthrough slot="topbar">
                  <AppBarSlot slot="topbar" className="flex-1 lg:hidden" />
                </AppBarPassthrough>

                <div className="flex w-full flex-1 flex-col">
                  <SidebarProvider className="min-h-[calc(100dvh_-_var(--topbar-height,_var(--appbar-size-base)))] w-full flex-1 lg:min-h-full">
                    {children}
                  </SidebarProvider>
                </div>

                <AppBarPassthrough slot="bottombar">
                  {/* <BreakpointPassthrough breakpoints="lg" strategy="exclude"> */}
                  <AppBarSlot
                    slot="bottombar"
                    data-breakpoint-excluded="lg"
                    breakpoint="lg"
                    strategy="exclude"
                  />
                  {/* </BreakpointPassthrough> */}
                </AppBarPassthrough>
              </div>
            </AppBarProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </NavigationGuardProvider>
    </ThemeProvider>
  )
}
