'use client'

import { RefObject, useCallback, useEffect, useRef } from 'react'

import { isFn } from '@/lib/utils'

type Target = Window | Document | HTMLElement | EventTarget | null | undefined

export interface UseEventListenerOptions {
  capture?: boolean
  passive?: boolean
  once?: boolean
}

export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  listener: (event: WindowEventMap[K]) => void,
  target?: Window,
  options?: UseEventListenerOptions,
): void
export function useEventListener<K extends keyof DocumentEventMap>(
  event: K,
  listener: (event: DocumentEventMap[K]) => void,
  target: Document,
  options?: UseEventListenerOptions,
): void
export function useEventListener<K extends keyof HTMLElementEventMap>(
  event: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  target: RefObject<HTMLElement> | HTMLElement,
  options?: UseEventListenerOptions,
): void
export function useEventListener(
  event: string,
  listener: EventListenerOrEventListenerObject,
  target?: Target | RefObject<HTMLElement>,
  options?: UseEventListenerOptions,
) {
  const resolveListener = useCallback((l: typeof listener) => (isFn(l) ? l : l.handleEvent), [])
  const savedListener = useRef(resolveListener(listener))

  useEffect(() => {
    savedListener.current = resolveListener(listener)
  }, [listener, resolveListener])

  useEffect(() => {
    const targetElement = target && 'current' in target ? target.current : target || window

    if (!targetElement?.addEventListener) return

    const eventListener: typeof listener = (event) => savedListener.current(event)

    targetElement.addEventListener(event, eventListener, {
      capture: options?.capture,
      passive: options?.passive,
      once: options?.once,
    })

    return () => {
      targetElement.removeEventListener(event, eventListener, {
        capture: options?.capture,
      })
    }
  }, [event, target, options?.capture, options?.passive, options?.once])
}
