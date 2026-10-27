function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function platePlainText(node: unknown): string {
  if (Array.isArray(node)) {
    const blocks = node.some((child) => isRecord(child) && typeof child.type === 'string')
    return node.map(platePlainText).join(blocks ? '\n' : '')
  }

  if (!isRecord(node)) return ''
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) return platePlainText(node.children)
  return ''
}

export function plainTextFromPlateBody(body: string): string {
  if (!body) return ''

  try {
    return platePlainText(JSON.parse(body) as unknown)
  } catch {
    return ''
  }
}

export function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export function draftWordCount(draft: { title: string; subtitle: string; body: string }): number {
  return countWords([draft.title, draft.subtitle, plainTextFromPlateBody(draft.body)].join('\n'))
}

export function draftStatusLabel(saved: boolean, words: number): string {
  const parts: string[] = []
  if (saved) parts.push('Saved')
  parts.push(words === 1 ? '1 word' : `${words} words`)

  if (words > 0) {
    const minutes = Math.max(1, Math.round(words / 200))
    parts.push(`${minutes} min read`)
  }

  return parts.join(' · ')
}
