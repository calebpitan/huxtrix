'use client'

import { useLayoutEffect, useRef } from 'react'

import { CreatePrimaryButton } from './create-primary-button'
import { DraftStatus } from './draft-status'
import { DraftTypeToggle } from './draft-type-toggle'
import { PreviewButton } from './preview-button'
import { SaveDraftButton } from './save-draft-button'

export function CreateHeader() {
  const headerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const node = headerRef.current
    const parent = node?.parentElement
    if (!node || !parent) return

    const apply = () => {
      parent.style.setProperty('--create-header-height', `${node.offsetHeight}px`)
    }

    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(node)

    return () => {
      observer.disconnect()
      parent.style.removeProperty('--create-header-height')
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className="bg-background sticky top-0 z-40 hidden w-full shrink-0 px-2 lg:block"
    >
      <div className="flex w-full max-w-3xl items-center gap-3 py-2">
        <DraftTypeToggle />

        <div className="ms-auto flex min-w-0 items-center justify-end gap-3">
          <DraftStatus />
          <PreviewButton />
          <SaveDraftButton />
          <CreatePrimaryButton />
        </div>
      </div>
    </header>
  )
}
