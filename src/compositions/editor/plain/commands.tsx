import { Fragment, JSX } from 'react'

import { Bold, Code, Heading1, Heading2, Heading3, Redo, Undo } from 'lucide-react'
import { Heading4, Heading5, Heading6, Italic, Link, Pilcrow, Strikethrough } from 'lucide-react'
import { List, ListOrdered } from 'lucide-react'
import { Editor } from 'slate'

import { CustomEditor, CustomElement, El } from './customization'

type PromptProps = { editor: CustomEditor; className?: string; onConfirm(): void }
type Prompt = (props: PromptProps) => JSX.Element

type ExecuteOptions<T extends CustomElement['type'] = never> = Partial<El.Props<T>> &
  (T extends 'link' ? { text?: string } : Record<string, unknown>)

type HistoryCommands = typeof historyCommands
type TypographyCommands = typeof typographyCommands
type LinkCommands = typeof linkCommands
type ListCommands = typeof listCommands
type FormatCommands = typeof formattingCommands
type VoidCommands = typeof voidCommands

interface Commands
  extends HistoryCommands,
    TypographyCommands,
    LinkCommands,
    ListCommands,
    FormatCommands,
    VoidCommands {
  divider: CommandDivider
  group(name: string, commands: Array<Command>): CommandGroup
  prompt(command: Command, prompt: Prompt): CommandPrompt
}

export type Command = Commands[Exclude<keyof Commands, 'group' | 'divider' | 'prompt'>]
export type CommandGroup = { group: string; icon?: JSX.Element; commands: Array<Command> }
export type CommandPrompt = { command: Command; prompt: Prompt }
export type CommandDivider = { divider: true }
export type CommandItems = Command | CommandDivider | CommandGroup | CommandPrompt

export type FormatCommand = Extract<Command, { flow: 'format' }>
export type BlockCommand = Extract<Command, { flow: 'block' } | { flow: 'inline-block' }>
export type InlineCommand = Extract<Command, { flow: 'inline' } | { flow: 'inline-block' }>

export function isCommandPrompt(v: CommandItems): v is CommandPrompt {
  return 'prompt' in v && !!v.prompt
}

export function isCommandGroup(v: CommandItems): v is CommandGroup {
  return 'group' in v && Array.isArray(v.commands)
}

export function isCommandDivider(v: CommandItems): v is CommandDivider {
  return 'divider' in v && v.divider
}

export function isCommand(v: CommandItems): v is Command {
  return !(isCommandGroup(v) || isCommandDivider(v) || isCommandPrompt(v))
}

export function isFormatCommand(v: Command): v is FormatCommand {
  return v.flow === 'format'
}

export function isBlockCommand(v: Command): v is BlockCommand {
  return v.flow === 'block'
}

export function isInlineCommand(v: Command): v is InlineCommand {
  return v.flow === 'inline'
}

export const devCommands = {
  divider: { divider: true },
  group(name: string, commands: Array<Command>): CommandGroup {
    return {
      group: name,
      commands,
    }
  },
  prompt(command: Command, prompt: Prompt): CommandPrompt {
    return {
      command,
      prompt,
    }
  },
}

export const historyCommands = {
  undo: {
    name: 'undo',
    label: 'undo',
    flow: 'history',
    void: undefined,
    icon: <Undo />,
    active: (_editor: CustomEditor) => false,
    disabled: (editor: CustomEditor) => editor.history.undos.length === 0,
    execute: (editor: CustomEditor, _opts?: ExecuteOptions) => editor.undo(),
  },
  redo: {
    name: 'redo',
    label: 'Redo',
    flow: 'history',
    void: undefined,
    icon: <Redo />,
    active: (_editor: CustomEditor) => false,
    disabled: (editor: CustomEditor) => editor.history.redos.length === 0,
    execute: (editor: CustomEditor, _opts?: ExecuteOptions) => editor.redo(),
  },
} as const

export const typographyCommands = {
  paragraph: {
    name: 'paragraph',
    label: 'Paragraph',
    flow: 'block',
    void: false,
    icon: <Pilcrow />,
    active(editor: CustomEditor) {
      return CustomElement.matches(editor, true, (el) => {
        return el.type === 'paragraph'
      })
    },
    disabled: (_editor: CustomEditor) => false,
    execute(editor: CustomEditor, opts?: ExecuteOptions<'paragraph'>) {
      const block = this.name
      CustomEditor.toggleBlock(editor, block, { ...opts })
    },
  },
  heading1: {
    name: 'heading1',
    label: 'Heading 1',
    flow: 'block',
    void: false,
    icon: <Heading1 />,
    active(editor: CustomEditor) {
      return CustomElement.matches(editor, true, (el) => {
        return el.type === 'heading' && el.level === '1'
      })
    },
    disabled: (_editor: CustomEditor) => false,
    execute(editor: CustomEditor, opts?: ExecuteOptions<'heading'>) {
      const block = 'heading'
      CustomEditor.toggleBlock(editor, block, { ...opts, level: '1' })
    },
  },
  heading2: {
    name: 'heading2',
    label: 'Heading 2',
    flow: 'block',
    void: false,
    icon: <Heading2 />,
    active(editor: CustomEditor) {
      return CustomElement.matches(editor, true, (el) => {
        return el.type === 'heading' && el.level === '2'
      })
    },
    disabled: (_editor: CustomEditor) => false,
    execute(editor: CustomEditor, opts?: ExecuteOptions<'heading'>) {
      const block = 'heading'
      CustomEditor.toggleBlock(editor, block, { ...opts, level: '2' })
    },
  },
  heading3: {
    name: 'heading3',
    label: 'Heading 3',
    flow: 'block',
    void: false,
    icon: <Heading3 />,
    active(editor: CustomEditor) {
      return CustomElement.matches(editor, true, (el) => {
        return el.type === 'heading' && el.level === '3'
      })
    },
    disabled: (_editor: CustomEditor) => false,
    execute(editor: CustomEditor, opts?: ExecuteOptions<'heading'>) {
      const block = 'heading'
      CustomEditor.toggleBlock(editor, block, { ...opts, level: '3' })
    },
  },
  heading4: {
    name: 'heading4',
    label: 'Heading 4',
    flow: 'block',
    void: false,
    icon: <Heading4 />,
    active(editor: CustomEditor) {
      return CustomElement.matches(editor, true, (el) => {
        return el.type === 'heading' && el.level === '4'
      })
    },
    disabled: (_editor: CustomEditor) => false,
    execute(editor: CustomEditor, opts?: ExecuteOptions<'heading'>) {
      const block = 'heading'
      CustomEditor.toggleBlock(editor, block, { ...opts, level: '4' })
    },
  },
  heading5: {
    name: 'heading5',
    label: 'Heading 5',
    flow: 'block',
    void: false,
    icon: <Heading5 />,
    active(editor: CustomEditor) {
      return CustomElement.matches(editor, true, (el) => {
        return el.type === 'heading' && el.level === '5'
      })
    },
    disabled: (_editor: CustomEditor) => false,
    execute(editor: CustomEditor, opts?: ExecuteOptions<'heading'>) {
      const block = 'heading'
      CustomEditor.toggleBlock(editor, block, { ...opts, level: '5' })
    },
  },
  heading6: {
    name: 'heading6',
    label: 'Heading 6',
    flow: 'block',
    void: false,
    icon: <Heading6 />,
    active(editor: CustomEditor) {
      return CustomElement.matches(editor, true, (el) => {
        return el.type === 'heading' && el.level === '6'
      })
    },
    disabled: (_editor: CustomEditor) => false,
    execute(editor: CustomEditor, opts?: ExecuteOptions<'heading'>) {
      const block = 'heading'
      CustomEditor.toggleBlock(editor, block, { ...opts, level: '6' })
    },
  },
} as const

const linkCommands = {
  link: {
    name: 'link',
    label: 'Link',
    flow: 'inline-block',
    void: false,
    icon: <Link />,
    active(editor: CustomEditor) {
      return CustomElement.matches(editor, true, (el) => {
        return el.type === 'link'
      })
    },
    disabled: (_editor: CustomEditor) => false,
    execute(editor: CustomEditor, opts: ExecuteOptions<'link'> = {}) {
      const { og = false, text = '', url = '' } = opts
      CustomEditor.insertLink(editor, { og, text, url })
    },
  },
} as const

const listCommands = {
  ul: {
    name: 'list',
    label: 'Bulletted List',
    flow: 'block',
    void: false,
    icon: <List />,
    active(editor: CustomEditor) {
      return CustomElement.matches(editor, true, (el) => {
        return el.type === 'list' && el.variant === 'unordered-list'
      })
    },
    disabled: (editor: CustomEditor) => {
      return !(
        CustomEditor.hasBlock(editor, 'paragraph') || CustomEditor.hasBlock(editor, 'list-item')
      )
    },
    execute(editor: CustomEditor, opts?: ExecuteOptions<'list'>) {
      const block = this.name
      CustomEditor.toggleBlock(editor, block, { ...opts, variant: 'unordered-list' })
    },
  },
  ol: {
    name: 'list',
    label: 'Numbered List',
    flow: 'block',
    void: false,
    icon: <ListOrdered />,
    active(editor: CustomEditor) {
      return CustomElement.matches(editor, true, (el) => {
        return el.type === 'list' && el.variant === 'ordered-list'
      })
    },
    disabled: (editor: CustomEditor) => {
      return !(
        CustomEditor.hasBlock(editor, 'paragraph') || CustomEditor.hasBlock(editor, 'list-item')
      )
    },
    execute(editor: CustomEditor, opts?: ExecuteOptions<'list'>) {
      const block = this.name
      CustomEditor.toggleBlock(editor, block, { ...opts, variant: 'ordered-list' })
    },
  },
  // implicit
  li: {
    name: 'list-item',
    label: 'List Item',
    flow: 'block',
    void: false,
    icon: <Fragment />,
    active(_editor: CustomEditor) {
      return false
    },
    disabled(_editor: CustomEditor) {
      return false
    },
    execute(_editor: CustomEditor, _opts?: ExecuteOptions<'list-item'>) {},
  },
} as const

export const formattingCommands = {
  bold: {
    name: 'bold',
    label: 'Bold',
    flow: 'format',
    void: false,
    icon: <Bold />,
    active: (editor: CustomEditor) => CustomEditor.hasMark(editor, 'bold'),
    disabled: (editor: CustomEditor) => CustomEditor.hasMark(editor, 'code'),
    execute(editor: CustomEditor, _opts?: ExecuteOptions) {
      const mark = this.name
      const isActive = CustomEditor.hasMark(editor, mark)
      if (isActive) Editor.removeMark(editor, mark)
      else Editor.addMark(editor, mark, true)
    },
  },
  italic: {
    name: 'italic',
    label: 'Italic',
    flow: 'format',
    void: false,
    icon: <Italic />,
    active: (editor: CustomEditor) => CustomEditor.hasMark(editor, 'italic'),
    disabled: (editor: CustomEditor) => CustomEditor.hasMark(editor, 'code'),
    execute(editor: CustomEditor, _opts?: ExecuteOptions) {
      const mark = this.name
      const isActive = CustomEditor.hasMark(editor, mark)
      if (isActive) Editor.removeMark(editor, mark)
      else Editor.addMark(editor, mark, true)
    },
  },
  strikethrough: {
    name: 'strikethrough',
    label: 'Strikethrough',
    flow: 'format',
    void: false,
    icon: <Strikethrough />,
    active: (editor: CustomEditor) => CustomEditor.hasMark(editor, 'strikethrough'),
    disabled: (editor: CustomEditor) => CustomEditor.hasMark(editor, 'code'),
    execute(editor: CustomEditor, _opts?: ExecuteOptions) {
      const mark = this.name
      const isActive = CustomEditor.hasMark(editor, mark)
      if (isActive) Editor.removeMark(editor, mark)
      else Editor.addMark(editor, mark, true)
    },
  },
  code: {
    name: 'code',
    label: 'Code',
    flow: 'format',
    void: false,
    icon: <Code />,
    active: (editor: CustomEditor) => CustomEditor.hasMark(editor, 'code'),
    disabled: (_editor: CustomEditor) => false,
    execute(editor: CustomEditor, _opts?: ExecuteOptions) {
      const mark = this.name
      const incompatibleMarks = ['bold', 'italic', 'strikethrough'] as const
      const isActive = CustomEditor.hasMark(editor, mark)
      if (isActive) {
        Editor.removeMark(editor, mark)
      } else {
        incompatibleMarks.forEach((m) => Editor.removeMark(editor, m))
        Editor.addMark(editor, mark, true)
      }
    },
  },
} as const

export const voidCommands = {
  break: {
    name: 'line-break',
    label: 'Line Break',
    flow: 'inline',
    void: true,
    icon: <Fragment />,
    active: (_editor: CustomEditor) => false,
    disabled: (_editor: CustomEditor) => false,
    execute(_editor: CustomEditor, _opts?: ExecuteOptions) {},
  },
}

export const commands: Commands = Object.assign(
  {},
  devCommands,
  historyCommands,
  typographyCommands,
  linkCommands,
  listCommands,
  formattingCommands,
  voidCommands,
)
