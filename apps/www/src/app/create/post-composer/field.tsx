'use client'

import { Editor, EditorContainer } from '@/components/ui/editor'
import { useTextEditor } from '@/compositions/editor'

export function PostComposerField() {
  const { state } = useTextEditor()
  const previewing = state.mode === 'preview'

  return (
    <EditorContainer className="h-auto">
      <Editor
        variant="none"
        spellCheck={false}
        placeholder={previewing ? undefined : 'Write a post'}
        className="min-h-16 px-0 py-1 text-base leading-relaxed"
      />
    </EditorContainer>
  )
}
