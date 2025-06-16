'use client'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'

export default function PostCreatorSidebar() {
  const { controller, state, toggleMode } = useTextEditor()

  function onSaveDraft() {
    controller.save()
  }

  function onPost() {
    controller.post()
  }

  return (
    <div className="sticky top-0 py-1">
      <div className="flex items-center justify-end gap-2">
        <Button variant="link" size="sm" onClick={toggleMode}>
          {state.mode === 'edit' ? 'Preview' : 'Edit'}
        </Button>
        <Button variant="link" size="sm" onClick={onSaveDraft}>
          Save draft
        </Button>
        <Button className="rounded-full px-5" size="sm" onClick={onPost}>
          Next
        </Button>
      </div>
    </div>
  )
}
