'use client'

import { type KeyboardEvent, useLayoutEffect, useRef, useState } from 'react'

import { Command as CommandPrimitive } from 'cmdk'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandItem, CommandList } from '@/components/ui/command'
import { useTextEditor } from '@/compositions/editor'
import { cn } from '@/lib/utils'

import { tagSuggestions } from './tag-suggestions'

const TAG_LIMIT = 5

function sameTag(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}

export function PublishTagsField() {
  const { draft, updateDraft } = useTextEditor()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [created, setCreated] = useState<string[]>(() =>
    draft.tags.filter((tag) => !tagSuggestions.some((item) => sameTag(item, tag))),
  )
  const [overLimit, setOverLimit] = useState(false)
  const count = draft.tags.length
  const trimmed = query.trim()
  const known = [...tagSuggestions, ...created]
  const available = known.filter((tag) => !draft.tags.some((selected) => sameTag(selected, tag)))
  const matches = trimmed
    ? available.filter((tag) => tag.toLowerCase().includes(trimmed.toLowerCase()))
    : []
  const exact =
    known.some((tag) => sameTag(tag, trimmed)) || draft.tags.some((tag) => sameTag(tag, trimmed))
  const showCreate = trimmed.length > 0 && !exact
  const open = !overLimit && trimmed.length > 0 && (matches.length > 0 || showCreate)

  function addTag(raw: string) {
    const tag = raw.trim()
    if (!tag) return
    if (draft.tags.length >= TAG_LIMIT) {
      setOverLimit(true)
      setQuery('')
      return
    }

    setOverLimit(false)
    const canonical = known.find((item) => sameTag(item, tag)) ?? tag
    if (draft.tags.some((item) => sameTag(item, canonical))) {
      setQuery('')
      return
    }

    if (!known.some((item) => sameTag(item, canonical))) {
      setCreated((current) => [...current, canonical])
    }
    updateDraft({ tags: [...draft.tags, canonical] })
    setQuery('')
  }

  function removeTag(tag: string) {
    setOverLimit(false)
    updateDraft({ tags: draft.tags.filter((item) => item !== tag) })
  }

  useLayoutEffect(() => {
    inputRef.current?.setAttribute('aria-expanded', open ? 'true' : 'false')
  }, [open])

  function onQueryChange(next: string) {
    const splitAt = next.search(/\s/)
    if (splitAt === -1) {
      setQuery(next)
      return
    }

    addTag(next.slice(0, splitAt))
    setQuery(next.slice(splitAt).trim())
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== ' ') return
    event.preventDefault()
    event.stopPropagation()
    addTag(query)
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-bold">Tags</h2>
        <p className="text-muted-foreground text-sm">
          {count} of {TAG_LIMIT}
        </p>
      </div>
      <p className="text-muted-foreground text-sm">Help people find it beyond the channel.</p>

      <Command shouldFilter={false} className="relative h-auto overflow-visible bg-transparent">
        <div
          className={cn(
            'border-input relative flex min-h-11 flex-wrap items-center gap-2 rounded-full border px-2 py-1.5',
            overLimit && 'border-destructive',
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {draft.tags.map((tag) => (
            <span key={tag} className="bg-muted inline-flex items-center rounded-full ps-3 text-sm">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full"
                aria-label={`Remove ${tag}`}
                onClick={() => removeTag(tag)}
              >
                <X className="size-3" />
              </Button>
            </span>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={query}
            onValueChange={onQueryChange}
            onKeyDown={onKeyDown}
            placeholder="Add a tag"
            aria-label="Add a tag"
            role="combobox"
            aria-expanded={open}
            aria-controls="publish-tag-list"
            aria-autocomplete="list"
            aria-invalid={overLimit || undefined}
            aria-describedby={overLimit ? 'publish-tag-limit' : undefined}
            className="placeholder:text-muted-foreground min-w-28 flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        {open ? (
          <CommandList
            id="publish-tag-list"
            className="bg-popover absolute left-0 top-full z-50 mt-2 w-full rounded-md border shadow-md"
            onMouseDown={(event) => event.preventDefault()}
          >
            {matches.map((tag) => (
              <CommandItem key={tag} value={tag} onSelect={() => addTag(tag)}>
                {tag}
              </CommandItem>
            ))}
            {showCreate ? (
              <CommandItem value={trimmed} onSelect={() => addTag(trimmed)}>
                Create &quot;{trimmed}&quot;
              </CommandItem>
            ) : null}
          </CommandList>
        ) : null}
      </Command>

      {overLimit ? (
        <p id="publish-tag-limit" role="alert" className="text-destructive text-sm">
          You can add up to 5 tags.
        </p>
      ) : null}
    </section>
  )
}
