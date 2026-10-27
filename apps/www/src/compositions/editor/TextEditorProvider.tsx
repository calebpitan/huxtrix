'use client'

import { createContext, use, useMemo, useRef, useState, type RefObject } from 'react'

export type DraftType = 'post' | 'article'
export type DraftVisibility = 'everyone' | 'channel'
export type EditorMode = 'edit' | 'preview'

export type Draft = {
  type: DraftType
  title: string
  subtitle: string
  body: string
  channelId: string | null
  tags: string[]
  coverUrl: string | null
  visibility: DraftVisibility
  rewardsEnabled: boolean
  scheduledAt: string | null
}

interface EditorState {
  mode: EditorMode
}

interface TextEditorContextType {
  controller: TextEditorController
  state: EditorState
  draft: Draft
  draftRef: RefObject<Draft>
  updateDraft: (partial: Partial<Draft>) => void
  setContent: (body: string) => void
  toggleMode: () => void
}

type Events = keyof EventHandlerMap
type Handler<Args extends unknown[]> = (...args: Args) => void
interface EventHandlerMap {
  save: []
  post: []
}

const TextEditorContext = createContext<TextEditorContextType | null>(null)

class TextEditorController {
  private readonly registry = new Map<Events, CallableFunction>()

  handle<E extends Events>(event: E, handler: Handler<EventHandlerMap[E]>) {
    this.registry.set(event, handler)
  }

  save(): void {
    return void this.registry.get('save')?.()
  }

  post(): void {
    return void this.registry.get('post')?.()
  }
}

const initialDraft: Draft = {
  type: 'article',
  title: '',
  subtitle: '',
  body: '',
  channelId: null,
  tags: [],
  coverUrl: null,
  visibility: 'everyone',
  rewardsEnabled: true,
  scheduledAt: null,
}

export function useTextEditor() {
  const context = use(TextEditorContext)
  if (!context) {
    throw new Error('useTextEditor must be used within a <TextEditorProvider />')
  }
  return context
}

export function TextEditorProvider({ children }: { children: React.ReactNode }) {
  const controller = useRef<TextEditorController>(new TextEditorController())
  const [draft, setDraft] = useState<Draft>(initialDraft)
  const [mode, setMode] = useState<EditorMode>('edit')
  const draftRef = useRef(draft)
  draftRef.current = draft

  const contextValue = useMemo<TextEditorContextType>(() => {
    const updateDraft = (partial: Partial<Draft>) => {
      setDraft((current) => {
        const next = { ...current, ...partial }
        draftRef.current = next
        return next
      })
    }

    return {
      controller: controller.current,
      state: { mode },
      draft,
      draftRef,
      updateDraft,
      setContent(body) {
        updateDraft({ body })
      },
      toggleMode() {
        setMode((current) => (current === 'edit' ? 'preview' : 'edit'))
      },
    }
  }, [draft, mode])

  return <TextEditorContext value={contextValue}>{children}</TextEditorContext>
}
