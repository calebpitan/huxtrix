import { RefCallback, RefObject } from 'react'

type ReactRef<T> = RefCallback<T> | RefObject<T | null>

/**
 * Combines multiple React refs into a single ref callback.
 * Useful when you need to pass a ref to multiple components/elements.
 */
export function useForkRef<T>(...refs: (ReactRef<T> | null | undefined)[]) {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return

      // Handle callback refs
      if (typeof ref === 'function') {
        ref(instance)
        return
      }

      // Handle object refs
      if ('current' in ref) {
        ref.current = instance
      }
    })
  }
}
