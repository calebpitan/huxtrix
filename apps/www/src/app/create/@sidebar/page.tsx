'use client'

import { useTextEditor } from '@/compositions/editor'

import { ArticleContextPanel } from '../article-context/panel'
import { PostContextPanel } from '../post-context/panel'

export default function PostCreatorSidebar() {
  const { draft } = useTextEditor()
  if (draft.type === 'article') return <ArticleContextPanel />
  if (draft.type === 'post') return <PostContextPanel />
  return null
}
