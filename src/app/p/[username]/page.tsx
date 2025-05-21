'use client'

import { ComponentProps, Fragment, HTMLAttributes, forwardRef, use, useCallback } from 'react'
import { useEffect, useRef, useState } from 'react'

import { AnimatePresence, Transition, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useTransform } from 'motion/react'

import { latestHacks } from '@/compositions/data/latest-hacks'
import { profiles } from '@/compositions/data/profiles'
import { Profile, ProfileHeader } from '@/compositions/header'
import { PageLayout } from '@/compositions/layout'
import { LatestHacksSection } from '@/compositions/section'
import { useAnimationFrame } from '@/hooks/use-animation-frame'
import { useElementBounding } from '@/hooks/use-element-bounding'
import { createDomRect } from '@/lib/utils'

type Params = { username: string }

interface QuickActionsProps extends HTMLAttributes<HTMLDivElement> {
  profile: Profile
  ProfileHeaderProps?: Omit<ComponentProps<typeof ProfileHeader>, 'profile'>
}

export interface ProfilePageProps {
  params: Promise<Params>
}

const MotionLatestHacksSection = motion.create(LatestHacksSection)

const QuickActions = forwardRef<HTMLDivElement, QuickActionsProps>(
  ({ profile, ProfileHeaderProps, ...props }, ref) => {
    return (
      <div className="mt-8" ref={ref} {...props}>
        <AnimatePresence mode="wait">
          {ProfileHeaderProps?.mode === 'alternate' && (
            <ProfileHeader profile={profile} {...ProfileHeaderProps} />
          )}
        </AnimatePresence>
      </div>
    )
  },
)

QuickActions.displayName = 'QuickActions'

export default function ProfilePage({ params: paramsPromise }: ProfilePageProps) {
  const params = use(paramsPromise)
  const profile = profiles.find((p) => p.username === params.username)

  const profileHeaderRef = useRef<HTMLDivElement>(null)
  const profileHeaderParentRef = useRef<HTMLDivElement>(null)
  const quickActionsRef = useRef<HTMLDivElement>(null)
  const latestHacksRef = useRef<HTMLDivElement>(null)
  const animationTimeout = useRef<NodeJS.Timeout>(null)

  const [profileHeaderMode, setProfileHeaderMode] = useState<'primary' | 'alternate'>('primary')
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down')
  const [initialSizes, setInitialSizes] = useState({
    profileHeader: createDomRect(),
    latestHacks: createDomRect(),
  })

  const quickActionsSize = useElementBounding(quickActionsRef)
  const latestHacksSize = useElementBounding(latestHacksRef)

  const schedule = useAnimationFrame()

  const deltaX = quickActionsSize.left - initialSizes.profileHeader.left
  const deltaY = quickActionsSize.top - initialSizes.profileHeader.top

  const { scrollYProgress, scrollY } = useScroll({
    target: profileHeaderParentRef,
    offset: ['start start', 'end start'],
  })
  const x = useTransform(scrollYProgress, [0, 0.03125, 1], [0, deltaX / 32, deltaX])
  const y = useTransform(scrollYProgress, [0, 0.125, 1], [0, -deltaY, -deltaY * 8])

  const handleScrollYProgressChange = useCallback(
    (value: number) => {
      const timeout = scrollDirection === 'down' ? 100 : 500

      if (animationTimeout.current !== null) {
        clearTimeout(animationTimeout.current)
      }

      if (value < 1 && value > 0.9 && scrollDirection === 'up') {
        console.debug('scrollYProgressChange %f', value)
        return setProfileHeaderMode('primary')
      }

      animationTimeout.current = setTimeout(() => {
        const threshold = scrollDirection === 'down' ? 0.35 : 0.65
        const currentY = scrollY.get()
        const anchorY = latestHacksSize.top

        if (value < threshold) {
          setProfileHeaderMode('primary')
          schedule(() => scroll(0, 0))
        }

        if (value > threshold) {
          setProfileHeaderMode('alternate')
          schedule(() => scroll(0, value < 1 ? currentY + anchorY : currentY))
        }
      }, timeout)
    },
    [latestHacksSize.top, schedule, scrollDirection, scrollY],
  )

  useMotionValueEvent(scrollY, 'change', (current) => {
    const diff = current - (scrollY.getPrevious() ?? 0)
    setScrollDirection(diff > 0 ? 'down' : 'up')
  })

  useMotionValueEvent(scrollYProgress, 'change', handleScrollYProgressChange)

  useEffect(() => {
    if (!profileHeaderRef.current || !latestHacksRef.current) return

    const sizes: typeof initialSizes = {
      profileHeader: profileHeaderRef.current.getBoundingClientRect(),
      latestHacks: latestHacksRef.current.getBoundingClientRect(),
    }

    setInitialSizes(sizes)
  }, [])

  if (!profile) {
    return <div>Profile not found</div>
  }

  const pfhLayoutId = 'profile-header'
  const pfhTransition: Transition = { type: 'keyframes', duration: 0.15 }
  // type: 'spring', stiffness: 100, damping: 8,

  return (
    <PageLayout>
      <Fragment>
        <div
          className="mt-8 z-10"
          style={{ height: initialSizes.profileHeader.height || undefined }}
          ref={profileHeaderParentRef}
        >
          <AnimatePresence mode="wait">
            {profileHeaderMode === 'primary' && (
              <ProfileHeader
                profile={profile}
                ref={profileHeaderRef}
                layoutId={pfhLayoutId}
                style={{ x, y: scrollY }}
                animationProgress={scrollYProgress.get()}
                id={`${profileHeaderMode}-profile-header`}
              />
            )}
          </AnimatePresence>
        </div>

        <MotionLatestHacksSection
          ref={latestHacksRef}
          latestHacks={latestHacks}
          style={{ y: profileHeaderMode === 'primary' ? y : 0 }}
        />
      </Fragment>

      <QuickActions
        profile={profile}
        ref={quickActionsRef}
        ProfileHeaderProps={{
          layoutId: pfhLayoutId,
          transition: pfhTransition,
          mode: profileHeaderMode,
          // initial: { opacity: 0.5 },
          // animate: { opacity: 1, transition: { duration: 0.3 } },
          // exit: { opacity: 0.5, transition: { duration: 0.3 } },
        }}
      />
    </PageLayout>
  )
}
// x, ig, yt, tk, substack
