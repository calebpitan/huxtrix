/* eslint-disable @typescript-eslint/no-namespace */
import { BaseEditor, Descendant, Editor, Node, Path, Range, Element as SlateElement } from 'slate'
import { Text, Transforms } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

import { isUrl } from '@/lib/utils'

import { BlockCommand, FormatCommand } from './commands'

type ToolEditor = {
  setTool(name: string, callback: () => void): void
  removeTool(name: string): void
  callTool(name: string): void
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor & ToolEditor

export type HeadingLevel = '1' | '2' | '3' | '4' | '5' | '6'
export type ListVariant = 'ordered-list' | 'unordered-list'
export type BaseElementProps = 'type' | 'children'

type NormalizeBlock<B> = B extends string ? (B extends `heading${number}` ? 'heading' : B) : B
export type FormatType = FormatCommand['name']
export type BlockType = NormalizeBlock<BlockCommand['name']>

export type VoidText = { text: '' }
export type FormattedText = Partial<Record<FormatType, boolean>> & { text: string }

export type InlineElement = El.Link<false> | El.LineBreak
export type BlockElement = El.Heading | El.Paragraph | El.Link<true> | El.List | El.ListItem

export type CustomElement = BlockElement | InlineElement
export type ChildNode = FormattedText | InlineElement

export namespace El {
  export type Paragraph = { type: 'paragraph'; children: ChildNode[] }
  export type Heading = { type: 'heading'; level: HeadingLevel; children: ChildNode[] }
  export type Link<OG extends boolean = false> = {
    type: 'link'
    og: OG
    url: string
    children: OG extends true ? ChildNode[] : FormattedText[]
  }
  export type List = { type: 'list'; variant: ListVariant; children: ListItem[] }
  export type ListItem = { type: 'list-item'; children: ChildNode[] }
  export type LineBreak = { type: 'line-break'; void: true; children: [VoidText] }

  export type Type<T extends CustomElement['type']> = Extract<CustomElement, { type: T }>
  export type Props<T extends CustomElement['type']> = Omit<El.Type<T>, BaseElementProps>
}

const PRE_LINEBREAK = '\u200B'

export function withTool(editor: Editor) {
  const tools = new Map<string, CallableFunction>()

  editor.setTool = (name, callback) => tools.set(name, callback)
  editor.removeTool = (name) => tools.delete(name)
  editor.callTool = (name) => tools.get(name)?.()

  return editor
}

export function withCustomization(editor: Editor) {
  const { deleteBackward, insertBreak, insertData, insertText, isInline, isVoid } = editor

  editor.deleteBackward = (unit) => {
    const { selection } = editor
    if (!selection || !Range.isCollapsed(selection)) return deleteBackward(unit)

    const parentPath = Path.parent(selection.focus.path)
    const parentPrevSiblingPath = Path.hasPrevious(parentPath)
      ? Path.previous(parentPath)
      : undefined

    const entries = Editor.nodes(editor, {
      at: parentPrevSiblingPath,
      mode: 'lowest',
      reverse: true,
      match(node) {
        return CustomElement.isListItem(node)
      },
    })

    const { value: entry } = entries.next()

    // If we are not inside a list block, and the current block is empty, and a user goes ahead to hit
    // backspace, and the block above the empty block the user is about to delete using backspace happens
    // to be a list block or list-item block as guaranteed by `entry` being defined; then perform the
    // deletion of the block, which sets us back to the previous block (at `entry`) and insert a break after.
    // Since `insertBreak` has also been overriden to insert a new list-item when in a list block.
    if (entry && CustomEditor.isEmptyBlock(editor) && !CustomEditor.hasBlock(editor, 'list')) {
      deleteBackward(unit)

      editor.insertBreak()

      return
    }

    deleteBackward(unit)
  }

  editor.insertBreak = () => {
    const { selection } = editor
    if (!selection) return insertBreak()

    let element: CustomElement | undefined = undefined

    try {
      ;[[element]] = Editor.nodes(editor, {
        at: selection,
        match: (n) => CustomElement.isElement(n),
      })
    } catch {}

    if (element) {
      if (CustomElement.isList(element)) {
        if (CustomEditor.isEmptyBlock(editor)) {
          Transforms.setNodes(editor, { type: 'paragraph' })
          CustomEditor.unwrapList(editor)
          return
        }
      } else if (!CustomElement.isParagraph(element)) {
        Transforms.splitNodes(editor, { always: true })
        Transforms.unsetNodes(editor, ['level'], { match: (n) => CustomElement.isElement(n) })
        Transforms.setNodes(
          editor,
          { type: 'paragraph' },
          { match: (n) => CustomElement.isElement(n) },
        )
        return
      }
    }

    return insertBreak()
  }

  editor.insertSoftBreak = () => {
    Transforms.insertText(editor, '\n')
  }

  editor.insertData = (data) => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      CustomEditor.wrapLink(editor, { url: text, og: false })
    } else {
      insertData(data)
    }
  }

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      CustomEditor.wrapLink(editor, { url: text, og: false })
    } else {
      insertText(text)
    }
  }

  editor.isInline = (element) => {
    return (
      element.type === 'line-break' ||
      (element.type === 'link' && element.og === false) ||
      isInline(element)
    )
  }

  editor.isVoid = (element) => {
    return element.type === 'line-break' || isVoid(element)
  }

  return withTool(editor)
}

export const CustomElement = {
  isElement(n: Node): n is CustomElement {
    return !Editor.isEditor(n) && SlateElement.isElement(n)
  },
  isParagraph(el: CustomElement | Node) {
    return CustomElement.isElement(el) && el.type === 'paragraph'
  },
  isList(el: CustomElement | Node) {
    return CustomElement.isElement(el) && el.type === 'list'
  },
  isListItem(el: CustomElement | Node) {
    return CustomElement.isElement(el) && el.type === 'list-item'
  },
  isLineBreak(el: CustomElement | Node) {
    return CustomElement.isElement(el) && el.type === 'line-break'
  },

  /**
   * Extracts and concatenates all text content from an array of Slate nodes.
   *
   * This method traverses through each node in the provided array and extracts
   * their string representations using Slate's Node.string() method. The resulting
   * text fragments are then joined together with newline characters as separators.
   *
   * This is particularly useful for:
   * - Extracting plain text content from complex Slate document structures
   * - Converting Slate nodes to string format for external processing
   * - Creating text previews or summaries from document fragments
   * - Serializing node content for clipboard operations or data export
   *
   * @param nodes - An array of Slate Descendant nodes to extract text from.
   *                These can be any valid Slate node types including elements,
   *                text nodes, or nested structures.
   * @returns A string containing all text content from the nodes, with each
   *          node's text separated by newline characters. If the nodes array
   *          is empty, returns an empty string.
   *
   * @example
   * ```typescript
   * const nodes = [
   *   { type: 'paragraph', children: [{ text: 'Hello' }] },
   *   { type: 'paragraph', children: [{ text: 'World' }] }
   * ]
   * const text = CustomElement.texts(nodes)
   * // Returns: "Hello\nWorld"
   * ```
   */
  texts(nodes: Descendant[]) {
    return nodes.map((n) => Node.string(n)).join('\n')
  },

  /**
   * Checks if any elements in the current selection match the given predicate.
   *
   * @param editor - The Slate editor instance to check
   * @param exclusive - When true, only returns true if the selection is entirely contained within matching elements. \
   *                    When false, returns true if any part of the selection overlaps with matching elements
   * @param predicate - A function that takes a CustomElement and returns true if it matches the desired criteria
   * @returns true if matching elements are found in the selection, false otherwise
   */
  matches(editor: Editor, exclusive: boolean = false, predicate: (el: CustomElement) => boolean) {
    const { selection } = editor
    if (!selection) return false

    const entries = Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match(node, path) {
        if (CustomElement.isElement(node)) {
          if (exclusive) {
            return (
              Path.isCommon(path, selection.anchor.path) &&
              Path.isCommon(path, selection.focus.path) &&
              predicate(node)
            )
          }
          return predicate(node)
        }
        return false
      },
    })

    const { value: entry } = entries.next()

    return entry !== undefined && entry.length === 2
  },

  /**
   * Finds the first element in the current selection that matches the given predicate.
   *
   * This method searches through all elements in the current selection and returns the first
   * element that satisfies the predicate function. The search can be configured to be either
   * inclusive (returning elements that overlap with the selection) or exclusive (only returning
   * elements that are entirely contained within the selection).
   *
   * @param editor - The Slate editor instance to search within
   * @param exclusive - When true, only returns elements that are entirely contained within the selection.
   *                    When false, returns any element that overlaps with the selection
   * @param predicate - A type guard function that takes a CustomElement and returns true if it matches
   *                    the desired criteria. This function also serves as a type predicate to narrow
   *                    the return type to a specific CustomElement subtype
   * @returns A tuple containing the matching element and its path if found, or null if no matching
   *          element is found in the selection
   */
  find<M extends CustomElement>(
    editor: Editor,
    exclusive: boolean = false,
    predicate: (el: CustomElement) => el is M,
  ) {
    const { selection } = editor
    if (!selection) return null

    const entries = Editor.nodes<M>(editor, {
      at: Editor.unhangRange(editor, selection),
      match(node, path) {
        if (CustomElement.isElement(node)) {
          if (exclusive) {
            return (
              predicate(node) &&
              Path.isCommon(path, selection.anchor.path) &&
              Path.isCommon(path, selection.focus.path)
            )
          }
          return predicate(node)
        }
        return false
      },
    })

    const { value: entry } = entries.next()

    return entry ? entry : null
  },
}

export const CustomEditor = {
  /**
   * Focus the editor
   *
   * @param editor The editor to focus
   */
  focus(editor: Editor) {
    ReactEditor.focus(editor)
  },

  /**
   * Restore the cursor in the editor to the correct position
   * in the document.
   *
   * @param editor The editor to restore cursor for
   */
  restoreCursor(editor: Editor) {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const newPoint = Editor.after(editor, selection.focus, { distance: 0, unit: 'offset' })
      if (newPoint) {
        Transforms.select(editor, { anchor: newPoint, focus: newPoint })
      }
    }
    CustomEditor.focus(editor)
  },

  getSelectedText(editor: Editor) {
    const { selection } = editor
    if (!selection || Range.isCollapsed(selection)) return ''
    return Editor.string(editor, selection)
  },

  unwrapList(
    editor: Editor,
    options?: Omit<NonNullable<Parameters<typeof Transforms.unwrapNodes>[1]>, 'match'>,
  ) {
    Transforms.unwrapNodes(editor, {
      split: true,
      match(node) {
        return CustomElement.isElement(node) && CustomElement.isList(node)
      },

      ...options,
    })
  },

  isEmptyBlock(editor: Editor) {
    if (!editor.selection) return false

    try {
      const [[block]] = Editor.nodes<CustomElement>(editor, {
        at: editor.selection,
        mode: 'lowest',
        voids: false,
        match: (n): n is CustomElement => CustomElement.isElement(n) && !Editor.isInline(editor, n),
      })

      return Editor.isEmpty(editor, block)
    } catch {
      return false
    }
  },

  hasMark(editor: Editor, format: FormatType) {
    const marks = Editor.marks(editor)

    return marks ? marks[format] === true : false
  },

  isLinkActive(editor: Editor, exclusive: boolean = false) {
    return CustomElement.matches(editor, exclusive, (el) => el.type === 'link')
  },

  hasBlock(editor: Editor, format: BlockType, exclusive?: boolean) {
    return CustomElement.matches(editor, exclusive, (el) => el.type === format)
  },

  toggleMark(editor: Editor, format: FormatType) {
    const isActive = CustomEditor.hasMark(editor, format)

    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  },

  toggleBlock<B extends BlockType>(editor: Editor, format: B, props: El.Props<B>) {
    const newElement: Partial<CustomElement> = {}

    const isList = format === 'list'
    const isHeading = format === 'heading'
    const isActive = CustomEditor.hasBlock(editor, format)

    // A variant of the list, other than the one to toggle on, is currently active
    let isListVariantActive: boolean = false
    // A variant of the heading, other than the one to toggle on, is currently active
    let isHeadingVariantActive: boolean = false

    if (isList) {
      const variant = (props as unknown as El.Props<'list'>).variant

      isListVariantActive = CustomElement.matches(editor, undefined, (el) => {
        return el.type === 'list' && el.variant !== variant
      })

      const type = !isActive || isListVariantActive ? 'list-item' : 'paragraph'

      Object.assign(newElement, { type, ...(type !== 'list-item' ? props : null) })
    } else if (isHeading) {
      const level = (props as unknown as El.Props<'heading'>).level

      isHeadingVariantActive = CustomElement.matches(editor, undefined, (el) => {
        return el.type === 'heading' && el.level !== level
      })

      const type = !isActive || isHeadingVariantActive ? 'heading' : 'paragraph'

      Object.assign(newElement, props, { type })
    } else {
      const type = isActive ? 'paragraph' : format
      Object.assign(newElement, { type, ...(!isActive ? props : null) })
    }

    CustomEditor.unwrapList(editor)
    Transforms.setNodes<SlateElement>(editor, newElement)

    // simpler: newElement.type === 'list-item';
    // (!isActive && isList) || isListVariantActive;
    if (newElement.type === 'list-item') {
      const options = props as unknown as El.Props<'list'>
      const block: El.List = { type: 'list', children: [], ...options }
      Transforms.wrapNodes<SlateElement>(editor, block)
    }
  },

  /**
   * Removes the link element from the current selection or cursor position.
   *
   * This method unwraps any link elements that are currently active in the editor,
   * converting them back to plain text while preserving the text content.
   *
   * @param editor - The Slate editor instance to operate on
   * @returns void
   */
  unwrapLink(editor: Editor) {
    Transforms.unwrapNodes(editor, {
      match: (n) => CustomElement.isElement(n) && n.type === 'link',
    })
  },

  /**
   * Wraps the current selection or inserts a link element at the cursor position.
   *
   * This method handles various link insertion scenarios:
   * - Wrapping existing text with a link
   * - Inserting a new link at cursor position
   * - Updating an existing link with new properties
   * - Handling collapsed vs non-collapsed selections
   *
   * @param editor - The Slate editor instance to operate on
   * @param props - Link properties including URL, optional text, and other element attributes
   * @param props.url - The URL for the link (required)
   * @param props.text - Optional text to display for the link. If not provided, uses the URL
   * @param props.rest - Additional element properties to apply to the link
   * @returns void
   */
  wrapLink(editor: Editor, props: El.Props<'link'> & { text?: string }) {
    const { selection } = editor
    const { text, url, ...rest } = props
    const isCollapsed = selection !== null && Range.isCollapsed(selection)

    const link: El.Type<'link'> = {
      type: 'link',
      url,
      ...rest,
      children: isCollapsed ? [{ text: text || url }] : [],
    }

    // pasting a link directly on a non-collapsed selected link
    // using the prompt to update a non-collapsed selecteed link
    // using the prompt to update a collapsed selected link
    // pasting a link directly as plain text
    // usisng the prompt to add a link

    // If a link is exclusively selected, that is, the link only and nothing else
    if (CustomEditor.isLinkActive(editor, true)) {
      // mostly when you paste a link text, it's expected to be passed in the `props.url`
      // while `props.text` is undefined
      if (text === undefined) {
        if (isCollapsed) {
          // we don't want two links running into each other
          Transforms.select(editor, selection.focus.path)
          Transforms.collapse(editor, { edge: 'end' })
          Transforms.move(editor, { unit: 'offset', distance: 1 })
          Transforms.insertNodes(editor, link)
        } else {
          CustomEditor.unwrapLink(editor)
          Transforms.wrapNodes(editor, link, { split: true })
          Transforms.collapse(editor, { edge: 'end' })
        }
      } else {
        if (isCollapsed) {
          editor.select(selection.anchor.path)
        }
        CustomEditor.unwrapLink(editor)
        Transforms.delete(editor)
        Transforms.insertNodes(editor, { ...link, children: [{ text: text || url }] })
      }

      return
    }

    if (CustomEditor.isLinkActive(editor)) {
      CustomEditor.unwrapLink(editor)
    }

    if (isCollapsed) {
      Transforms.insertNodes(editor, link)
    } else {
      if (text !== undefined) {
        Transforms.removeNodes(editor)
        Transforms.insertNodes(editor, { ...link, children: [{ text: text || url }] })
      } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
      }
    }
  },

  insertLink(editor: Editor, props: El.Props<'link'> & { text: string }) {
    return CustomEditor.wrapLink(editor, props)
  },

  /**
   * Insert a line break in the editor as a void inline element.
   * Places a zero-width space text node before the line break node
   * if it's not already preceded by one.
   *
   * @param editor The editor to insert a line break
   * @returns void
   */
  break(editor: Editor) {
    if (!editor.selection) return

    let newNodes: Node | Node[]
    const lineBreakNode: El.LineBreak = { type: 'line-break', void: true, children: [{ text: '' }] }
    const [node] = Editor.node(editor, editor.selection)

    if (Text.isText(node) && node.text.endsWith(PRE_LINEBREAK)) {
      newNodes = lineBreakNode
    } else {
      newNodes = [{ text: PRE_LINEBREAK }, lineBreakNode]
    }

    Transforms.insertNodes(editor, newNodes)
    Transforms.move(editor)
  },

  /**
   * Handle deleting of void inline line-break nodes from the
   * editor which corrects how slate treats cursror for void elements.
   *
   * Cursors are not rendered on void elements so when the user deletes
   * up until they encounter a line-break, the cursor disappears from
   * the editor.
   *
   * Since {@link CustomEditor.break} inserts a {@link PRE_LINEBREAK}
   * then this allows the cursor to render but we have to delete both
   * the line-break and the `PRE_LINEBREAK` when the user hit's backspace
   * on either.
   *
   * @param editor The editor to delete from
   * @returns boolean indicating the expected action was completed
   */
  backspace(editor: Editor) {
    const selection = editor.selection

    if (!selection) return false

    const [[element, path]] = Editor.nodes(editor, {
      at: selection,
      mode: 'all',
      voids: true,
      match(node) {
        return CustomElement.isElement(node)
      },
    })

    const childPath = Path.relative(selection.focus.path, path)
    const prevSiblingPath = Path.hasPrevious(childPath) ? Path.previous(childPath) : undefined

    const node = Node.get(element, childPath)
    const sibling = prevSiblingPath && Node.get(element, prevSiblingPath)

    if (sibling && CustomElement.isElement(sibling) && CustomElement.isLineBreak(sibling)) {
      if (Text.isText(node) && node.text.endsWith(PRE_LINEBREAK)) {
        // console.log(node, sibling)
        Editor.deleteForward(editor)
        Editor.deleteBackward(editor)
        CustomEditor.restoreCursor(editor)
        return true
      }
    }

    // console.log(element, sibling, node)

    return false
  },

  /**
   * Restore sensible defaults for the editor by selecting the most
   * logically intuitive block that should follow another block on
   * carriage return.
   *
   * @param editor The editor to restore sensible defaults for
   * @returns boolean indicating the expected action was completed
   */
  return(editor: Editor) {
    const { selection } = editor
    if (!selection) return false

    const [[element]] = Array.from(
      Editor.nodes(editor, {
        at: selection,
        match: (n) => CustomElement.isElement(n),
      }),
    )

    if (CustomElement.isList(element)) {
      if (!CustomEditor.isEmptyBlock(editor)) return false

      Transforms.setNodes(editor, { type: 'paragraph' })
      CustomEditor.unwrapList(editor)

      return true
    } else if (!CustomElement.isParagraph(element)) {
      Transforms.splitNodes(editor, { always: true })
      Transforms.setNodes(
        editor,
        { type: 'paragraph' },
        { match: (n) => CustomElement.isElement(n) },
      )
      return true
    }

    return false
  },
}
