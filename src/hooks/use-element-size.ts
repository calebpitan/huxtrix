'use client'

import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

export interface ElementSize {
  width: number
  height: number
  stop(): void
}

export function useElementSize(target?: RefObject<HTMLElement | null>): ElementSize {
  const observer = useRef<ResizeObserver | null>(null)
  const [size, setSize] = useState<Omit<ElementSize, 'stop'>>({
    width: 0,
    height: 0,
  })

  const updateSize = useCallback(() => {
    const el = target?.current
    if (!el) {
      setSize({ width: 0, height: 0 })
      return
    }

    const { width, height } = el.getBoundingClientRect()
    setSize({ width, height })
  }, [target])

  useEffect(() => {
    if (!target?.current) return

    updateSize()

    observer.current = new ResizeObserver(() => {
      updateSize()
    })

    observer.current.observe(target.current)

    return () => {
      observer.current?.disconnect()
      observer.current = null
    }
  }, [target, updateSize])

  return {
    ...size,
    stop: () => {
      observer.current?.disconnect()
      observer.current = null
    },
  }
}
