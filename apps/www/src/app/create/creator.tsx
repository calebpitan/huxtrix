'use client'

import { useCallback } from 'react'

import { useTextEditor } from '@/compositions/editor'
import { ArticleEditor } from '@/compositions/editor/ArticleEditor'

import { CreateHeader } from './create-header'

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
    <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col">
      <CreateHeader />
      <div className="min-h-0 flex-1">
        <ArticleEditor onChange={(value) => editor.setContent(value)} />
      </div>
    </div>
  )
}
