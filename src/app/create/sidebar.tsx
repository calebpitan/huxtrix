'use client'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'
import { cn } from '@/lib/utils'

export interface PostCreatorSidebarProps {
  className?: string
}

export function PostCreatorSidebar({ className }: PostCreatorSidebarProps) {
  const { controller, state, toggleMode } = useTextEditor()

  function onSaveDraft() {
    controller.save()
  }

  function onPost() {
    controller.post()
  }

  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-end gap-2">
        <Button variant="link" size="sm" onClick={toggleMode}>
          {state.mode === 'edit' ? 'Preview' : 'Edit'}
        </Button>
        <Button variant="link" size="sm" onClick={onSaveDraft}>
          Save draft
        </Button>
        <Button className="rounded-full px-5" size="sm" onClick={onPost}>
          Post
        </Button>
      </div>
    </div>
  )
}
