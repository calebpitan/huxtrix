'use client'

import React from 'react'

import { Bold, Code, Highlighter, Italic, Strikethrough } from 'lucide-react'

import { Editor } from '@/components/ui/editor'
import { FixedToolbar } from '@/components/ui/fixed-toolbar'
import { RedoToolbarButton, UndoToolbarButton } from '@/components/ui/history-toolbar-button'
import { InsertToolbarButton } from '@/components/ui/insert-toolbar-classic-button'
import { LinkToolbarButton } from '@/components/ui/link-toolbar-button'
import { IndentToolbarButton, ListToolbarButton } from '@/components/ui/list-classic-toolbar-button'
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button'
import { MoreToolbarButton } from '@/components/ui/more-toolbar-button'
import { Separator } from '@/components/ui/separator'
import { TurnIntoToolbarButton } from '@/components/ui/turn-into-toolbar-classic-button'
import { cn } from '@/lib/utils'

export interface PlainEditorProps extends React.ComponentProps<typeof Editor> {
  className?: string
  placeholder?: string
}

export function PlainEditor({ placeholder, ...rest }: PlainEditorProps) {
  return <Editor placeholder={placeholder} spellCheck="false" {...rest} />
}

function ToolbarCluster({ children }: { children: React.ReactNode }) {
  return <div className="flex shrink-0 items-center gap-0.5">{children}</div>
}

export function PlainEditorToolbar({
  className,
  ...rest
}: React.ComponentProps<typeof FixedToolbar>) {
  const separator = (
    <Separator
      orientation="vertical"
      className="mx-2 data-[orientation=vertical]:h-5"
    />
  )

  return (
    <FixedToolbar
      className={cn(
        'static w-fit max-w-full min-w-0 justify-start gap-0 overflow-x-auto rounded-full border border-border bg-background px-2.5 py-1.5 shadow-none backdrop-blur-none supports-backdrop-blur:bg-background',
        '[&_button]:aria-checked:bg-primary/10 [&_button]:aria-checked:text-primary',
        '[&_button_>_span]:data-[state=on]:bg-primary/10 [&_button_>_span]:data-[state=on]:text-primary',
        '[&_button_>_span]:data-[state=open]:bg-primary/10 [&_button_>_span]:data-[state=open]:text-primary',
        className,
      )}
      {...rest}
    >
      <ToolbarCluster>
        <UndoToolbarButton size="default" />
        <RedoToolbarButton size="default" />
      </ToolbarCluster>

      {separator}

      <ToolbarCluster>
        <InsertToolbarButton />
        <TurnIntoToolbarButton />
      </ToolbarCluster>

      {separator}

      <ToolbarCluster>
        <MarkToolbarButton nodeType="bold" size="default" tooltip="Bold (⌘B)">
          <Bold />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" size="default" tooltip="Italic (⌘I)">
          <Italic />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="strikethrough" size="default" tooltip="Strikethrough (⌘⇧X)">
          <Strikethrough />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="code" size="default" tooltip="Code (⌘E)">
          <Code />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="highlight" size="default" tooltip="Highlight">
          <Highlighter />
        </MarkToolbarButton>
      </ToolbarCluster>

      {separator}

      <ToolbarCluster>
        <LinkToolbarButton size="default" />
      </ToolbarCluster>

      {separator}

      <ToolbarCluster>
        <ListToolbarButton nodeType="ul" size="default" />
        <ListToolbarButton nodeType="ol" size="default" />
        <ListToolbarButton nodeType="taskList" size="default" />
        <IndentToolbarButton reverse size="default" />
        <IndentToolbarButton size="default" />
      </ToolbarCluster>

      {separator}

      <ToolbarCluster>
        <MoreToolbarButton />
      </ToolbarCluster>
    </FixedToolbar>
  )
}
