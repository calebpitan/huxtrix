import { SidebarProvider } from '@/components/ui/sidebar'
import { featuredHacks } from '@/compositions/data/featured-hacks'
import { latestHacks } from '@/compositions/data/latest-hacks'
import { sidebarItems } from '@/compositions/data/sidebar-items'
import { AppFooter } from '@/compositions/footer/AppFooter'
import { BottomBar } from '@/compositions/navbar/BottomBar'
import { FeaturedHacksSection } from '@/compositions/section/FeaturedHacks'
import { HighlightSection } from '@/compositions/section/HighlightSection'
import { LatestHacksSection } from '@/compositions/section/LatestHacks'
import { PopularCategoriesSection } from '@/compositions/section/PopularCategories'
import { PopularCategoriesSectionProps } from '@/compositions/section/PopularCategories'
import { AppSidebar } from '@/compositions/sidebar'

const categories: PopularCategoriesSectionProps['categories'] = [
  { name: 'Tech', icon: '💻' },
  { name: 'Food', icon: '🍔' },
  { name: 'DIY', icon: '🛠️' },
  { name: 'Productivity', icon: '⚡' },
  { name: 'Home', icon: '🏠' },
  { name: 'Life', icon: '🌱' },
]

export default function Home() {
  return (
    <SidebarProvider className="w-full">
      <div className="flex flex-col lg:flex-row gap-8 w-full basis-full">
        <aside className="hidden lg:block lg:w-62.5 lg:shrink-0">
          <AppSidebar
            className="[&>[data-slot=sidebar-inner]]:border-0"
            items={sidebarItems}
            variant="floating"
            brand={{ name: 'Huxtrix' }}
          />
        </aside>

        <div className="flex flex-row gap-8 justify-center w-full min-w-0 lg:my-2 px-4 sm:px-8 lg:px-0 lg:pe-8">
          <div className="flex flex-col gap-8 xl:shrink w-full min-w-0 items-center">
            <HighlightSection className="w-dvw md:w-full fade-x mt-8 -mx-4 sm:-mx-8 xl:mx-0 [&>*]:px-4 [&>*]:sm:px-8" />

            <LatestHacksSection
              className="lg:max-w-[768px] xl:max-w-[992px]"
              latestHacks={latestHacks}
            />

            <PopularCategoriesSection
              className="inline-block xl:hidden -mx-4 sm:-mx-8 xl:mx-0"
              innerClassName="max-w-[100dvw] lg:max-w-[738px] xl:max-w-[992px]"
              categories={categories}
              axis="horizontal"
            />

            <FeaturedHacksSection
              className="w-dvw lg:w-full lg:fade-x-5% -mx-4 sm:-mx-8 xl:-mx-16 [&>*]:px-4 sm:[&>*]:px-8 xl:[&>*]:px-16"
              featuredHacks={featuredHacks}
            />

            <LatestHacksSection
              className="lg:max-w-[768px] xl:max-w-[992px]"
              latestHacks={latestHacks}
            />

            {/* For all screens except x-large */}
            <AppFooter className="md:order-1 lg:block xl:hidden" />
            {/* For large screens only */}
            <BottomBar className="hidden lg:block xl:hidden" />
          </div>

          <aside className="hidden xl:block grow mt-8">
            <PopularCategoriesSection
              categories={categories}
              axis="vertical"
              className="w-62.5 ms-auto"
            />
          </aside>
        </div>
      </div>
    </SidebarProvider>
  )
}
