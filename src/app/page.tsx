import { Fragment } from 'react'

import { featuredHacks } from '@/compositions/data/featured-hacks'
import { latestHacks } from '@/compositions/data/latest-hacks'
import { PageLayout } from '@/compositions/layout'
import { FeaturedHacksSection } from '@/compositions/section/FeaturedHacks'
import { HighlightSection } from '@/compositions/section/HighlightSection'
import { LatestHacksSection } from '@/compositions/section/LatestHacks'
import { PopularCategoriesSection } from '@/compositions/section/PopularCategories'
import { PopularCategoriesSectionProps } from '@/compositions/section/PopularCategories'

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
    <PageLayout>
      <Fragment>
        <HighlightSection className="fade-x -mx-4 mt-8 w-dvw sm:-mx-8 md:w-full xl:mx-0 [&>*]:px-4 [&>*]:sm:px-8" />

        <LatestHacksSection
          className="lg:max-w-[768px] xl:max-w-[992px]"
          latestHacks={latestHacks}
        />

        <PopularCategoriesSection
          axis="horizontal"
          categories={categories}
          className="-mx-4 inline-block sm:-mx-8 xl:mx-0 xl:hidden"
          ListProps={{ className: 'max-w-[100dvw] lg:max-w-[738px] xl:max-w-[992px]' }}
        />

        <FeaturedHacksSection
          className="lg:fade-x-5% -mx-4 w-dvw sm:-mx-8 lg:w-full xl:-mx-16 [&>*]:px-4 sm:[&>*]:px-8 xl:[&>*]:px-16"
          featuredHacks={featuredHacks}
        />

        <LatestHacksSection
          className="lg:max-w-[768px] xl:max-w-[992px]"
          latestHacks={latestHacks}
        />
      </Fragment>

      <PopularCategoriesSection
        axis="vertical"
        categories={categories}
        className="ms-auto w-62.5"
      />
    </PageLayout>
  )
}
