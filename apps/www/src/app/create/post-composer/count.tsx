'use client'

import { useEditorSelector } from 'platejs/react'

import {
  POST_GRAPHEME_LIMIT,
  graphemeCount,
  platePlainText,
} from '@/compositions/editor/draft-text'
import { cn } from '@/lib/utils'

const countLabel = `${POST_GRAPHEME_LIMIT} / ${POST_GRAPHEME_LIMIT}`

export function GraphemeCount() {
  const text = useEditorSelector((editor) => platePlainText(editor.children), [])
  const used = graphemeCount(text)
  const over = used > POST_GRAPHEME_LIMIT
  const size = 16
  const strokeWidth = 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(used / POST_GRAPHEME_LIMIT, 1)
  const dash = circumference * progress

  return (
    <span
      className={cn(
        'relative ms-auto inline-block shrink-0 overflow-hidden whitespace-nowrap font-mono text-xs',
        over ? 'text-destructive' : 'text-muted-foreground',
      )}
      aria-label={`${used} of ${POST_GRAPHEME_LIMIT} characters`}
    >
      <span className="invisible flex items-center gap-2" aria-hidden>
        <span className="inline-block shrink-0" style={{ width: size, height: size }} />
        {countLabel}
      </span>
      <span className="absolute inset-0 flex items-center gap-2">
        <svg
          className="shrink-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted-foreground/25"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap={progress > 0 ? 'round' : 'butt'}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className={over ? 'stroke-destructive' : 'stroke-cyan-500 dark:stroke-cyan-400'}
          />
        </svg>
        <span className="min-w-0 flex-1 text-end">
          {used} / {POST_GRAPHEME_LIMIT}
        </span>
      </span>
    </span>
  )
}
