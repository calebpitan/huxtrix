import { SidebarProvider } from '@/components/ui/sidebar'
import { sidebarItems } from '@/compositions/data/sidebar-items'
import { FeaturedHacksSection } from '@/compositions/section/FeaturedHacks'
import { FeaturedHacksSectionProps } from '@/compositions/section/FeaturedHacks'
import { LatestHacksSection, LatestHacksSectionProps } from '@/compositions/section/LatestHacks'
import { PopularCategoriesSection } from '@/compositions/section/PopularCategories'
import { PopularCategoriesSectionProps } from '@/compositions/section/PopularCategories'
import { AppSidebar } from '@/compositions/sidebar'

const featuredHacks: FeaturedHacksSectionProps['featuredHacks'] = [
  {
    id: 1,
    title: 'Speed Up Your Workflow with VSCode',
    author: 'Jane Doe',
    media: '/images/vscode-hack.jpg',
    type: 'image',
  },
  {
    id: 2,
    title: 'Quick Meal Prep Trick',
    author: 'Chef Mike',
    media: '/images/meal-prep.mp4',
    type: 'video',
  },
  {
    id: 3,
    title: 'DIY Cable Organizer',
    author: 'Alex Lee',
    media: '/images/cable-organizer.jpg',
    type: 'image',
  },
  {
    id: 4,
    title: 'DIY Cable Organizer',
    author: 'Alex Lee',
    media: '/images/cable-organizer.jpg',
    type: 'image',
  },
]

const categories: PopularCategoriesSectionProps['categories'] = [
  { name: 'Tech', icon: '💻' },
  { name: 'Food', icon: '🍔' },
  { name: 'DIY', icon: '🛠️' },
  { name: 'Productivity', icon: '⚡' },
  { name: 'Home', icon: '🏠' },
  { name: 'Life', icon: '🌱' },
]

const latestHacks: LatestHacksSectionProps['latestHacks'] = [
  {
    id: 4,
    title: 'How to Fold a Shirt in 2 Seconds',
    author: 'Sam Quick',
    summary: 'A simple trick to fold shirts super fast.',
  },
  {
    id: 5,
    title: 'Speed Reading Technique',
    author: 'Lisa Fast',
    summary: 'Double your reading speed with this method.',
  },
  {
    id: 6,
    title: 'Easy Cable Management',
    author: 'Chris Wire',
    summary: 'Keep your cables tidy with this DIY hack.',
  },
]

export default function Home() {
  return (
    <SidebarProvider className="w-full">
      <div className="flex flex-col md:flex-row flex-1 gap-8 px-4 sm:px-8">
        <aside className="hidden xl:block xl:max-w-72 xl:shrink-0">
          <AppSidebar
            items={sidebarItems}
            variant="floating"
            className="[&>[data-slot=sidebar-inner]]:border-0"
          />
        </aside>

        <div className="flex flex-row w-full justify-center shrink my-2">
          
          <div className="flex flex-col gap-12 w-full lg:max-w-[768px] xl:max-w-[992px]">
            <LatestHacksSection latestHacks={latestHacks} />
            <PopularCategoriesSection
              categories={categories}
              className="xl:hidden"
              axis="horizontal"
            />
            <FeaturedHacksSection featuredHacks={featuredHacks} />
          </div>

          <aside className="hidden xl:block xl:w-72 xl:shrink-0">
            <PopularCategoriesSection categories={categories} axis="vertical" />
          </aside>
        </div>
      </div>
    </SidebarProvider>
  )
}
