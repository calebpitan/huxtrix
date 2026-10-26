import * as util from 'node:util'
import { AsyncLocalStorage } from 'node:async_hooks'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import pino from 'pino'

import { type Callsite, withCallsite } from './caller.js'
import { type LogFields, type LogLevel, type Logger } from './types.js'

interface NodeCallSite {
  functionName: string | null
  scriptName: string | null
  lineNumber: number | null
  columnNumber: number | null
}

interface Flushable {
  flushSync?: () => void
}

const require = createRequire(import.meta.url)

function assertNodeVersion() {
  const [major = 0, minor = 0] = process.versions.node.split('.').map(Number)
  if (major < 22 || (major === 22 && minor < 14)) {
    throw new Error(
      `@hux/logger requires Node.js >= 22.14.0 for util.getCallSites. Current: ${process.version}`,
    )
  }
}

assertNodeVersion()
process.setSourceMapsEnabled(true)

const getCallSites = (
  util as typeof util & {
    getCallSites?: (frameCount?: number, options?: { sourceMap?: boolean }) => NodeCallSite[]
  }
).getCallSites

function readCallSites(frameCount: number): NodeCallSite[] {
  if (typeof getCallSites !== 'function') return []
  return getCallSites(frameCount, { sourceMap: true })
}

function normalizeFile(scriptName: string): string {
  let file = scriptName
  if (file.startsWith('file:')) {
    try {
      file = fileURLToPath(file)
    } catch {
      return scriptName
    }
  }
  if (path.isAbsolute(file)) {
    const relative = path.relative(process.cwd(), file)
    if (relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)) return relative
  }
  return file
}

function toCallsite(site: NodeCallSite | undefined): Callsite | undefined {
  if (!site?.scriptName || site.lineNumber == null) return undefined
  return {
    file: normalizeFile(site.scriptName),
    line: site.lineNumber,
    column: site.columnNumber ?? 0,
  }
}

/**
 * Called from write, after the level check.
 * Frames: readCallSites, callsiteOfCaller, write, the logger method, then the caller.
 */
function callsiteOfCaller(): Callsite | undefined {
  return toCallsite(readCallSites(5)[4])
}

function isLoggerScript(script: string) {
  return (
    script.includes(`${path.sep}packages${path.sep}logger${path.sep}`) ||
    script.includes('/@hux/logger/')
  )
}

function isEffectScript(script: string) {
  return (
    script.includes(`${path.sep}node_modules${path.sep}effect${path.sep}`) ||
    script.includes('/node_modules/effect/')
  )
}

export function captureEffectCallsite(): Callsite | undefined {
  let fallback: Callsite | undefined
  for (const site of readCallSites(30)) {
    const script = site.scriptName ?? ''
    if (!script || script.startsWith('node:') || script.includes('node:internal')) continue
    const callsite = toCallsite(site)
    if (!callsite || isLoggerScript(script)) continue
    if (isEffectScript(script)) {
      fallback ??= callsite
      continue
    }
    return callsite
  }
  return fallback
}

function resolveLevel(): pino.Level {
  const configured = process.env.LOG_LEVEL
  if (
    configured === 'fatal' ||
    configured === 'error' ||
    configured === 'warn' ||
    configured === 'info' ||
    configured === 'debug' ||
    configured === 'trace'
  ) {
    return configured
  }
  return process.env.NODE_ENV === 'development' ? 'debug' : 'info'
}

function loadDestination(): Flushable {
  if (process.env.NODE_ENV === 'development') {
    const pretty = require('pino-pretty') as (options: { colorize: boolean }) => Flushable
    return pretty({ colorize: true })
  }
  // A frozen serverless isolate does not emit exit, so buffered writes can be dropped.
  return pino.destination({ sync: process.env.VERCEL === '1' })
}

const destination = loadDestination()

const SECRET_KEYS = new Set(['password', 'token', 'authorization', 'cookie', 'email'])

function isMessageList(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function pathKey(path: ReadonlyArray<string | symbol>): string | undefined {
  for (let index = path.length - 1; index >= 0; index -= 1) {
    const part = path[index]
    if (typeof part === 'string') return part
  }
  return undefined
}

/** Field-error lists (`fields.email: ['Invalid email']`) stay visible. Secret values are removed. */
function censorSecret(value: unknown, path: ReadonlyArray<string | symbol>): unknown {
  const key = pathKey(path)
  if (key !== undefined && SECRET_KEYS.has(key) && isMessageList(value)) return value
  return '[Redacted]'
}

const rootPino = pino(
  {
    level: resolveLevel(),
    base: { service: process.env.LOG_SERVICE ?? 'www' },
    redact: {
      paths: [
        'password',
        'token',
        'authorization',
        'cookie',
        'email',
        '*.password',
        '*.token',
        '*.authorization',
        '*.cookie',
        '*.email',
        'headers.authorization',
        'headers.cookie',
      ],
      censor: censorSecret,
    },
  },
  destination as pino.DestinationStream,
)

function reportFlushFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`[logger] flush failed: ${message}\n`)
}

function flushSyncSafe() {
  const flushSync = destination.flushSync
  if (typeof flushSync !== 'function') return
  try {
    flushSync.call(destination)
  } catch (error) {
    reportFlushFailure(error)
  }
}

function errorPayload(error: unknown): LogFields {
  if (error === undefined) return {}
  if (error instanceof Error) return { err: error }
  if (typeof error === 'string') return { err: { message: error } }
  try {
    return { err: { message: util.inspect(error, { depth: 6, breakLength: Infinity }) } }
  } catch {
    return { err: { message: 'Unserializable log value' } }
  }
}

function write(
  target: pino.Logger,
  level: LogLevel,
  message: string,
  error: unknown,
  fields: LogFields | undefined,
  resolveSite: () => Callsite | undefined,
) {
  if (!target.isLevelEnabled(level)) return
  const payload = { ...withCallsite(fields, resolveSite()), ...errorPayload(error) }
  target[level](payload, message)
}

const pinoOf = new WeakMap<Logger, pino.Logger>()

function createLogger(target: pino.Logger): Logger {
  const logger: Logger = {
    debug(message, fields) {
      write(target, 'debug', message, undefined, fields, callsiteOfCaller)
    },
    info(message, fields) {
      write(target, 'info', message, undefined, fields, callsiteOfCaller)
    },
    warn(message, fields) {
      write(target, 'warn', message, undefined, fields, callsiteOfCaller)
    },
    error(message, error, fields) {
      write(target, 'error', message, error, fields, callsiteOfCaller)
    },
    child(bindings) {
      return createLogger(target.child(bindings))
    },
  }
  pinoOf.set(logger, target)
  return logger
}

const rootLogger = createLogger(rootPino)
const storage = new AsyncLocalStorage<Logger>()

export function getLogger(): Logger {
  return storage.getStore() ?? rootLogger
}

export function emitLog(
  level: LogLevel,
  message: string,
  error: unknown,
  fields: LogFields | undefined,
  site: Callsite | undefined,
) {
  write(pinoOf.get(getLogger()) ?? rootPino, level, message, error, fields, () => site)
}

export function withLogContext<T>(bindings: LogFields, fn: () => T): T {
  return storage.run(getLogger().child(bindings), fn)
}

process.on('exit', flushSyncSafe)
process.on('beforeExit', flushSyncSafe)
