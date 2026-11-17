'use client'

import { type KeyboardEvent, useRef } from 'react'

import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTextEditor } from '@/compositions/editor'
import { channelChoices } from '@/compositions/editor/channel-menu'

import { usePublishRequest } from './request'

export function PublishChannelField() {
  const { draft, updateDraft } = useTextEditor()
  const { attempted } = usePublishRequest()
  const itemRefs = useRef<Partial<Record<string, HTMLButtonElement | null>>>({})
  const missing = draft.channelId === null
  const showError = attempted && missing

  function selectChannel(id: string) {
    updateDraft({ channelId: id })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const delta =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0
    if (!delta) return

    event.preventDefault()
    const index = channelChoices.findIndex((choice) => choice.id === draft.channelId)
    const nextIndex =
      index === -1
        ? delta > 0
          ? 0
          : channelChoices.length - 1
        : (index + delta + channelChoices.length) % channelChoices.length
    const next = channelChoices[nextIndex]
    if (!next) return
    itemRefs.current[next.id]?.focus()
    selectChannel(next.id)
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold">
          Channel <span className="text-muted-foreground text-sm font-normal">Required</span>
        </h2>
        <p id="publish-channel-help" className="text-muted-foreground text-sm">
          Your article appears in this channel&apos;s feed.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Channel"
        aria-invalid={showError || undefined}
        aria-describedby={
          showError ? 'publish-channel-help publish-channel-error' : 'publish-channel-help'
        }
        className="flex flex-wrap gap-2"
        onKeyDown={onKeyDown}
      >
        {channelChoices.map((choice, index) => {
          const checked = draft.channelId === choice.id
          const tabIndex = draft.channelId === null ? (index === 0 ? 0 : -1) : checked ? 0 : -1

          return (
            <Button
              key={choice.id}
              ref={(node: HTMLButtonElement | null) => {
                itemRefs.current[choice.id] = node
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={tabIndex}
              size="lg"
              variant={checked ? 'default' : 'outline'}
              className="rounded-full font-semibold"
              onClick={() => selectChannel(choice.id)}
            >
              {checked ? <Check aria-hidden /> : null}
              {choice.name}
            </Button>
          )
        })}
      </div>

      {showError ? (
        <p id="publish-channel-error" role="alert" className="text-destructive text-sm">
          Choose a channel.
        </p>
      ) : null}
    </section>
  )
}
