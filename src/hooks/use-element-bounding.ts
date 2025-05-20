'use client'

import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

export interface ElementBounding {
  x: number
  y: number
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
  stop(): void
}

export function useElementBounding(target?: RefObject<HTMLElement | null>): ElementBounding {
  const observer = useRef<ResizeObserver | null>(null)
  const [bounding, setBounding] = useState<Omit<ElementBounding, 'stop'>>({
    x: 0,
    y: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
  })

  const updateBounding = useCallback(() => {
    const el = target?.current
    if (!el) {
      setBounding({
        x: 0,
        y: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: 0,
        height: 0,
      })
      return
    }

    const rect = el.getBoundingClientRect()
    setBounding({
      x: rect.x,
      y: rect.y,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
  }, [target])

  useEffect(() => {
    if (!target?.current) return

    updateBounding()

    // Update on resize
    observer.current = new ResizeObserver(() => {
      updateBounding()
    })
    observer.current.observe(target.current)

    // Update on scroll
    window.addEventListener('scroll', updateBounding, { passive: true })
    
    // Update on resize
    window.addEventListener('resize', updateBounding, { passive: true })

    return () => {
      observer.current?.disconnect()
      observer.current = null
      window.removeEventListener('scroll', updateBounding)
      window.removeEventListener('resize', updateBounding)
    }
  }, [target, updateBounding])

  return {
    ...bounding,
    stop: () => {
      observer.current?.disconnect()
      observer.current = null
      window.removeEventListener('scroll', updateBounding)
      window.removeEventListener('resize', updateBounding)
    },
  }
}
