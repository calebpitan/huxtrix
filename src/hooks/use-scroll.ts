'use client'

import { RefObject, useEffect, useState } from 'react'

export interface UseScrollOptions {
  throttle?: number
  behavior?: ScrollBehavior
  onScroll?: (e: Event) => void
  onStop?: () => void
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
}

export function useScroll(
  target?: RefObject<HTMLElement | null> | null,
  options: UseScrollOptions = {}
): [ScrollData, (x: number, y: number) => void] {
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
  })

  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null)

  const getElement = () => {
    if (!target) return window
    return target.current || window
  }

  const updatePosition = () => {
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

    setScrollData({
      x,
      y,
      isScrolling: true,
      arrivedState: {
        top: y <= 0,
        bottom: y >= maxY,
        left: x <= 0,
        right: x >= maxX,
      },
    })
  }

  const scrollTo = (x: number, y: number) => {
    const el = getElement()
    if (el === window) {
      window.scrollTo({
        left: x + (options.offset?.x || 0),
        top: y + (options.offset?.y || 0),
        behavior: options.behavior || 'auto',
      })
    } else {
      (el as HTMLElement).scrollTo({
        left: x + (options.offset?.x || 0),
        top: y + (options.offset?.y || 0),
        behavior: options.behavior || 'auto',
      })
    }
  }

  useEffect(() => {
    const el = getElement()

    const onScrollHandler = (e: Event) => {
      if (options.throttle) {
        if (scrollTimeout) {
          return
        }
        setScrollTimeout(
          setTimeout(() => {
            updatePosition()
            options.onScroll?.(e)
            setScrollTimeout(null)
          }, options.throttle)
        )
      } else {
        updatePosition()
        options.onScroll?.(e)
      }

      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      setScrollTimeout(
        setTimeout(() => {
          setScrollData((prev) => ({ ...prev, isScrolling: false }))
          options.onStop?.()
        }, 100)
      )
    }

    updatePosition()
    el.addEventListener('scroll', onScrollHandler, { passive: true })

    return () => {
      el.removeEventListener('scroll', onScrollHandler)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [target, options.throttle])

  return [scrollData, scrollTo]
}
