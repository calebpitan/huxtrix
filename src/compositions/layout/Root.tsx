import { SidebarProvider } from '@/components/ui/sidebar'
import { AppFooter } from '@/compositions/footer/AppFooter'
import { AppBar } from '@/compositions/header'
import { BottomBar } from '@/compositions/navbar/BottomBar'
import { ThemeProvider } from '@/compositions/providers'

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div data-component="root-layout" className="relative flex min-h-screen flex-col">
        <AppBar className="lg:hidden" name="Huxtrix" />

        <main className="w-full">
          <SidebarProvider className="w-full">{children}</SidebarProvider>
        </main>

        {/* For x-large screens only */}
        <AppFooter className="md:order-1 hidden xl:block" />
        {/* For all screens except large */}
        <BottomBar className="md:order-0 lg:hidden xl:block" />
      </div>
    </ThemeProvider>
  )
}

RootLayout.displayName = 'RootLayout'
