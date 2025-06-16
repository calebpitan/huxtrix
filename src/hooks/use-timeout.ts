import React from 'react'

import { isFn } from '@/lib/utils'

type TimeoutCallback = (deltaTime?: number) => void
type TimeoutCallbackFn = (callback: TimeoutCallback) => void

export function useTimeout(): TimeoutCallbackFn
export function useTimeout(interval: number): TimeoutCallbackFn
export function useTimeout(callback: TimeoutCallback, interval: number): TimeoutCallbackFn
export function useTimeout(
  callbackOrInterval: TimeoutCallback | number | null = null,
  interval?: number,
): TimeoutCallbackFn {
  const id = React.useRef<NodeJS.Timeout>(null)
  const callback = isFn(callbackOrInterval) ? callbackOrInterval : null
  const timeout = typeof callbackOrInterval === 'number' ? callbackOrInterval : interval
  const [task, setTask] = React.useState<Record<'fn', TimeoutCallback | null>>({ fn: callback })

  React.useEffect(() => {
    const fn = task.fn
    if (!fn) return
    id.current = setTimeout(() => fn(timeout), timeout)
    return () => {
      void (id.current !== null && clearTimeout(id.current))
    }
  }, [task, timeout])

  return React.useCallback((callback: TimeoutCallback) => setTask({ fn: callback }), [])
}
