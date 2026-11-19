'use client'

import { Check, CircleDashed } from 'lucide-react'

import { useTextEditor } from '@/compositions/editor'
import { channelChoice } from '@/compositions/editor/channel-menu'
import { cn } from '@/lib/utils'

function ChecklistMark({ done }: { done: boolean }) {
  if (done) {
    return (
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-emerald-300"
        aria-hidden
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
    )
  }

  return <CircleDashed className="text-muted-foreground size-5 shrink-0" aria-hidden />
}

function tagLabel(count: number) {
  if (count === 0) return 'Tags'
  if (count === 1) return '1 tag added'
  return `${count} tags added`
}

export function PublishChecklist({ className }: { className?: string }) {
  const { draft } = useTextEditor()
  const channel = channelChoice(draft.channelId)
  const rows = [
    {
      id: 'title',
      done: draft.title.trim().length > 0 && draft.subtitle.trim().length > 0,
      label: 'Title and subtitle added',
    },
    {
      id: 'channel',
      done: channel !== undefined,
      label: channel ? `Channel: ${channel.name}` : 'Channel',
    },
    {
      id: 'tags',
      done: draft.tags.length > 0,
      label: tagLabel(draft.tags.length),
    },
    {
      id: 'cover',
      done: draft.coverUrl !== null,
      label: 'Cover image (optional)',
    },
  ]

  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <h2 className="text-sm font-semibold">Before you publish</h2>
      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-2 text-sm">
            <ChecklistMark done={row.done} />
            <span>{row.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
