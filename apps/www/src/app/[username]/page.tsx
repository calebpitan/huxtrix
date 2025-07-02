import { use } from 'react'

import { Metadata } from 'next'

import * as AnimatedProfile from '@/compositions/profile/Animated'
import { latestHacks } from '@/compositions/data/latest-hacks'
import { profiles } from '@/compositions/data/profiles'
import { PageAppBar, PageLayout } from '@/compositions/layout'
import { AnimatedProfileProvider } from '@/compositions/profile/AnimatedProvider'
import { LatestHacksSection } from '@/compositions/section/LatestHacks'

type Params = { username: string }

export interface ProfilePageProps {
  params: Promise<Params>
}

export async function generateMetadata({
  params: paramsPromise,
}: ProfilePageProps): Promise<Metadata> {
  const params = await paramsPromise
  const profile = profiles.find((p) => p.username === params.username)

  if (!profile) {
    return {
      title: 'Profile Not Found',
    }
  }

  return {
    title: `${profile.name} — Huxtrix`,
    description: profile.bio,
  }
}

export default function ProfilePage({ params: paramsPromise }: ProfilePageProps) {
  const params = use(paramsPromise)
  const profile = profiles.find((p) => p.username === params.username)

  return (
    <AnimatedProfileProvider profile={profile}>
      <PageAppBar />
      <PageLayout>
        <AnimatedProfile.Root>
          <AnimatedProfile.Anchor>
            <LatestHacksSection latestHacks={latestHacks} />
          </AnimatedProfile.Anchor>
        </AnimatedProfile.Root>

        <AnimatedProfile.Sidebar />
      </PageLayout>
    </AnimatedProfileProvider>
  )
}
