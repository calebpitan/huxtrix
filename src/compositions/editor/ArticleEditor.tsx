'use client'

import { CSSProperties, ComponentProps, useCallback, useEffect, useMemo } from 'react'
import { useRef, useState } from 'react'

import { useMotionValueEvent, useScroll } from 'motion/react'
import { TrailingBlockPlugin, Value } from 'platejs'
import { Plate, TPlateEditor, usePlateEditor } from 'platejs/react'

import { AutoformatKit } from '@/components/editor/plugins/autoformat-classic-kit'
import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { BlockPlaceholderKit } from '@/components/editor/plugins/block-placeholder-kit'
import { BlockSelectionKit } from '@/components/editor/plugins/block-selection-kit'
import { CodeBlockKit } from '@/components/editor/plugins/code-block-kit'
import { DndKit } from '@/components/editor/plugins/dnd-kit'
import { ExitBreakKit } from '@/components/editor/plugins/exit-break-kit'
import { LinkKit } from '@/components/editor/plugins/link-kit'
import { ListKit } from '@/components/editor/plugins/list-classic-kit'
import { MathKit } from '@/components/editor/plugins/math-kit'
import { SlashKit } from '@/components/editor/plugins/slash-kit'
import { EditorContainer } from '@/components/ui/editor'
import { useAppBarGeometry } from '@/compositions/appbar'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { cn } from '@/lib/utils'

import { PlainEditor, PlainEditorToolbar } from './PlainEditor'
import { useTextEditor } from './TextEditorProvider'
import { TitleEditor } from './TitleEditor'
import { ARTICLE_EDITOR_CONTENT } from './content'

export interface ArticleEditorProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  onChange?(value: string): void
}

export type ArticleEditor = TPlateEditor<Value, (typeof ArticleEditorKit)[number]>

export const ArticleEditorKit = [
  ...BasicNodesKit,
  ...LinkKit,
  ...ListKit,
  ...CodeBlockKit,
  ...MathKit,
  ...AutoformatKit,
  ...BlockPlaceholderKit,
  ...BlockSelectionKit,
  ...DndKit,
  ...ExitBreakKit,
  ...SlashKit,
  TrailingBlockPlugin,
]

export function ArticleEditor({ className, onChange, ...rest }: ArticleEditorProps) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const isXLarge = useBreakpoint('xl')

  const editorContainerRef = useRef<HTMLDivElement>(null)

  const ctx = useTextEditor()
  const value = useMemo(() => {
    try {
      return ctx.state.content ? JSON.parse(ctx.state.content) : ARTICLE_EDITOR_CONTENT
    } catch {
      return ARTICLE_EDITOR_CONTENT
    }
  }, [ctx.state.content])

  const editor = usePlateEditor({
    value,
    plugins: ArticleEditorKit,
  })

  const appbarGeom = useAppBarGeometry()

  const { scrollY } = useScroll({ container: !isXLarge ? editorContainerRef : undefined })

  useMotionValueEvent(scrollY, 'change', (y) => {
    if (y > appbarGeom.topbar.height) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  })

  const handleChange = useCallback<NonNullable<ComponentProps<typeof Plate>['onChange']>>(
    ({ value }) => {
      onChange?.(JSON.stringify(value))
    },
    [onChange],
  )

  useEffect(() => {
    const undo = () => {
      document.documentElement.style.overflowY = null!
      document.body.style.overflowY = null!
    }

    if (isXLarge) return undo()

    document.documentElement.style.overflowY = 'hidden'
    document.body.style.overflowY = 'hidden'

    return undo
  }, [isXLarge])

  return (
    <div
      className={cn(
        'grid h-full grid-flow-row',
        'grid-rows-[var(--toolbar-height)_calc(100%_-_var(--toolbar-height))]',
        '[--toolbar-height:--spacing(10)]',
        className,
      )}
      {...rest}
    >
      <Plate editor={editor} onChange={handleChange}>
        <EditorContainer className="px-2 pt-12 xl:overflow-y-visible" ref={editorContainerRef}>
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
          </div>

          <PlainEditor
            // calc(max-w-3xl /* 768px */ + --spacing(16)  /* 64px */ + --spacing(16) /* 64px */) /* = 896px */
            className="mx-auto h-fit max-w-[896px] px-5 sm:px-16"
            placeholder="What do you have to say?"
            data-editor-root={true}
          />
        </EditorContainer>

        <PlainEditorToolbar
          style={{ '--topbar-height': appbarGeom.topbar.height + 'px' } as CSSProperties}
          className={cn(
            'top-[var(--topbar-height)] z-50 -order-1 overflow-y-scroll rounded-none transition-colors lg:top-2 lg:rounded-lg',
            {
              'supports-[backdrop-filter]:bg-muted/60 backdrop-blur-2xl': scrolled,
              // use shadow instead of border so as to not take out of the available size of the
              // element which is an exact 40px used up by it's content and padding. an extra 1px
              // bottom border will reduce available size from 40px to 39px leading to overflow-y
              'shadow-[0_1px_0_0_var(--color-border)] lg:shadow-none': scrolled,
            },
          )}
        />
      </Plate>
    </div>
  )
}
