import { use } from 'react'

import { Metadata } from 'next'

import * as AnimatedProfile from '@/compositions/profile/Animated'
import { latestHacks } from '@/compositions/data/latest-hacks'
import { PageAppBar, PageLayout } from '@/compositions/layout'
import { AnimatedProfileProvider } from '@/compositions/profile/AnimatedProvider'
import { LatestHacksSection } from '@/compositions/section/LatestHacks'
import { getUserByUsername } from '@/lib/datasource/user'

interface Params {
  username: string
}

export interface ProfilePageProps {
  params: Promise<Params>
}

export async function generateMetadata({
  params: paramsPromise,
}: ProfilePageProps): Promise<Metadata> {
  const params = await paramsPromise
  const profile = await getUserByUsername(params.username)

  if (!profile) {
    return {
      title: 'Profile Not Found',
    }
  }

  return {
    title: `${profile.names.name} — Huxtrix`,
    description: profile.summary,
  }
}

export default function ProfilePage({ params: paramsPromise }: ProfilePageProps) {
  const params = use(paramsPromise)
  const profile = getUserByUsername(params.username).then((d) => ({
    name: d.names.name,
    avatar: d.avatar,
    socials: d.socials,
    summary: d.summary,
    username: d.username ?? '',
  }))

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
