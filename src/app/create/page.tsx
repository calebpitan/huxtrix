import { Metadata } from 'next'

import { TextEditorProvider } from '@/compositions/editor/TextEditorProvider'
import { PageLayout } from '@/compositions/layout'

import { CreatorMain } from './main'
import { PostCreatorSidebar } from './sidebar'

export const metadata: Metadata = {
  title: 'Create — Huxtrix',
  description: 'Get creative: share a useful hack or trick',
}

export default function CreatorPage() {
  return (
    <TextEditorProvider>
      <PageLayout>
        <div className="-mx-4 mt-8 w-full sm:-mx-8 lg:-mx-0">
          <CreatorMain />
        </div>

        <PostCreatorSidebar className="mt-8 py-1.75" />
      </PageLayout>
    </TextEditorProvider>
  )
}
