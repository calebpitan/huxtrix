'use client'

import { useLinkToolbarButton, useLinkToolbarButtonState } from '@platejs/link/react'

import { Code, Link } from 'lucide-react'
import { KEYS } from 'platejs'
import { useMarkToolbarButton, useMarkToolbarButtonState } from 'platejs/react'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'
import { cn } from '@/lib/utils'

import { PostImageButton } from './image-button'

export function PostComposerActions() {
  const { state } = useTextEditor()
  if (state.mode === 'preview') return null

  return (
    <div className="flex items-center">
      <PostImageButton />
      <PostCodeButton />
      <PostLinkButton />
    </div>
  )
}

function PostCodeButton() {
  const state = useMarkToolbarButtonState({ nodeType: KEYS.code })
  const { props: buttonProps } = useMarkToolbarButton(state)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('rounded-full', buttonProps.pressed && 'bg-accent')}
      aria-label="Code"
      aria-pressed={buttonProps.pressed}
      onMouseDown={buttonProps.onMouseDown}
      onClick={buttonProps.onClick}
    >
      <Code />
    </Button>
  )
}

function PostLinkButton() {
  const state = useLinkToolbarButtonState()
  const { props: buttonProps } = useLinkToolbarButton(state)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('rounded-full', buttonProps.pressed && 'bg-accent')}
      aria-label="Link"
      aria-pressed={buttonProps.pressed}
      onMouseDown={buttonProps.onMouseDown}
      onClick={buttonProps.onClick}
    >
      <Link />
    </Button>
  )
}
