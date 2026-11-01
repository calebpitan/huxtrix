'use client'

import { useTextEditor } from '@/compositions/editor'

const TECH_GUIDELINES = [
  'Show your work with code, steps or screenshots.',
  'Credit sources and link to the original.',
  'Keep promotion out of the main post.',
]

const SHARED_PLACEHOLDER = 'Guidelines for this channel will go here.'

export function ChannelGuidelines() {
  const { draft } = useTextEditor()
  if (!draft.channelId) return null

  const lines = draft.channelId === 'Tech' ? TECH_GUIDELINES : [SHARED_PLACEHOLDER]

  return (
    <section className="bg-muted/30 rounded-2xl p-5">
      <h2 className="text-sm font-semibold">Channel guidelines</h2>
      <ul className="text-muted-foreground mt-3 list-disc space-y-3 pl-4 text-sm leading-snug">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  )
}
