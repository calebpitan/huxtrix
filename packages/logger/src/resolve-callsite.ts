import { AnyMap, type TraceMap, traceSegment } from '@jridgewell/trace-mapping'

import type { Callsite } from './caller.js'

interface CachedMap {
  map: TraceMap
  mapUrl: string
}

const maps = new Map<string, CachedMap | null>()

function isHttp(url: string): boolean {
  return url.startsWith('http:') || url.startsWith('https:')
}

function withoutQuery(url: string): string {
  const hash = url.indexOf('#')
  const cut = hash >= 0 ? url.slice(0, hash) : url
  const query = cut.indexOf('?')
  return query >= 0 ? cut.slice(0, query) : cut
}

function readText(url: string): string | undefined {
  if (typeof XMLHttpRequest === 'undefined') return
  try {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, false)
    xhr.send()
    if (xhr.status !== 200) return
    return xhr.responseText
  } catch {
    return
  }
}

function decodeDataUrl(url: string): string | undefined {
  const comma = url.indexOf(',')
  if (comma < 0) return
  const meta = url.slice(0, comma)
  const data = url.slice(comma + 1)
  try {
    if (meta.includes(';base64')) return atob(data)
    return decodeURIComponent(data)
  } catch {
    return
  }
}

function sourceMappingURL(code: string, scriptUrl: string): string | undefined {
  const match =
    /(?:\/\/[@#][ \t]*sourceMappingURL=([^\s]+)|\/\*[@#][ \t]*sourceMappingURL=([^*]+)\*\/)\s*$/.exec(
      code,
    )
  const value = (match?.[1] ?? match?.[2])?.trim()
  if (!value) return
  if (value.startsWith('data:')) return value
  try {
    return new URL(value, scriptUrl).href
  } catch {
    return
  }
}

function fetchMap(scriptUrl: string): { json: string; mapUrl: string } | undefined {
  if (scriptUrl.startsWith('data:')) {
    const json = decodeDataUrl(scriptUrl)
    return json ? { json, mapUrl: scriptUrl } : undefined
  }
  if (typeof XMLHttpRequest === 'undefined') return

  if (isHttp(scriptUrl) && scriptUrl.includes('/_next/static')) {
    const mapUrl = `${withoutQuery(scriptUrl)}.map`
    const json = readText(mapUrl)
    if (json) return { json, mapUrl }
  }

  if (isHttp(scriptUrl)) {
    const code = readText(scriptUrl)
    const mapUrl = code ? sourceMappingURL(code, scriptUrl) : undefined
    if (mapUrl?.startsWith('data:')) {
      const json = decodeDataUrl(mapUrl)
      if (json) return { json, mapUrl }
    } else if (mapUrl) {
      const json = readText(mapUrl)
      if (json) return { json, mapUrl }
    }
  }

  if (typeof location !== 'undefined' && !isHttp(scriptUrl)) {
    const url = new URL('/__nextjs_source-map', location.origin)
    url.searchParams.set('filename', scriptUrl)
    const json = readText(url.href)
    if (json) return { json, mapUrl: url.href }
  }
}

function traceMapFor(scriptUrl: string): CachedMap | undefined {
  if (maps.has(scriptUrl)) return maps.get(scriptUrl) ?? undefined
  const fetched = fetchMap(scriptUrl)
  if (!fetched) {
    maps.set(scriptUrl, null)
    return
  }
  try {
    const cached = { map: loadMap(fetched.json), mapUrl: fetched.mapUrl }
    maps.set(scriptUrl, cached)
    return cached
  } catch {
    maps.set(scriptUrl, null)
  }
}

function resolutionBase(mapUrl: string): string {
  try {
    const url = new URL(mapUrl, 'http://localhost')
    if (url.pathname !== '/__nextjs_source-map') return mapUrl
    const filename = url.searchParams.get('filename')
    if (!filename) return mapUrl
    if (isHttp(filename) || filename.startsWith('file:')) return filename
    if (filename.startsWith('/')) return `file://${filename}`
  } catch {
    return mapUrl
  }
  return mapUrl
}

function loadMap(json: string): TraceMap {
  return AnyMap(JSON.parse(json))
}

function isRelativeSource(source: string): boolean {
  return (
    !source.includes('://') &&
    !source.startsWith('/') &&
    !source.startsWith('webpack') &&
    !source.startsWith('turbopack')
  )
}

function displaySource(source: string, mapUrl: string): string {
  let file = source
  if (isRelativeSource(file)) {
    try {
      file = new URL(file, resolutionBase(mapUrl)).href
    } catch {
      // Keep the path written in the source map.
    }
  }
  const query = file.indexOf('?')
  if (query >= 0) file = file.slice(0, query)
  const packages = file.lastIndexOf('/packages/')
  if (packages >= 0) return file.slice(packages + 1)
  const apps = file.lastIndexOf('/apps/')
  if (apps >= 0) return file.slice(apps + 1)
  return file.replace(/^(?:\.\.\/)+/, '')
}

function locate(
  file: string,
  line: number,
  column: number,
): { raw: string; lookup: string; display: string; line: number; column: number } | undefined {
  if (line < 1) return
  const found = traceMapFor(file)
  if (!found) return
  let segment
  try {
    segment = traceSegment(found.map, line - 1, Math.max(0, column - 1))
  } catch {
    return
  }
  if (!segment || segment.length < 4) return
  const sourceIndex = segment[1]
  const sourceLine = segment[2]
  const sourceColumn = segment[3]
  if (sourceIndex == null || sourceLine == null || sourceColumn == null) return
  const source = found.map.sources[sourceIndex]
  if (!source) return
  return {
    raw: source,
    lookup: lookupSource(source, found.mapUrl),
    display: displaySource(source, found.mapUrl),
    line: sourceLine + 1,
    column: sourceColumn + 1,
  }
}

function lookupSource(source: string, mapUrl: string): string {
  if (!isRelativeSource(source)) return source
  try {
    return new URL(source, resolutionBase(mapUrl)).href
  } catch {
    return source
  }
}

function isGeneratedScript(source: string): boolean {
  const path = withoutQuery(source)
  return path.endsWith('.js') || path.endsWith('.mjs') || path.endsWith('.cjs')
}

export function resolveCallsite(frame: Callsite): Callsite {
  if (process.env.NODE_ENV === 'production') return frame
  let file = frame.file
  let line = frame.line
  let column = frame.column
  let display: Callsite = frame
  const seen = new Set<string>()

  for (let hop = 0; hop < 4; hop += 1) {
    const key = `${file}:${line}:${column}`
    if (seen.has(key)) break
    seen.add(key)
    const next = locate(file, line, column)
    if (!next) break
    display = { file: next.display, line: next.line, column: next.column }
    if (!isGeneratedScript(next.raw)) break
    file = next.lookup
    line = next.line
    column = next.column
  }

  return display
}
