'use client'

import { CreatePrimaryButton } from './create-primary-button'
import { DraftStatus } from './draft-status'
import { DraftTypeToggle } from './draft-type-toggle'
import { PreviewButton } from './preview-button'
import { SaveDraftButton } from './save-draft-button'

export function CreateHeader() {
  return (
    <header className="hidden w-full shrink-0 px-2 lg:block">
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
