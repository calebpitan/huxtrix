import { getQueryClient } from '@hux/trpc'
import { TRPCReactProvider } from '@hux/trpc/react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import { NavigationGuardProvider } from 'next-navigation-guard'

import { SidebarProvider } from '@/components/ui/sidebar'
import { AppBarPassthrough, AppBarProvider, AppBarSlot } from '@/compositions/appbar'
import { ProfileSetup } from '@/compositions/profile'
import { ThemeProvider } from '@/compositions/providers'
import { SessionProvider } from '@/lib/auth/client'
import { auth } from '@/lib/auth/server'
import { getUrl } from '@/lib/trpc/server'
import { trpc } from '@/lib/trpc/server'
import { evaluate } from '@/lib/utils'

type RootLayoutProps = Readonly<{
  children: React.ReactNode
  shouldForceUserUpdate?: boolean
}>

export async function RootLayout({ children }: RootLayoutProps) {
  const queryClient = getQueryClient()
  const session = await auth()
  const { shouldForceUserUpdate, user } = await evaluate(async () => {
    if (session) {
      const user = await queryClient.fetchQuery(
        trpc.user.getByID.queryOptions({ id: session.user.id }),
      )

      return {
        shouldForceUserUpdate: user.username === null,
        user: {
          id: user.id,
          firstName: user.names.first,
          lastName: user.names.last,
          username: user.username ?? '',
        },
      }
    }

    return { shouldForceUserUpdate: false, user: null }
  })

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NavigationGuardProvider>
        <SessionProvider session={session}>
          <TRPCReactProvider url={getUrl()}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <AppBarProvider>
                <div data-component="root-layout" className="relative flex min-h-dvh flex-col">
                  <AppBarPassthrough slot="topbar">
                    <AppBarSlot slot="topbar" className="flex-1 lg:hidden" />
                  </AppBarPassthrough>

                  <div className="flex w-full flex-1 flex-col">
                    <SidebarProvider className="min-h-[calc(100dvh_-_var(--topbar-height,_var(--appbar-size-base)))] w-full flex-1 lg:min-h-full">
                      {children}

                      {shouldForceUserUpdate && <ProfileSetup user={user!} />}
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
            </HydrationBoundary>
          </TRPCReactProvider>
        </SessionProvider>
      </NavigationGuardProvider>
    </ThemeProvider>
  )
}
