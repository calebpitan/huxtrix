import { CSSProperties, ComponentProps, useCallback, useMemo, useState } from 'react'

import { useMotionValueEvent, useScroll } from 'motion/react'
import { Descendant, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, withReact } from 'slate-react'

import { useAppBarGeometry } from '@/compositions/appbar'
import { cn } from '@/lib/utils'

import { LinkPrompt } from './LinkPrompt'
import { PlainEditor, PlainEditorToolbar } from './PlainEditor'
import { useTextEditor } from './TextEditorProvider'
import { TitleEditor } from './TitleEditor'
import { commands } from './plain/commands'
import { CustomEditor, CustomElement, withCustomization } from './plain/customization'

export interface ArticleEditorProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  onChange?(value: string): void
}

const TOOLBAR_COMMANDS = [
  commands.undo,
  commands.redo,
  commands.divider,
  commands.group('typography', [
    commands.paragraph,
    commands.heading1,
    commands.heading2,
    commands.heading3,
    commands.heading4,
    commands.heading5,
    commands.heading6,
  ]),
  commands.divider,
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.code,
  commands.divider,
  commands.prompt(commands.link, ({ editor, onConfirm, ...props }) => {
    const entry = CustomElement.find(editor, true, (el) => el.type === 'link')
    const [{ url, og, children }] = entry || [{}, []]
    const data: React.ComponentProps<typeof LinkPrompt>['data'] = {
      og,
      url,
      text: children ? CustomElement.texts(children) : CustomEditor.getSelectedText(editor),
    }

    return (
      <LinkPrompt
        data={data}
        onConfirm={({ text, url, og }) => {
          commands.link.execute(editor, { text, url, og })
          onConfirm()
        }}
        {...props}
      />
    )
  }),
  commands.divider,
  commands.ul,
  commands.ol,
]

const initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }]

export function ArticleEditor({ className, onChange, ...rest }: ArticleEditorProps) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const editor = useMemo(() => withCustomization(withHistory(withReact(createEditor()))), [])

  const ctx = useTextEditor()
  const appbarGeom = useAppBarGeometry()

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    if (y > appbarGeom.topbar.height) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  })

  const value = useMemo(() => {
    try {
      return ctx.state.content ? JSON.parse(ctx.state.content) : initialValue
    } catch {
      return initialValue
    }
  }, [ctx.state.content])

  const handleChange = useCallback((v: Descendant[]) => onChange?.(JSON.stringify(v)), [onChange])

  return (
    <div className={cn('grid auto-cols-auto grid-flow-row gap-12', className)} {...rest}>
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <div className="px-page flex w-full max-w-3xl flex-col gap-8 justify-self-center">
          <div className="flex flex-col gap-2">
            <TitleEditor
              id="title-editor"
              className="py-2 text-4xl font-extrabold"
              placeholder="Title"
              maxLength={192}
              value={title}
              onChange={(e) => setTitle(e.target.value.replace(/\n/g, ''))}
            />
            <TitleEditor
              id="subtitle-editor"
              className="text-foreground/70 py-1 text-lg font-light"
              placeholder="Subtitle if you like..."
              maxLength={128}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value.replace(/\n/g, ''))}
            />
          </div>

          <PlainEditor placeholder="What do you have to say?" />
        </div>

        <PlainEditorToolbar
          style={{ '--topbar-height': appbarGeom.topbar.height + 'px' } as CSSProperties}
          className={cn(
            'bg-background',
            'sticky top-[var(--topbar-height)] z-45 -order-1 items-center justify-center',
            'backdrop-blur-2xl lg:top-0 lg:w-full lg:justify-self-center lg:rounded-none',
            { 'border-b': scrolled },
          )}
          commands={TOOLBAR_COMMANDS}
        />
      </Slate>
    </div>
  )
}
