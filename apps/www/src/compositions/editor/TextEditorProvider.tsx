'use client'

import { type RefObject, createContext, use, useMemo, useRef, useState } from 'react'

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
  saved: boolean
  updateDraft: (partial: Partial<Draft>) => void
  setContent: (body: string) => void
  markSaved: () => void
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

function snapshotDraft(draft: Draft): Draft {
  return { ...draft, tags: [...draft.tags] }
}

function draftsEqual(a: Draft, b: Draft) {
  return (
    a.type === b.type &&
    a.title === b.title &&
    a.subtitle === b.subtitle &&
    a.body === b.body &&
    a.channelId === b.channelId &&
    a.coverUrl === b.coverUrl &&
    a.visibility === b.visibility &&
    a.rewardsEnabled === b.rewardsEnabled &&
    a.scheduledAt === b.scheduledAt &&
    a.tags.length === b.tags.length &&
    a.tags.every((tag, index) => tag === b.tags[index])
  )
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
  const [savedDraft, setSavedDraft] = useState<Draft | null>(null)
  const draftRef = useRef(draft)
  draftRef.current = draft
  const saved = savedDraft !== null && draftsEqual(draft, savedDraft)

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
      saved,
      updateDraft,
      setContent(body) {
        updateDraft({ body })
      },
      markSaved() {
        setSavedDraft(snapshotDraft(draftRef.current))
      },
      toggleMode() {
        setMode((current) => (current === 'edit' ? 'preview' : 'edit'))
      },
    }
  }, [draft, mode, saved])

  return <TextEditorContext value={contextValue}>{children}</TextEditorContext>
}
