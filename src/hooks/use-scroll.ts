'use client'

import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

type ScrollFn = (x: number, y: number) => void

export interface UseScrollOptions {
  throttle?: number
  behavior?: ScrollBehavior
  onScroll?: (e: Event) => void
  onStop?: (scrollData: ScrollData) => void
  offset?: {
    x?: number
    y?: number
  }
}

export interface ScrollData {
  x: number
  y: number
  isScrolling: boolean
  arrivedState: {
    top: boolean
    bottom: boolean
    left: boolean
    right: boolean
  }
  directions: {
    top: boolean
    bottom: boolean
    left: boolean
    right: boolean
  }
}

export function useScroll(
  target?: RefObject<HTMLElement | null> | null,
  options: UseScrollOptions = {},
): [ScrollData, ScrollFn] {
  const [scrollData, setScrollData] = useState<ScrollData>({
    x: 0,
    y: 0,
    isScrolling: false,
    arrivedState: {
      top: true,
      bottom: false,
      left: true,
      right: false,
    },
    directions: {
      top: false,
      bottom: false,
      left: false,
      right: false,
    },
  })

  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null)

  const prevPositionTimeout = useRef<NodeJS.Timeout | null>(null)
  const stopTimeout = useRef<NodeJS.Timeout | null>(null)
  const frameId = useRef<number | null>(null)
  const prevPosition = useRef({ x: 0, y: 0 })

  const getElement = useCallback(() => {
    if (!target) return window
    return target.current || window
  }, [target])

  const updatePosition = useCallback(
    ({ isScrolling = false }: Partial<Pick<ScrollData, 'isScrolling'>>) => {
      const el = getElement()
      const isWindow = el === window

      const x = isWindow ? window.scrollX : (el as HTMLElement).scrollLeft
      const y = isWindow ? window.scrollY : (el as HTMLElement).scrollTop

      const maxX = isWindow
        ? document.documentElement.scrollWidth - window.innerWidth
        : (el as HTMLElement).scrollWidth - (el as HTMLElement).clientWidth

      const maxY = isWindow
        ? document.documentElement.scrollHeight - window.innerHeight
        : (el as HTMLElement).scrollHeight - (el as HTMLElement).clientHeight

      setScrollData((prev) => {
        if (prevPositionTimeout.current !== null) clearTimeout(prevPositionTimeout.current)
        prevPositionTimeout.current = setTimeout(() => {
          prevPosition.current = { x: prev.x, y: prev.y }
        }, options.throttle ?? 0)

        return {
          x,
          y,
          isScrolling,
          arrivedState: {
            top: y <= 0,
            bottom: y >= maxY,
            left: x <= 0,
            right: x >= maxX,
          },
          directions: {
            top: y < prevPosition.current.y,
            bottom: y > prevPosition.current.y,
            left: x < prevPosition.current.x,
            right: x > prevPosition.current.x,
          },
        }
      })
    },
    [getElement, options.throttle],
  )

  const scrollTo = (x: number, y: number) => {
    const el = getElement()
    if (el === window) {
      window.scrollTo({
        left: x + (options.offset?.x || 0),
        top: y + (options.offset?.y || 0),
        behavior: options.behavior || 'auto',
      })
    } else {
      ;(el as HTMLElement).scrollTo({
        left: x + (options.offset?.x || 0),
        top: y + (options.offset?.y || 0),
        behavior: options.behavior || 'auto',
      })
    }
  }

  useEffect(() => {
    const el = getElement()

    const onScrollHandler = (e: Event) => {
      // Cancel any existing animation frame
      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current)
        frameId.current = null
      }

      if (stopTimeout.current !== null) {
        clearTimeout(stopTimeout.current)
        stopTimeout.current = null
      }

      // Schedule new update on next animation frame
      frameId.current = requestAnimationFrame(() => {
        if (options.throttle) {
          if (scrollTimeout) return // throttled
          setScrollTimeout(
            setTimeout(() => {
              updatePosition({ isScrolling: true })
              options.onScroll?.(e)
              setScrollTimeout(null)
            }, options.throttle),
          )
        } else {
          updatePosition({ isScrolling: true })
          options.onScroll?.(e)
        }

        stopTimeout.current = setTimeout(() => {
          setScrollData((prev) => {
            const next = { ...prev, isScrolling: false }
            options.onStop?.(next)
            return next
          })
        }, options.throttle ?? 100)
      })
    }

    updatePosition({ isScrolling: false })
    el.addEventListener('wheel', onScrollHandler, { passive: true })

    return () => {
      el.removeEventListener('wheel', onScrollHandler)
      if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout)
      }
      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current)
      }
    }
  }, [
    target,
    options.throttle,
    options.onStop,
    options.onScroll,
    updatePosition,
    getElement,
    scrollTimeout,
    options,
  ])

  return [scrollData, scrollTo]
}
