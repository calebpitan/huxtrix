'use client'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'

export function SaveDraftButton() {
  const editor = useTextEditor()

  function saveDraft() {
    editor.controller.save()
    editor.markSaved()
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="lg"
      className="h-11 rounded-full px-6 font-bold"
      onClick={saveDraft}
    >
      Save draft
    </Button>
  )
}
