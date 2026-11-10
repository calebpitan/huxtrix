'use client'

import { type ComponentProps, type ReactNode, useCallback, useRef } from 'react'

import { CodePlugin } from '@platejs/basic-nodes/react'

import { type Descendant } from 'platejs'
import { ParagraphPlugin, Plate, createPlatePlugin, usePlateEditor } from 'platejs/react'

import { LinkKit } from '@/components/editor/plugins/link-kit'
import { CodeLeaf } from '@/components/ui/code-node'
import { ParagraphElement } from '@/components/ui/paragraph-node'
import { useTextEditor } from '@/compositions/editor'

import { flattenPostFragment, postParagraphValue, serializePostBody } from './body'

const singleParagraphPlugin = createPlatePlugin({
  key: 'singleParagraph',
}).overrideEditor(({ tf: { insertFragment, insertText } }) => ({
  transforms: {
    insertBreak() {
      insertText('\n')
    },
    insertSoftBreak() {
      insertText('\n')
    },
    insertFragment(fragment) {
      insertFragment(flattenPostFragment(fragment as Descendant[]) as typeof fragment)
    },
  },
}))

const PostComposerKit = [
  ParagraphPlugin.withComponent(ParagraphElement),
  CodePlugin.configure({
    node: { component: CodeLeaf },
    shortcuts: { toggle: { keys: 'mod+e' } },
  }),
  ...LinkKit,
  singleParagraphPlugin,
]

export function PostComposerPlate({ children }: { children: ReactNode }) {
  const { draft, setContent, state } = useTextEditor()
  const initialValue = useRef(postParagraphValue(draft.body))
  const baseline = useRef(serializePostBody(initialValue.current))
  const edited = useRef(false)
  const previewing = state.mode === 'preview'

  const editor = usePlateEditor({
    value: initialValue.current,
    plugins: PostComposerKit,
  })

  const handleChange = useCallback<NonNullable<ComponentProps<typeof Plate>['onChange']>>(
    ({ value }) => {
      const next = serializePostBody(value)
      if (!edited.current) {
        if (next === baseline.current) return
        edited.current = true
      }
      setContent(next)
    },
    [setContent],
  )

  return (
    <Plate editor={editor} onChange={handleChange} readOnly={previewing}>
      {children}
    </Plate>
  )
}
