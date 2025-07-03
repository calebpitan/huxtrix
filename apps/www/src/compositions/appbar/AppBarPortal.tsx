'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

import { createPortal } from 'react-dom'

import type { AppBarSlotKey } from './AppBarSlot'

export type AppBarPortalProps = {
  children: ReactNode
  slots: AppBarSlotKey | AppBarSlotKey[]
}

export function AppBarPortal(props: AppBarPortalProps) {
  const [mounted, setMounted] = useState(false)
  const container = useRef<Element[]>([])

  useEffect(() => {
    if (Array.isArray(props.slots)) {
      container.current = props.slots
        .map((s) => document.querySelector(`#${s}`))
        .filter((el) => el !== null)
    } else {
      const element = document.querySelector(`#${props.slots}`)
      container.current = element ? [element] : container.current
    }
    setMounted(true)
  }, [props.slots])

  return mounted ? container.current.map((node) => createPortal(props.children, node)) : null
}
