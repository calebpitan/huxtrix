import { type Callsite, withCallsite } from './caller.js'
import { resolveCallsite } from './resolve-callsite.js'
import { type LogFields, type LogLevel, type Logger } from './types.js'

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const minimum: LogLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'warn'

const LOGGER_METHODS = new Set(['debug', 'info', 'warn', 'error', 'child', 'callsiteOfCaller'])

function enabled(level: LogLevel) {
  return LEVEL_RANK[level] >= LEVEL_RANK[minimum]
}

function parseFrame(line: string): (Callsite & { functionName?: string }) | undefined {
  const chrome = /^\s*at (?:async )?(.+?) \((.+):(\d+):(\d+)\)\s*$/.exec(line)
  const chromeBare = /^\s*at (?:async )?(.+):(\d+):(\d+)\s*$/.exec(line)
  const firefox = /^(?:(.*?)@)?(.+):(\d+):(\d+)$/.exec(line.trim())
  const match =
    chrome ?? (chromeBare ? ['', '', chromeBare[1], chromeBare[2], chromeBare[3]] : firefox)
  if (!match) return undefined
  const file = match[2]
  const lineNumber = Number(match[3])
  const column = Number(match[4])
  if (!file || Number.isNaN(lineNumber) || Number.isNaN(column)) return undefined
  return { functionName: match[1], file, line: lineNumber, column }
}

function isLoggerFrame(frame: { functionName?: string; file: string }) {
  const name = frame.functionName?.slice(frame.functionName.lastIndexOf('.') + 1)
  if (name && LOGGER_METHODS.has(name)) return true
  return frame.file.includes('packages/logger/') || frame.file.includes('@hux/logger')
}

function callsiteOfCaller(): Callsite | undefined {
  const lines = new Error().stack?.split('\n') ?? []
  for (const line of lines.slice(3)) {
    const frame = parseFrame(line)
    if (!frame) continue
    const resolved = resolveCallsite({ file: frame.file, line: frame.line, column: frame.column })
    if (isLoggerFrame({ functionName: frame.functionName, file: resolved.file })) continue
    return resolved
  }
  return undefined
}

function write(
  bindings: LogFields,
  level: LogLevel,
  message: string,
  error: unknown,
  fields?: LogFields,
) {
  if (!enabled(level)) return
  const payload = { ...bindings, ...withCallsite(fields, callsiteOfCaller()) }
  const consoleMethod = level === 'debug' ? 'debug' : level === 'info' ? 'info' : level
  if (error === undefined) {
    console[consoleMethod](message, payload)
    return
  }
  console[consoleMethod](message, error, payload)
}

function createLogger(bindings: LogFields): Logger {
  return {
    debug(message, fields) {
      write(bindings, 'debug', message, undefined, fields)
    },
    info(message, fields) {
      write(bindings, 'info', message, undefined, fields)
    },
    warn(message, fields) {
      write(bindings, 'warn', message, undefined, fields)
    },
    error(message, error, fields) {
      write(bindings, 'error', message, error, fields)
    },
    child(next) {
      return createLogger({ ...bindings, ...next })
    },
  }
}

let current = createLogger({})

export function getLogger(): Logger {
  return current
}

export function withLogContext<T>(bindings: LogFields, fn: () => T): T {
  const previous = current
  current = current.child(bindings)
  try {
    return fn()
  } finally {
    // Native async/await never calls Promise.prototype.then, so the context
    // cannot follow a continuation. Capture the logger before the first await.
    current = previous
  }
}
