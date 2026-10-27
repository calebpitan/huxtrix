'use client'

import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'

export function PreviewButton() {
  const editor = useTextEditor()

  if (editor.draft.type !== 'article') return null

  const previewing = editor.state.mode === 'preview'

  return (
    <Button
      type="button"
      variant="ghost"
      size="lg"
      className="h-11 rounded-full px-6 font-bold has-[>svg]:px-5"
      onClick={editor.toggleMode}
    >
      {previewing ? null : <Eye aria-hidden />}
      {previewing ? 'Edit' : 'Preview'}
    </Button>
  )
}
