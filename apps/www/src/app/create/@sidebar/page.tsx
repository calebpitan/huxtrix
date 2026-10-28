'use client'

import { useTextEditor } from '@/compositions/editor'

import { ArticleContextPanel } from '../article-context/panel'

export default function PostCreatorSidebar() {
  const { draft } = useTextEditor()
  if (draft.type !== 'article') return null
  return <ArticleContextPanel />
}
