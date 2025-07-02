'use client'

import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface ElementSize {
  width: number
  height: number
  stop(): void
  refresh(): void
}

export function useElementSize(target?: RefObject<HTMLElement | null>): ElementSize {
  const observer = useRef<ResizeObserver | null>(null)
  const [size, setSize] = useState<Omit<ElementSize, 'stop' | 'refresh'>>({
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

  return useMemo(() => {
    return {
      width: size.width,
      height: size.height,
      stop: () => {
        observer.current?.disconnect()
        observer.current = null
      },
      refresh: () => updateSize(),
    }
  }, [size.height, size.width, updateSize])
}
