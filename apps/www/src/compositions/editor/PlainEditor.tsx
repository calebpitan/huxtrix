'use client'

import React from 'react'

import {
  Bold,
  Code,
  Highlighter,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
} from 'lucide-react'

import { Editor } from '@/components/ui/editor'
import { FixedToolbar } from '@/components/ui/fixed-toolbar'
import { RedoToolbarButton, UndoToolbarButton } from '@/components/ui/history-toolbar-button'
import { InsertToolbarButton } from '@/components/ui/insert-toolbar-button'
import { LinkToolbarButton } from '@/components/ui/link-toolbar-button'
import { IndentToolbarButton, ListToolbarButton } from '@/components/ui/list-classic-toolbar-button'
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button'
import { Separator } from '@/components/ui/separator'
import { TurnIntoToolbarButton } from '@/components/ui/turn-into-toolbar-button'
import { cn } from '@/lib/utils'

export interface PlainEditorProps extends React.ComponentProps<typeof Editor> {
  className?: string
  placeholder?: string
}

export function PlainEditor({ placeholder, ...rest }: PlainEditorProps) {
  return <Editor placeholder={placeholder} spellCheck="false" {...rest} />
}

export function PlainEditorToolbar({
  className,
  ...rest
}: React.ComponentProps<typeof FixedToolbar>) {
  const separator = (
    <Separator orientation="vertical" className="data-[orientation=vertical]:h-1/2" />
  )

  return (
    <FixedToolbar
      className={cn(
        'justify-start border-0',
        '[&_button]:aria-checked:bg-primary/10 [&_button]:aria-checked:text-primary',
        '[&_button_>_span]:data-[state=on]:bg-primary/10 [&_button_>_span]:data-[state=on]:text-primary',
        '[&_button_>_span]:data-[state=open]:bg-primary/10 [&_button_>_span]:data-[state=open]:text-primary',
        className,
      )}
      {...rest}
    >
      <UndoToolbarButton />
      <RedoToolbarButton />

      {separator}

      <InsertToolbarButton />
      <TurnIntoToolbarButton />

      {separator}

      <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘B)">
        <Bold />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘I)">
        <Italic />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType="strikethrough" tooltip="Strikethrough (⌘⇧X)">
        <Strikethrough />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType="code" tooltip="Code (⌘E)">
        <Code />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType="subscript" tooltip="Superscript (⌘,)">
        <Subscript />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType="superscript" tooltip="Superscript (⌘.)">
        <Superscript />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType="highlight" tooltip="Highlight">
        <Highlighter />
      </MarkToolbarButton>

      {separator}

      <LinkToolbarButton />

      {separator}

      <ListToolbarButton nodeType="ul" />
      <ListToolbarButton nodeType="ol" />

      <IndentToolbarButton />
      <IndentToolbarButton reverse={true} />
    </FixedToolbar>
  )
}
