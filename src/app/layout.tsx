import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'

import { SidebarProvider } from '@/components/ui/sidebar'
import { AppFooter } from '@/compositions/footer/AppFooter'
import { AppBar } from '@/compositions/header'
import { BottomBar } from '@/compositions/navbar/BottomBar'
import { ThemeProvider } from '@/compositions/providers'
import { cn } from '@/lib/utils'

import './globals.css'

const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Huxtrix - Hoax & Tricks',
  description: 'A place for sharing useful hacks, tips, and tricks',
}

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'w-full max-w-full min-h-screen bg-background font-sans antialiased',
          dmSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
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
      </body>
    </html>
  )
}
