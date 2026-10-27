'use client'

import { useState } from 'react'

import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'

import { ConfirmPostDialog } from './confirm-post-dialog'

export function CreatePrimaryButton() {
  const router = useRouter()
  const editor = useTextEditor()
  const [postOpen, setPostOpen] = useState(false)
  const isArticle = editor.draft.type === 'article'

  if (isArticle) {
    return (
      <Button
        type="button"
        size="lg"
        className="h-11 rounded-full px-7 font-bold has-[>svg]:px-7"
        onClick={() => router.push('/create/publish')}
      >
        Next
        <ArrowRight strokeWidth={2.5} aria-hidden />
      </Button>
    )
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        className="h-11 rounded-full px-7 font-bold"
        onClick={() => setPostOpen(true)}
      >
        Post
      </Button>
      <ConfirmPostDialog open={postOpen} onOpenChange={setPostOpen} />
    </>
  )
}
