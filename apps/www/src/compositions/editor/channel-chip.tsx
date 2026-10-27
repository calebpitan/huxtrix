'use client'

import { useMemo, useState } from 'react'

import {
  Check,
  ChevronDown,
  FlaskConical,
  Hammer,
  House,
  Laptop,
  type LucideIcon,
  Sprout,
  Utensils,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { useTextEditor } from './TextEditorProvider'

interface ChannelChoice {
  id: string
  name: string
  icon: LucideIcon
  members?: string
}

const FREQUENT_LIMIT = 20

// Display strings copied from the home categories. This list is not a channel catalog.
const channelChoices: ChannelChoice[] = [
  { id: 'Tech', name: 'Tech', icon: Laptop, members: '289k members' },
  { id: 'Food', name: 'Food', icon: Utensils, members: '142k members' },
  { id: 'DIY', name: 'DIY', icon: Hammer, members: '96k members' },
  { id: 'Productivity', name: 'Productivity', icon: Zap, members: '210k members' },
  { id: 'Home', name: 'Home', icon: House, members: '74k members' },
  { id: 'Life', name: 'Life', icon: Sprout, members: '188k members' },
  { id: 'Maths & Science', name: 'Maths & Science', icon: FlaskConical, members: '115k members' },
]

export function ChannelChip() {
  const { draft, updateDraft } = useTextEditor()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selected = channelChoices.find((choice) => choice.id === draft.channelId)
  const SelectedIcon = selected?.icon

  const items = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return channelChoices.slice(0, FREQUENT_LIMIT)
    return channelChoices.filter((choice) => choice.name.toLowerCase().includes(query))
  }, [search])

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setSearch('')
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <Command className="bg-transparent" shouldFilter={false}>
          <CommandInput value={search} onValueChange={setSearch} placeholder="Search channels" />
          <CommandEmpty>No channel found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {items.map((choice) => {
                const Icon = choice.icon

                return (
                  <CommandItem
                    key={choice.id}
                    value={choice.id}
                    className="supports-[backdrop-filter]:data-[selected=true]:bg-primary/20"
                    onSelect={() => {
                      updateDraft({ channelId: choice.id })
                      onOpenChange(false)
                    }}
                  >
                    <Icon />
                    <span className="flex min-w-0 flex-1 flex-col items-start">
                      <span>{choice.name}</span>
                      {choice.members ? (
                        <span className="text-muted-foreground text-xs">{choice.members}</span>
                      ) : null}
                    </span>
                    <Check
                      className={cn(
                        'ml-auto',
                        choice.id === draft.channelId ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
