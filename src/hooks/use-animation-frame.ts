import { useCallback, useEffect, useRef, useState } from 'react'

type FrameCallback = (deltaTime: number) => void
type FrameCallbackFn = (callback: FrameCallback) => void

export function useAnimationFrame(): FrameCallbackFn
export function useAnimationFrame(callback: FrameCallback): FrameCallbackFn
export function useAnimationFrame(callback: FrameCallback | null = null): FrameCallbackFn {
  const frameId = useRef<number>(0)
  const [task, setTask] = useState<FrameCallback | null>(callback)

  useEffect(() => {
    if (!task) return
    frameId.current = requestAnimationFrame(task)
    return () => cancelAnimationFrame(frameId.current)
  }, [task])

  return useCallback((callback: FrameCallback) => setTask(callback), [])
}
