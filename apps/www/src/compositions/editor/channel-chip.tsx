'use client'

import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ChannelMenu, channelChoice } from './channel-menu'
import { useTextEditor } from './TextEditorProvider'

export function ChannelChip() {
  const { draft } = useTextEditor()
  const selected = channelChoice(draft.channelId)
  const SelectedIcon = selected?.icon

  return (
    <ChannelMenu>
      {(open) => (
        <Button
          variant="outline"
          size="lg"
          className="rounded-full bg-transparent shadow-none dark:bg-transparent"
          aria-expanded={open}
          role="combobox"
        >
          {SelectedIcon ? <SelectedIcon /> : null}
          {selected ? selected.name : draft.channelId ?? 'Choose a channel'}
          <ChevronDown />
        </Button>
      )}
    </ChannelMenu>
  )
}
