import { platePlainText } from '@/compositions/editor/draft-text'

type Names = 'name' | 'firstName' | 'lastName' | 'username'

function isParagraph(node: unknown): node is { type: string } {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'p'
}

function firstParagraphText(body: string): string {
  if (!body) return ''

  let value: unknown
  try {
    value = JSON.parse(body) as unknown
  } catch {
    return ''
  }

  if (!Array.isArray(value)) return ''

  for (const node of value) {
    if (!isParagraph(node)) continue
    const text = platePlainText(node).trim()
    if (text) return text
  }

  return ''
}

export function draftExcerpt(draft: { subtitle: string; body: string }): string {
  const subtitle = draft.subtitle.trim()
  if (subtitle) return subtitle
  return firstParagraphText(draft.body)
}

export function previewAuthorName(
  user?: Record<Exclude<Names, 'lastName'>, string | null> | null,
): string {
  const firstName = user?.firstName?.trim()
  if (firstName) return firstName
  const username = user?.username?.trim()
  if (username) return username
  return ''
}

export function previewAuthorInitials(user?: Record<Names, string | null> | null): string {
  const firstName = user?.firstName?.trim() ?? ''
  const lastName = user?.lastName?.trim() ?? ''
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()

  const single = firstName || lastName || user?.username?.trim() || ''
  return single.slice(0, 2).toUpperCase()
}

export function previewChannelLabel(channelId: string | null): string | null {
  if (channelId === null) return null
  return channelId
}
