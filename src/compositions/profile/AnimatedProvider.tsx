'use client'

import { ReactNode, RefObject, createContext, useCallback, useContext, useEffect } from 'react'
import { useMemo, useRef, useState } from 'react'

import { MotionValue, motionValue, useMotionValueEvent, useScroll } from 'motion/react'
import { easeOut, useTransform } from 'motion/react'

import { Profile } from '@/compositions/types'
import { useAnimationFrame } from '@/hooks/use-animation-frame'
import { useElementBounding } from '@/hooks/use-element-bounding'
import { createDomRect, scroll } from '@/lib/utils'

type InitialSizes = { container: DOMRect; header: DOMRect; anchor: DOMRect; sidebar: DOMRect }

type AnimatedProfileMotion = {
  /**
   * The realtive displacement along the x-axis between the header's start position
   * and it's end position.
   */
  x: MotionValue<number>
  /**
   * The realtive displacement along the y-axis between the header's start position
   * and it's end position.
   */
  y: MotionValue<number>
  /**
   * An indicator of whether an animation is progressing or has ended.
   * `0` for no animation or dead signal and `1` for when animating or
   * live signal.
   */
  signal: MotionValue<number>
  /**
   * The header's absolute x and y displacement, that is, with scroll-x factored into x and
   * scroll-y factored into y
   */
  header: { x: MotionValue<number>; y: MotionValue<number> }
  /**
   * The anchor's absolute x and y displacement, that is, with scroll-x factored into x and
   * scroll-y factored into y
   */
  anchor: { x: MotionValue<number>; y: MotionValue<number> }
  /**
   * The scroll displacements along x and y as scroll-x and scroll-y respectively.
   * Also includes the:
   * 1. bounded scroll-y which is mostly in sync (tracked) with
   * scroll-y when the signal is alive and out of sync (not tracked) with scroll-y
   * when the signal is dead.
   * 2. progress which tracks how much the scroll animation has come to reaching its
   * destination.
   * 3. scroll direction that indicates what direction along the y-axis the scroll is
   * occuring in.
   */
  scroll: {
    x: MotionValue<number>
    y: MotionValue<number>
    bounded: MotionValue<number>
    progress: MotionValue<number>
    direction: 'down' | 'up'
  }
}

type UseAnimatedProfileMotionParams = {
  x: MotionValue<number>
  y: MotionValue<number>
  boundedScrollY: MotionValue<number>
  scrollY: MotionValue<number>
  scrollYProgress: MotionValue<number>
  scrollDirection: 'down' | 'up'
  signal: MotionValue<number>
}

interface AnimatedProfileContextType {
  profile: Profile | null | undefined
  initialSizes: InitialSizes
  mode: 'primary' | 'alternate'
  motion: AnimatedProfileMotion
  updateProfile: (profile: Profile) => void
  updateRefs: (refs: Partial<AnimatedProfileRefs>) => void
}

export type AnimatedProfileRefs = {
  root: RefObject<HTMLDivElement | null>
  header: RefObject<HTMLDivElement | null>
  anchor: RefObject<HTMLDivElement | null>
  sidebar: RefObject<HTMLDivElement | null>
}

export interface AnimatedProfileProviderProps extends Pick<AnimatedProfileContextType, 'profile'> {
  children: ReactNode
}

const meter = (x: number) => Math.ceil(x % 1)

export const AnimatedProfileContext = createContext<AnimatedProfileContextType>({
  profile: null,
  mode: 'primary',
  motion: {
    x: motionValue(0),
    y: motionValue(0),
    signal: motionValue(0),
    header: { x: motionValue(0), y: motionValue(0) },
    anchor: { x: motionValue(0), y: motionValue(0) },
    scroll: {
      x: motionValue(0),
      y: motionValue(0),
      bounded: motionValue(0),
      direction: 'down',
      progress: motionValue(0),
    },
  },
  updateProfile: () => {},
  updateRefs: () => {},
  initialSizes: {
    container: createDomRect(),
    header: createDomRect(),
    anchor: createDomRect(),
    sidebar: createDomRect(),
  },
})

export const useAnimatedProfile = () => {
  const context = useContext(AnimatedProfileContext)

  if (!context) {
    throw new Error('useAnimatedProfile must be used within an AnimatedProfileProvider')
  }

  return context
}

export const useAnimatedProfileMotion = (params: UseAnimatedProfileMotionParams) => {
  const { x, y, boundedScrollY, scrollY, scrollYProgress, scrollDirection, signal } = params
  const headerY = useTransform(() => boundedScrollY.get() + y.get())
  const anchorY = useTransform(() => signal.get() * (y.get() ? boundedScrollY.get() - y.get() : 0))

  return useMemo<AnimatedProfileMotion>(
    () => ({
      x,
      y,
      signal,
      header: {
        // We ignore factoring scroll-x into the header's x-axis motion since we don't expect the
        // container to move horizontally.
        x,
        // We factor scroll-y into the header's y-axis motion since we expect the container to move
        // vertically at the same time.
        y: headerY,
      },
      anchor: {
        x: motionValue(0),
        // If there's no displacement along the y-axis between the header's start and end position in
        // the animation, we don't want to animate or "parallax" the anchor's y-axis
        y: anchorY,
      },
      scroll: {
        x: motionValue(0),
        y: scrollY,
        bounded: boundedScrollY,
        direction: scrollDirection,
        progress: scrollYProgress,
      },
    }),
    [x, y, signal, headerY, anchorY, scrollY, boundedScrollY, scrollDirection, scrollYProgress],
  )
}

export const AnimatedProfileProvider = ({
  children,
  profile: defaultProfile,
}: AnimatedProfileProviderProps) => {
  const [profile, setProfile] = useState<Profile | null | undefined>(() => defaultProfile)
  const [refs, setRefs] = useState<Partial<AnimatedProfileRefs>>({})

  const [mode, setMode] = useState<'primary' | 'alternate'>('primary')
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down')
  const [initialSizes, setInitialSizes] = useState<InitialSizes>({
    container: createDomRect(),
    header: createDomRect(),
    anchor: createDomRect(),
    sidebar: createDomRect(),
  })

  const animationTimeout = useRef<NodeJS.Timeout>(null)
  const anchorSize = useElementBounding(refs.anchor)
  const schedule = useAnimationFrame()

  const deltaX = initialSizes.sidebar.left - initialSizes.header.left
  const deltaY =
    // sidebar doesn't need relative resolution to the container since it's sticky positioned and
    // not affected by scroll-y.
    //
    // This relative resolution is used to make sure we get the absolute position of the header;
    // useful when the page is loaded with an initial scroll-y greater than 0.
    initialSizes.sidebar.top - Math.abs(initialSizes.container.top - initialSizes.header.top)

  const { scrollY, scrollYProgress } = useScroll({
    target: refs.root,
    offset: ['start start', 'end start'],
    layoutEffect: true,
  })
  // Movement of the header along the x-axis in isolation of scroll, that is, without accounting for scroll-x motion
  // This is actually the animation between the header current position and it's destination position in the sidebar
  const x = useTransform(scrollYProgress, [0, 0.03125, 1], [0, deltaX / 32, deltaX], {
    ease: easeOut,
  })
  // Movement of the header along the y-axis in isolation of scroll, that is, without accounting for scroll-y motion
  // This is actually the animation between the header current position and it's destination position in the sidebar
  const y = useTransform(scrollYProgress, [0, 0.125, 1], [0, deltaY / 8, deltaY], {
    ease: easeOut,
  })

  // If the progress is between 0 and 1, ceil it up to 1 otherwise it will be 0
  // Assumes that a progress of 0 and 1 mean no signal and end of signal respectively while a
  // progress between 0 and 1 means a signal is being transmitted.
  // This represents the signal state using a binary output of 0 for no signal and 1 for signal
  const signal = useTransform(() => meter(scrollYProgress.get()))
  const boundedScrollY = useRef<MotionValue<number>>(scrollY)

  // Tracks scroll-y for as long as there's a signal, since original scroll-y isn't clamped.
  // This keeps a ref that is kept within the bounds of the signal
  // If facing any issues with header going out of bounds try creating a new motion value from scroll-y
  boundedScrollY.current = signal.get() === 1 ? scrollY : boundedScrollY.current

  const motion: AnimatedProfileMotion = useAnimatedProfileMotion({
    x,
    y,
    boundedScrollY: boundedScrollY.current,
    scrollDirection,
    scrollY,
    scrollYProgress,
    signal,
  })

  const handleScrollYProgressChange = useCallback(
    (value: number) => {
      const timeout = motion.scroll.direction === 'down' ? 300 : 500

      if (animationTimeout.current !== null) {
        clearTimeout(animationTimeout.current)
      }

      if (value < 1 && value > 0.9 && motion.scroll.direction === 'up' && mode === 'alternate') {
        return setMode('primary')
      }

      animationTimeout.current = setTimeout(() => {
        const threshold = motion.scroll.direction === 'down' ? 0.3 : 0.55

        if (value < threshold) {
          setMode('primary')
          schedule(() => scroll(0, 0))
        }

        if (value >= threshold) {
          setMode('alternate')
          schedule(() => {
            const anchorY = anchorSize.top
            const currentY = motion.scroll.y.get()

            scroll(0, value < 1 ? currentY + anchorY - motion.anchor.y.get() : currentY)
          })
        }
      }, timeout)
    },
    [anchorSize.top, mode, motion.anchor.y, motion.scroll.direction, motion.scroll.y, schedule],
  )

  const updateProfile = useCallback((profile: Profile) => {
    setProfile((prev) => ({ ...prev, ...profile }))
  }, [])

  const updateRefs = useCallback((refs: Partial<AnimatedProfileRefs>) => {
    setRefs((prev) => ({ ...prev, ...refs }))
  }, [])

  const contextValue = useMemo(() => {
    return {
      mode,
      profile,
      updateRefs,
      initialSizes,
      updateProfile,
      motion,
    }
  }, [initialSizes, mode, motion, profile, updateProfile, updateRefs])

  // This changes less frequently as it only jumps from 0 to 1 to 0, discretely.
  // Updates the latest scroll-y at the point of begin and end of signal stream,
  // which is 1 and 0 respectively
  useMotionValueEvent(signal, 'change', () => {
    boundedScrollY.current = scrollY
  })
  useMotionValueEvent(scrollY, 'change', (current) => {
    const diff = current - (scrollY.getPrevious() ?? 0)
    setScrollDirection(diff > 0 ? 'down' : 'up')
  })
  useMotionValueEvent(scrollYProgress, 'change', handleScrollYProgressChange)

  useEffect(() => {
    const { header, sidebar, anchor } = refs
    if (!header?.current || !sidebar?.current || !anchor?.current) return

    const sizes: typeof initialSizes = {
      // the scroll container
      container: document.documentElement.getBoundingClientRect(),
      header: header.current.getBoundingClientRect(),
      anchor: anchor.current.getBoundingClientRect(),
      sidebar: sidebar.current.getBoundingClientRect(),
    }

    setInitialSizes(sizes)
  }, [refs])

  return (
    <AnimatedProfileContext.Provider value={contextValue}>
      {children}
    </AnimatedProfileContext.Provider>
  )
}
