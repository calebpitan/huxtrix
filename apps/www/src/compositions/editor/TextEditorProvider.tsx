'use client'

import { createContext, use, useMemo, useRef, useState } from 'react'

interface EditorState {
  content: string
  mode: 'edit' | 'preview'
}

interface TextEditorContextType {
  controller: TextEditorController
  state: EditorState
  setContent: (content: string) => void
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

export function useTextEditor() {
  const context = use(TextEditorContext)
  if (!context) {
    throw new Error('useTextEditor must be used within a <TextEditorProvider />')
  }
  return context
}

export function TextEditorProvider({ children }: { children: React.ReactNode }) {
  const controller = useRef<TextEditorController>(new TextEditorController())
  const [state, setState] = useState<EditorState>({ content: '', mode: 'edit' })

  const contextValue = useMemo<TextEditorContextType>(() => {
    return {
      controller: controller.current,
      state,
      setContent(content) {
        setState((state) => ({ ...state, content }))
      },
      toggleMode() {
        setState((state) => ({
          ...state,
          mode: state.mode === 'edit' ? 'preview' : 'edit',
        }))
      },
    }
  }, [controller, state])

  return <TextEditorContext value={contextValue}>{children}</TextEditorContext>
}
