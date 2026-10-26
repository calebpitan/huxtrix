import { Cause, FiberId, HashMap, Layer, List, LogLevel, Logger } from 'effect'

import { captureEffectCallsite, emitLog } from './node.js'
import type { LogFields } from './types.js'

function formatMessage(message: unknown): string {
  if (typeof message === 'string') return message
  if (typeof message === 'number' || typeof message === 'boolean' || message == null)
    return String(message)
  if (Array.isArray(message)) return message.map((part) => formatMessage(part)).join(' ')
  try {
    return JSON.stringify(message)
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(message)
  }
}

function toLevel(level: LogLevel.LogLevel): 'debug' | 'info' | 'warn' | 'error' | undefined {
  switch (level._tag) {
    case 'All':
    case 'Trace':
    case 'Debug':
      return 'debug'
    case 'Info':
      return 'info'
    case 'Warning':
      return 'warn'
    case 'Error':
    case 'Fatal':
      return 'error'
    default:
      return undefined
  }
}

const effectLogger = Logger.make((options) => {
  const level = toLevel(options.logLevel)
  if (!level) return

  const fields: LogFields = { fiberId: FiberId.threadName(options.fiberId) }
  for (const [key, value] of HashMap.toEntries(options.annotations)) {
    fields[String(key)] = value
  }
  const spans = List.toArray(options.spans).map((span) => span.label)
  if (spans.length > 0) fields.spans = spans

  const cause = Cause.isEmpty(options.cause) ? undefined : Cause.pretty(options.cause)
  emitLog(level, formatMessage(options.message), cause, fields, captureEffectCallsite())
})

const minimum = process.env.NODE_ENV === 'development' ? LogLevel.Debug : LogLevel.Info

export const LoggerLayer: Layer.Layer<never> = Layer.mergeAll(
  Logger.minimumLogLevel(minimum),
  Logger.replace(Logger.defaultLogger, effectLogger),
)
