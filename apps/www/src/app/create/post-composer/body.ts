import { type Descendant, KEYS, type TElement, type Value } from 'platejs'

import { platePlainText } from '@/compositions/editor/draft-text'

const EMPTY_POST_VALUE: Value = [{ type: 'p', children: [{ text: '' }] }]

function isElement(node: Descendant): node is TElement {
  return typeof node === 'object' && node !== null && 'type' in node && 'children' in node
}

function isParagraph(node: unknown): node is TElement {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    node.type === 'p' &&
    'children' in node &&
    Array.isArray(node.children)
  )
}

function isInline(node: Descendant): boolean {
  if ('text' in node) return true
  return isElement(node) && node.type === KEYS.link
}

function inlinesFrom(node: Descendant): Descendant[] {
  if (isInline(node)) return [node]
  if (!isElement(node)) return []
  return node.children.flatMap((child) => inlinesFrom(child))
}

export function postParagraphValue(body: string): Value {
  if (!body) return EMPTY_POST_VALUE

  let parsed: unknown
  try {
    parsed = JSON.parse(body) as unknown
  } catch {
    return EMPTY_POST_VALUE
  }

  if (!Array.isArray(parsed)) return EMPTY_POST_VALUE

  let first: Value | null = null
  for (const node of parsed) {
    if (!isParagraph(node)) continue
    const paragraph = [{ type: 'p', children: node.children }] as Value
    first ??= paragraph
    if (platePlainText(node).trim()) return paragraph
  }

  return first ?? EMPTY_POST_VALUE
}

export function serializePostBody(value: Value): string {
  const paragraph = value.find((node) => node.type === 'p')
  const stored: Value = [{ type: 'p', children: paragraph?.children ?? [{ text: '' }] }]
  if (platePlainText(stored).trim().length === 0) return ''
  return JSON.stringify(stored)
}

export function flattenPostFragment(fragment: Descendant[]): Descendant[] {
  if (fragment.every(isInline)) return fragment

  const inlines: Descendant[] = []
  for (const node of fragment) {
    const part = inlinesFrom(node)
    if (part.length === 0) continue
    if (inlines.length > 0) inlines.push({ text: '\n' })
    inlines.push(...part)
  }

  return inlines.length > 0 ? inlines : [{ text: '' }]
}
