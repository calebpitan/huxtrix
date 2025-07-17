import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'

type Transform<T, R> = (v: T) => R
const defaultMap = <T, R>(v: T) => v as unknown as R

function getServerOrigin<R = string>(
  h: ReadonlyHeaders,
  map: Transform<string, R> = defaultMap,
): R | null {
  const origin = getServerUrl(h, (v) => new URL(v).origin)

  if (origin) return map(origin)

  // Fallback to x-forwarded-proto and x-forwarded-host
  const protocol = h.get('x-forwarded-proto') ?? 'https'
  const host = h.get('x-forwarded-host') ?? h.get('host')

  if (!host) return null

  return map(protocol + '://' + host)
}

function getServerUrl<R = string>(
  h: ReadonlyHeaders,
  map: Transform<string, R> = defaultMap,
): R | null {
  const value = h.get('x-url')
  return value ? map(value) : null
}

export { getServerOrigin, getServerUrl }
