'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'

export function PublishPreviewButton() {
  const router = useRouter()
  const { state, toggleMode } = useTextEditor()

  function preview() {
    if (state.mode !== 'preview') toggleMode()
    router.push('/create')
  }

  return (
    <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={preview}>
      Preview
    </Button>
  )
}
