import { useEffect, useState } from 'react'

type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpoints = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export function getMediaQueryList(breakpoint: Breakpoint): MediaQueryList {
  if (breakpoint === 'base') {
    return window.matchMedia(`(max-width: ${breakpoints.sm - 0.02}px)`)
  }
  return window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`)
}

export function getCurrentBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints['2xl']) return '2xl'
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  return 'base'
}

export function getBreakpointRange(width: number, min: Breakpoint, max: Breakpoint): boolean {
  const minWidth = breakpoints[min]
  const maxWidth = breakpoints[max]
  return width >= minWidth && width <= maxWidth
}

/**
 * A hook that returns whether the current viewport matches a given breakpoint
 * @param breakpoint - The breakpoint to check against
 * @returns boolean indicating if the viewport matches the breakpoint
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return getMediaQueryList(breakpoint).matches
  })

  useEffect(() => {
    const mediaQuery = getMediaQueryList(breakpoint)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [breakpoint])

  return matches
}

/**
 * A hook that returns the current breakpoint based on the viewport width
 * @returns The current breakpoint
 */
export function useCurrentBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'base'
    return getCurrentBreakpoint(window.innerWidth)
  })

  useEffect(() => {
    const handler = () => {
      setBreakpoint(getCurrentBreakpoint(window.innerWidth))
    }

    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return breakpoint
}

/**
 * A hook that returns whether the current viewport is within a range of breakpoints
 * @param min - The minimum breakpoint (inclusive)
 * @param max - The maximum breakpoint (inclusive)
 * @returns boolean indicating if the viewport is within the range
 */
export function useBreakpointRange(min: Breakpoint, max: Breakpoint): boolean {
  const [isInRange, setIsInRange] = useState(() => {
    if (typeof window === 'undefined') return false
    return getBreakpointRange(window.innerWidth, min, max)
  })

  useEffect(() => {
    const handler = () => {
      setIsInRange(getBreakpointRange(window.innerWidth, min, max))
    }

    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [min, max])

  return isInRange
}
