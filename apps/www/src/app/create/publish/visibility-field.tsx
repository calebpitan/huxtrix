'use client'

import { type KeyboardEvent, useRef } from 'react'

import { Globe } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type DraftVisibility, useTextEditor } from '@/compositions/editor'
import { cn } from '@/lib/utils'

import { PublishOptionRow } from './option-row'

const options: { value: DraftVisibility; label: string }[] = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'channel', label: 'Channel members' },
]

export function PublishVisibilityField() {
  const { draft, updateDraft } = useTextEditor()
  const itemRefs = useRef<Partial<Record<DraftVisibility, HTMLButtonElement | null>>>({})

  function selectVisibility(visibility: DraftVisibility) {
    if (visibility === draft.visibility) return
    updateDraft({ visibility })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = options.findIndex((option) => option.value === draft.visibility)
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? options[(index + 1) % options.length]
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? options[(index - 1 + options.length) % options.length]
          : null

    if (!next) return

    event.preventDefault()
    itemRefs.current[next.value]?.focus()
    selectVisibility(next.value)
  }

  return (
    <PublishOptionRow icon={Globe} title="Visibility" description="Who can read this article">
      <div
        role="radiogroup"
        aria-label="Visibility"
        className="bg-muted/70 inline-flex shrink-0 items-center rounded-full p-1"
        onKeyDown={onKeyDown}
      >
        {options.map((option) => {
          const checked = draft.visibility === option.value

          return (
            <Button
              key={option.value}
              ref={(node: HTMLButtonElement | null) => {
                itemRefs.current[option.value] = node
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              size="sm"
              variant={checked ? 'default' : 'ghost'}
              className={cn('rounded-full font-semibold', !checked && 'text-muted-foreground')}
              onClick={() => selectVisibility(option.value)}
            >
              {option.label}
            </Button>
          )
        })}
      </div>
    </PublishOptionRow>
  )
}
