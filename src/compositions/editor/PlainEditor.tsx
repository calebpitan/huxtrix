'use client'

import React from 'react'

import isHotkey from 'is-hotkey'
import { ChevronDown, Pilcrow } from 'lucide-react'
import { Editable, useSlate } from 'slate-react'

import * as AppDialog from '@/components/dialog/app-dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useCurrentBreakpoint } from '@/hooks/use-breakpoint'
import { useTimeout } from '@/hooks/use-timeout'
import { cn } from '@/lib/utils'

import * as cmd from './plain/commands'
import { CustomEditor, CustomElement, FormattedText } from './plain/customization'
import { Hotkeys } from './plain/hotkeys'
import { Element, Leaf } from './plain/rendering'

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: FormattedText
  }
}

export interface PlainEditorProps extends React.ComponentProps<'div'> {
  className?: string
  placeholder?: string
  TextAreaProps?: Omit<React.ComponentProps<'div'>, 'value' | 'onScroll' | 'placeholder'>
}

function cloneIcon(icon: React.JSX.Element) {
  return React.cloneElement(icon, { className: 'size-5', 'aria-hidden': true })
}

function createHotkeyHandler(editor: CustomEditor, hotkeys: Hotkeys) {
  const keys = Object.keys(hotkeys)
  return function hotkeyHandler(event: React.KeyboardEvent) {
    const key = keys.find((k) => isHotkey(k, event)) as keyof Hotkeys

    if (!key) return

    const hotkey = hotkeys[key]

    return void (hotkey.enabled && hotkey.action(editor, event.nativeEvent))
  }
}

export function PlainEditor({
  className,
  placeholder,
  TextAreaProps,
  ref,
  ...props
}: PlainEditorProps) {
  const editor = useSlate()

  const handleKeyDown = React.useMemo(() => createHotkeyHandler(editor, Hotkeys), [editor])
  const handleFocus = React.useCallback(() => {
    CustomEditor.focus(editor)
  }, [editor])

  React.useLayoutEffect(() => {
    CustomEditor.focus(editor)
  }, [editor])

  return (
    <div
      data-component="plain-editor"
      className={cn('min-h-50 py-2', className)}
      tabIndex={0}
      onClick={handleFocus}
      onFocus={handleFocus}
      {...props}
    >
      <Editable
        ref={ref}
        placeholder={placeholder}
        className="max-w-none focus:outline-none"
        onKeyDownCapture={handleKeyDown}
        renderLeaf={Leaf}
        renderElement={Element}
        autoFocus={true}
        spellCheck="false"
        {...TextAreaProps}
      />
    </div>
  )
}

export interface PlainEditorToolbarProps extends React.ComponentProps<'div'> {
  commands: Array<cmd.CommandItems>
}

export function PlainEditorToolbar({ className, commands, ...rest }: PlainEditorToolbarProps) {
  const editor = useSlate()

  const handleFocus = React.useCallback(() => {
    CustomEditor.restoreCursor(editor)
  }, [editor])

  return (
    <div
      data-component="plain-editor-toolbar"
      className={cn('no-scrollbar flex h-10 overflow-x-auto overflow-y-hidden py-0', className)}
      {...rest}
    >
      <div
        role="group"
        className="no-scrollbar fade-x-5% flex h-full min-w-0 items-center gap-1 overflow-x-auto overflow-y-hidden px-4"
      >
        {commands.map((item, i) => {
          if (cmd.isCommandDivider(item))
            return (
              <Separator
                key={i}
                orientation="vertical"
                className="data-[orientation=vertical]:h-1/2"
              />
            )

          if (cmd.isCommand(item))
            return <CommandButton key={i} command={item} editor={editor} onExecute={handleFocus} />

          if (cmd.isCommandPrompt(item))
            return <CommandPrompt key={i} prompt={item} editor={editor} onExecute={handleFocus} />

          if (cmd.isCommandGroup(item)) {
            return (
              <CommandGroupDropdown key={i} editor={editor} group={item} onExecute={handleFocus} />
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

export interface CommandButtonProps {
  command: cmd.Command
  editor: CustomEditor
  onExecute?: () => void
}

export function CommandButton({ command, editor, onExecute }: CommandButtonProps) {
  const handleClick = React.useCallback(() => {
    command.execute(editor)
    onExecute?.()
  }, [command, editor, onExecute])

  React.useEffect(() => {
    editor.setTool(command.name, handleClick)
    return () => editor.removeTool(command.name)
  }, [command.name, editor, handleClick])

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      aria-label={command.label}
      disabled={command.disabled(editor)}
      className={cn('text-lg', { 'bg-muted dark:bg-muted/50': command.active(editor) })}
    >
      {cloneIcon(command.icon)}
    </Button>
  )
}

export interface CommandGroupDropdownItemProps {
  command: cmd.Command
  editor: CustomEditor
}

export function CommandGroupDropdownItem({ command, editor }: CommandGroupDropdownItemProps) {
  const isSelected = command.active(editor)

  const handleClick = React.useCallback(() => {
    command.execute(editor)
  }, [command, editor])

  React.useEffect(() => {
    editor.setTool(command.name, handleClick)
    return () => editor.removeTool(command.name)
  }, [command, editor, handleClick])

  return (
    <DropdownMenuCheckboxItem
      className="focus:bg-primary/70 focus:text-white dark:focus:text-black"
      checked={isSelected}
      onClick={handleClick}
      disabled={command.disabled(editor)}
    >
      <div className="inline-flex items-center gap-4">
        {cloneIcon(command.icon)}
        <span className="me-4">{command.label}</span>
      </div>
    </DropdownMenuCheckboxItem>
  )
}

export interface CommandGroupDropdownProps {
  group: cmd.CommandGroup
  editor: CustomEditor
  disabled?: boolean
  onExecute?: () => void
}

export function CommandGroupDropdown({
  group: { group, commands },
  editor,
  disabled,
  onExecute,
}: CommandGroupDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const schedule = useTimeout(200)
  const activeCommand = commands.find((c) => c.active(editor))

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    void (!open && onExecute && schedule(onExecute))
  }

  React.useEffect(() => {
    editor.setTool(`group:${group}`, () => setOpen((open) => !open))
    return () => editor.removeTool(`group:${group}`)
  }, [editor, group])

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger disabled={disabled} asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-base font-normal capitalize"
          aria-label={activeCommand?.label || group}
        >
          {activeCommand ? cloneIcon(activeCommand.icon) : cloneIcon(<Pilcrow />)}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="supports-[backdrop-filter]:bg-muted/50 backdrop-blur-xl"
        align="start"
      >
        {commands.map((command) => {
          return <CommandGroupDropdownItem editor={editor} command={command} key={command.label} />
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface CommandPromptProps {
  prompt: cmd.CommandPrompt
  editor: CustomEditor
  onExecute?: () => void
}

export function CommandPrompt({ prompt, editor, onExecute }: CommandPromptProps) {
  const [open, setOpen] = React.useState(false)
  const schedule = useTimeout(300)
  const breakpoint = useCurrentBreakpoint()
  const dialogType = breakpoint === 'base' ? 'swipe' : 'float'

  const Prompt = prompt.prompt

  const handleConfirm = () => {
    setOpen(false)
    void (onExecute && schedule(onExecute))
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    void (!open && onExecute && schedule(onExecute))
  }

  React.useEffect(() => {
    const name = `prompt:${prompt.command.name}`
    editor.setTool(name, () => setOpen((open) => !open))
    return () => editor.removeTool(name)
  }, [editor, prompt.command.name])

  return (
    <React.Fragment>
      <AppDialog.Root
        type={dialogType}
        title="Insert a link"
        description="Enter the URL of the link you want to add, with the title text, optionally."
        open={open}
        onOpenChange={handleOpenChange}
        Trigger={
          <AppDialog.Trigger variant={dialogType} asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label={prompt.command.label}
              disabled={prompt.command.disabled(editor)}
              className={cn('text-lg', {
                'bg-muted dark:bg-muted/50': prompt.command.active(editor),
              })}
            >
              {cloneIcon(prompt.command.icon)}
            </Button>
          </AppDialog.Trigger>
        }
      >
        <Prompt
          className={cn({ 'mb-5': dialogType === 'swipe' })}
          editor={editor}
          onConfirm={handleConfirm}
        />
      </AppDialog.Root>
    </React.Fragment>
  )
}
