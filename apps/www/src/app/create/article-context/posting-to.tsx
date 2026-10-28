'use client'

import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ChannelMenu, channelChoice } from '@/compositions/editor/channel-menu'
import { useTextEditor } from '@/compositions/editor'

export function PostingTo() {
  const { draft } = useTextEditor()
  const selected = channelChoice(draft.channelId)
  const Icon = selected?.icon
  const members = selected && selected.id !== 'Maths & Science' ? selected.members : undefined

  return (
    <section className="flex flex-col gap-4 py-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Posting to</h2>
        <ChannelMenu align="end">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto px-0 text-sm font-medium text-cyan-600 dark:text-cyan-300"
          >
            Change
          </Button>
        </ChannelMenu>
      </div>

      {selected ? (
        <div className="flex items-center gap-3">
          <span className="bg-foreground/10 flex size-12 shrink-0 items-center justify-center rounded-full">
            {Icon ? <Icon className="size-4" aria-hidden /> : null}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{selected.name}</span>
            {members ? (
              <span className="text-muted-foreground block text-xs">{members}</span>
            ) : null}
          </span>
          <span className="border-primary-foreground text-primary inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border bg-transparent px-3 text-sm font-medium">
            <Check className="size-4 text-emerald-400" aria-hidden />
            Joined
          </span>
        </div>
      ) : null}
    </section>
  )
}
