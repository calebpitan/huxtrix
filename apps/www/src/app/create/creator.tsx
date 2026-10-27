'use client'

import { useCallback } from 'react'

import { useTextEditor } from '@/compositions/editor'
import { ArticleEditor } from '@/compositions/editor/ArticleEditor'

export function PostCreator() {
  const editor = useTextEditor()

  const makePost = useCallback(() => {
    console.log('Making post of content: %s', editor.draftRef.current.body)
  }, [editor.draftRef])

  const saveDraft = useCallback(() => {
    console.log('Saving draft of content: %s', editor.draftRef.current.body)
  }, [editor.draftRef])

  editor.controller.handle('post', makePost)
  editor.controller.handle('save', saveDraft)

  return (
    <div style={{ height: '100%' }}>
      <ArticleEditor onChange={(value) => editor.setContent(value)} />
    </div>
  )
}
