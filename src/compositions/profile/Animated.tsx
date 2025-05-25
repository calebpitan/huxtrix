'use client'

import { ComponentProps, Fragment, ReactElement, Ref, RefObject } from 'react'
import { cloneElement, isValidElement, useEffect, useMemo, useRef } from 'react'

import { AnimatePresence, HTMLMotionProps, MotionValue, Transition, motion } from 'motion/react'
import { cubicBezier, useSpring, useTransform } from 'motion/react'

import { Button } from '@/components/ui/button'
import { ProfileHeader } from '@/compositions/header'
import { useForkRef } from '@/hooks/use-fork-ref'
import { cn } from '@/lib/utils'

import { useAnimatedProfile } from './AnimatedProvider'
import { SocialProfiles } from './Socials'

export interface AnimatedProfileSidebarProps extends ComponentProps<'div'> {
  ref?: RefObject<HTMLDivElement | null>
  ProfileHeaderProps?: Omit<ComponentProps<typeof ProfileHeader>, 'profile'>
}
export interface AnimatedProfileAnchorProps extends HTMLMotionProps<'div'> {
  y?: MotionValue<number>
  ref?: Ref<HTMLDivElement | null>
}

export interface AnimatedProfileProps {
  ref?: RefObject<HTMLDivElement | null>
  headerRef?: RefObject<HTMLDivElement | null>
  anchorRef?: RefObject<HTMLDivElement | null>
  children: ReactElement<AnimatedProfileAnchorProps>
}

const LAYOUT_ID = 'profile-header'
const TRANSITION: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 18,
  duration: 10.3,
}

// https://cubic-bezier.com/#.54,-0.01,1,-0.13
const customEaseIn = cubicBezier(0.54, 0, 1, -0.13)

function AnimatedProfileAnchor({
  children,
  className,
  style,
  y,
  ...props
}: AnimatedProfileAnchorProps) {
  return (
    <motion.div
      className={cn(className)}
      style={{ y, transition: 'transform 0.8s ease-out', ...style }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function AnimatedProfileSidebar({
  ref,
  ProfileHeaderProps,
  ...props
}: AnimatedProfileSidebarProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const forkedRef = useForkRef(ref, rootRef)

  const { mode, initialSizes, motion: mo, profile, updateRefs } = useAnimatedProfile()
  const y = useSpring(
    useTransform(mo.scroll.progress, (p) => initialSizes.header.height * p),
    { stiffness: 80, damping: 18 },
  )

  useEffect(() => updateRefs({ sidebar: rootRef }), [updateRefs])

  if (!profile) {
    return <div key="profile-not-found">Profile not found</div>
  }

  return (
    <AnimatePresence>
      <div className="mt-8" ref={forkedRef} {...props}>
        {mode === 'alternate' && (
          <ProfileHeader
            profile={profile}
            layoutId={LAYOUT_ID}
            transition={TRANSITION}
            id={`${mode}-profile-header`}
            {...ProfileHeaderProps}
          />
        )}
      </div>

      <motion.div
        className="mt-8 flex flex-row gap-4"
        key="profile-actions"
        style={{ y: mode === 'primary' ? y : 0 }}
      >
        <div className="flex w-full flex-row justify-center gap-4">
          <Button variant="secondary">Edit Profile</Button>
          <Button variant="default">Subscribers</Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function AnimatedProfile({
  ref,
  headerRef: headerRefProp,
  anchorRef: anchorRefProp,
  children: anchor,
}: AnimatedProfileProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  const forkedRef = useForkRef(rootRef, ref)
  const forkedHeaderRef = useForkRef(headerRef, headerRefProp)
  const forkedAnchorRef = useForkRef(anchorRef, anchorRefProp)

  const { motion, mode, profile, initialSizes, updateRefs } = useAnimatedProfile()

  const xspring = useSpring(motion.header.x, { stiffness: 80, damping: 18 })
  const yspring = useSpring(motion.header.y, { stiffness: 80, damping: 18 })
  // This is equivalent to easeOut because we are using the inverse of the progress
  const opacity = useTransform(() => customEaseIn(1 - motion.scroll.progress.get()))

  const children = useMemo(() => {
    if (isValidElement(anchor)) {
      return cloneElement(anchor, { y: motion.anchor.y, ref: forkedAnchorRef })
    }

    return anchor
  }, [anchor, forkedAnchorRef, motion.anchor.y])

  useEffect(() => updateRefs({ root: rootRef, header: headerRef, anchor: anchorRef }), [updateRefs])

  if (!profile) {
    return <div key="profile-not-found">Profile not found</div>
  }

  return (
    <Fragment key="profile-main-content">
      <AnimatePresence>
        <div
          className="z-10 mt-8"
          style={{ height: initialSizes.header.height || undefined }}
          ref={forkedRef}
        >
          {mode === 'primary' && (
            <ProfileHeader
              className="supports-[backdrop-filter]:bg-background/80 rounded-lg backdrop-blur-md"
              profile={profile}
              layoutId={LAYOUT_ID}
              ref={forkedHeaderRef}
              transition={TRANSITION}
              id={`${mode}-profile-header`}
              animationProgress={motion.scroll.progress.get()}
              style={{ x: xspring, y: yspring }}
            />
          )}
        </div>
      </AnimatePresence>

      <SocialProfiles
        className="z-0 py-4"
        data-q={motion.signal.get()}
        style={{ opacity }}
        profiles={profile.social}
      />

      {children}
    </Fragment>
  )
}

export {
  AnimatedProfileAnchor as Anchor,
  AnimatedProfile as Root,
  AnimatedProfileSidebar as Sidebar,
}
