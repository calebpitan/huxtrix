'use client'

import { type KeyboardEvent, useRef } from 'react'

import { FileText, PenLine } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type DraftType, useTextEditor } from '@/compositions/editor'
import { cn } from '@/lib/utils'

const draftTypes: { value: DraftType; label: string; icon: typeof PenLine }[] = [
  { value: 'post', label: 'Post', icon: PenLine },
  { value: 'article', label: 'Article', icon: FileText },
]

export function DraftTypeToggle() {
  const editor = useTextEditor()
  const itemRefs = useRef<Partial<Record<DraftType, HTMLButtonElement | null>>>({})
  const { draft, state } = editor

  function selectType(type: DraftType) {
    if (type === draft.type) return
    if (type === 'post' && state.mode === 'preview') editor.toggleMode()
    editor.updateDraft({ type })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = draftTypes.findIndex((option) => option.value === draft.type)
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? draftTypes[(index + 1) % draftTypes.length]
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? draftTypes[(index - 1 + draftTypes.length) % draftTypes.length]
          : null

    if (!next) return

    event.preventDefault()
    itemRefs.current[next.value]?.focus()
    selectType(next.value)
  }

  return (
    <div
      role="radiogroup"
      aria-label="Draft type"
      className="bg-muted/40 inline-flex shrink-0 items-center border-1 rounded-full p-1"
      onKeyDown={onKeyDown}
    >
      {draftTypes.map((option) => {
        const checked = draft.type === option.value
        const Icon = option.icon

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
            size="lg"
            variant={checked ? 'default' : 'ghost'}
            className={cn('rounded-full font-bold', !checked && 'text-muted-foreground')}
            onClick={() => selectType(option.value)}
          >
            <Icon aria-hidden />
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
