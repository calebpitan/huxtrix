'use client'

import { ComponentProps, HTMLAttributes, forwardRef, use, useEffect, useRef, useState } from 'react'

import { AnimatePresence } from 'motion/react'

import { latestHacks } from '@/compositions/data/latest-hacks'
import { profiles } from '@/compositions/data/profiles'
import { Profile, ProfileHeader } from '@/compositions/header'
import { PageLayout } from '@/compositions/layout'
import { LatestHacksSection } from '@/compositions/section'
import { useElementBounding } from '@/hooks/use-element-bounding'
import { useScroll } from '@/hooks/use-scroll'

type Params = { username: string }
export interface ProfilePageProps {
  params: Promise<Params>
}

interface QuickActionsContentProps extends HTMLAttributes<HTMLDivElement> {
  profile: Profile
  shouldDisplayProfileHeader?: boolean
  ProfileHeaderProps?: Omit<ComponentProps<typeof ProfileHeader>, 'profile'>
}

const QuickActionsContent = forwardRef<HTMLDivElement, QuickActionsContentProps>(
  ({ profile, shouldDisplayProfileHeader, ProfileHeaderProps, ...props }, ref) => {
    return (
      <div className="mt-8" ref={ref} {...props}>
        <AnimatePresence>
          {shouldDisplayProfileHeader && (
            <ProfileHeader profile={profile} position="alternate" {...ProfileHeaderProps} />
          )}
        </AnimatePresence>
      </div>
    )
  },
)

export default function ProfilePage({ params: paramsPromise }: ProfilePageProps) {
  const params = use(paramsPromise)
  const profile = profiles.find((p) => p.username === params.username)

  const pfHeaderRef = useRef<HTMLDivElement>(null)
  const quickActionsRef = useRef<HTMLDivElement>(null)

  const [pfhInitialSize, setPfhInitialSize] = useState<DOMRect>()
  const [shouldDisplayPfh, setShouldDisplayPfh] = useState(true)

  const [scroll] = useScroll(null, { throttle: 100 })
  const pfHeaderSize = useElementBounding(pfHeaderRef)
  const quickActionsSize = useElementBounding(quickActionsRef)

  useEffect(() => {
    setShouldDisplayPfh(scroll.y < 150)
  }, [scroll.y])

  useEffect(() => {
    if (!pfHeaderRef.current) return
    setPfhInitialSize(pfHeaderRef.current.getBoundingClientRect())
  }, [])

  if (!profile) {
    return <div>Profile not found</div>
  }

  const [xf, yf] = [0.5, 0.175] // inverse coefficient of friction
  const threshold = pfHeaderSize.height
  const ratio = Math.min(scroll.y / threshold, 1)

  const x0 = pfhInitialSize?.left ?? 723
  const x1 = quickActionsSize.left // the target x-coord
  const x = ratio * (x1 - x0) * xf // the intermediate x-coord
  const y1 = scroll.y
  const y2 = Math.min(scroll.y * (yf * 2.8571428571), threshold)

  const pfhLayoutId = 'profile-header'
  const pfhTransition = { type: 'spring', stiffness: 100, damping: 10 }

  return (
    <PageLayout
      QuickActions={
        <QuickActionsContent
          profile={profile}
          ref={quickActionsRef}
          shouldDisplayProfileHeader={!shouldDisplayPfh}
          ProfileHeaderProps={{ layoutId: pfhLayoutId, transition: pfhTransition }}
        />
      }
    >
      <div className="mt-8" style={{ height: pfhInitialSize && pfhInitialSize.height + 'px' }}>
        <AnimatePresence>
          {shouldDisplayPfh && (
            <ProfileHeader
              animation={ratio}
              profile={profile}
              ref={pfHeaderRef}
              layoutRoot
              layoutId={pfhLayoutId}
              transition={pfhTransition}
              whileInView={{ x, y: y1 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* <div>{pfhInitialSize?.left}</div>
      <div>{pfHeaderSize.left}</div>
      <div>{quickActionsSize.left}</div>
      <div>{JSON.stringify(scroll)}</div> */}

      <LatestHacksSection
        latestHacks={latestHacks}
        style={{
          transform: `translateY(${y2}px)`,
          // transition: 'transform 0.3s linear',
        }}
      />
    </PageLayout>
  )
}
