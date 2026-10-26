import type { LogFields } from './types.js'

export interface Callsite {
  file: string
  line: number
  column: number
}

const RESERVED = ['file', 'line', 'column'] as const

export function withCallsite(fields: LogFields | undefined, site: Callsite | undefined): LogFields {
  const next: LogFields = { ...fields }
  for (const key of RESERVED) delete next[key]
  if (!site) return next
  next.file = site.file
  next.line = site.line
  next.column = site.column
  return next
}
