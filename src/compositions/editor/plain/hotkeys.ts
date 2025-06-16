import { Range, Transforms } from 'slate'

import { CustomEditor } from './customization'

export type Hotkeys = typeof Hotkeys

export const Hotkeys = {
  'mod+b': {
    name: 'bold',
    enabled: true,
    action(editor: CustomEditor, event: KeyboardEvent) {
      if (CustomEditor.hasMark(editor, 'code')) return
      event.stopPropagation()
      event.preventDefault()

      CustomEditor.toggleMark(editor, this.name)
    },
  },
  'mod+i': {
    name: 'italic',
    enabled: true,
    action(editor: CustomEditor, event: KeyboardEvent) {
      if (CustomEditor.hasMark(editor, 'code')) return
      event.stopPropagation()
      event.preventDefault()

      CustomEditor.toggleMark(editor, this.name)
    },
  },
  'mod+k': {
    name: 'code',
    enabled: true,
    action(editor: CustomEditor, event: KeyboardEvent) {
      event.stopPropagation()
      event.preventDefault()

      CustomEditor.toggleMark(editor, this.name)
    },
  },
  'mod+shift+x': {
    name: 'strikethrough',
    enabled: true,
    action(editor: CustomEditor, event: KeyboardEvent) {
      if (CustomEditor.hasMark(editor, 'code')) return
      event.stopPropagation()
      event.preventDefault()

      CustomEditor.toggleMark(editor, this.name)
    },
  },
  'shift+return': {
    name: 'break',
    enabled: false,
    action(editor: CustomEditor, event: KeyboardEvent) {
      event.preventDefault()
      CustomEditor.break(editor)
    },
  },
  return: {
    name: 'return',
    enabled: false,
    action(editor: CustomEditor, event: KeyboardEvent) {
      if (CustomEditor.return(editor)) {
        event.preventDefault()
      }
    },
  },
  backspace: {
    name: 'backspace',
    enabled: false,
    action(editor: CustomEditor, event: KeyboardEvent) {
      if (CustomEditor.backspace(editor)) {
        event.preventDefault()
      }
    },
  },
  left: {
    name: 'left',
    enabled: true,
    action(editor: CustomEditor, event: KeyboardEvent) {
      if (editor.selection !== null && Range.isCollapsed(editor.selection)) {
        event.preventDefault()
        event.stopPropagation()
        Transforms.move(editor, { unit: 'offset', reverse: true })
      }
    },
  },
  right: {
    name: 'right',
    enabled: true,
    action(editor: CustomEditor, event: KeyboardEvent) {
      if (editor.selection !== null && Range.isCollapsed(editor.selection)) {
        event.preventDefault()
        event.stopPropagation()
        Transforms.move(editor, { unit: 'offset' })
      }
    },
  },
} as const
