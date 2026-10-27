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
import { SuggestionKit } from '@/components/editor/plugins/suggestion-kit'
import { EditorContainer } from '@/components/ui/editor'
import { useAppBarGeometry } from '@/compositions/appbar'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { cn } from '@/lib/utils'

import { PlainEditor, PlainEditorToolbar } from './PlainEditor'
import { useTextEditor } from './TextEditorProvider'
import { TitleEditor } from './TitleEditor'
import { platePlainText } from './draft-text'

export interface ArticleEditorProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  onChange?: (value: string) => void
}

export type ArticleEditor = TPlateEditor<Value, (typeof ArticleEditorKit)[number]>

const EMPTY_PLATE_VALUE: Value = [{ type: 'p', children: [{ text: '' }] }]

function plateValueFromBody(body: string): Value {
  if (!body) return EMPTY_PLATE_VALUE
  try {
    const parsed: unknown = JSON.parse(body)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Value
  } catch {
    return EMPTY_PLATE_VALUE
  }
  return EMPTY_PLATE_VALUE
}

function serializePlateBody(value: Value): string {
  return platePlainText(value).trim().length === 0 ? '' : JSON.stringify(value)
}

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
  ...SuggestionKit,
  TrailingBlockPlugin,
]

export function ArticleEditor({ className, onChange, ...rest }: ArticleEditorProps) {
  const [scrolled, setScrolled] = useState(false)

  const isXLarge = useBreakpoint('xl')

  const editorContainerRef = useRef<HTMLDivElement>(null)

  const ctx = useTextEditor()
  const previewing = ctx.state.mode === 'preview' && ctx.draft.type === 'article'
  const value = useMemo<Value>(() => plateValueFromBody(ctx.draft.body), [ctx.draft.body])

  const editor: ArticleEditor = usePlateEditor({
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
      onChange?.(serializePlateBody(value))
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
        previewing
          ? 'grid-rows-[minmax(0,1fr)]'
          : 'grid-rows-[var(--toolbar-height)_calc(100%_-_var(--toolbar-height))] [--toolbar-height:--spacing(10)]',
        className,
      )}
      {...rest}
    >
      <Plate editor={editor} onChange={handleChange} readOnly={previewing}>
        <EditorContainer
          key={previewing ? 'preview' : 'edit'}
          className="px-2 pt-12 xl:overflow-y-visible"
          ref={editorContainerRef}
        >
          <div className="px-page flex w-full max-w-3xl flex-col gap-8 justify-self-center">
            <div className="flex flex-col gap-2">
              {previewing ? (
                <>
                  {ctx.draft.title ? (
                    <p className="break-words py-2 text-4xl font-extrabold">{ctx.draft.title}</p>
                  ) : null}
                  {ctx.draft.subtitle ? (
                    <p className="text-foreground/70 break-words py-1 text-lg font-light">
                      {ctx.draft.subtitle}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <TitleEditor
                    id="title-editor"
                    className="py-2 text-4xl font-extrabold"
                    placeholder="Title"
                    maxLength={192}
                    value={ctx.draft.title}
                    onChange={(event) =>
                      ctx.updateDraft({ title: event.target.value.replace(/\n/g, '') })
                    }
                  />
                  <TitleEditor
                    id="subtitle-editor"
                    className="text-foreground/70 py-1 text-lg font-light"
                    placeholder="Subtitle if you like..."
                    maxLength={128}
                    value={ctx.draft.subtitle}
                    onChange={(event) =>
                      ctx.updateDraft({ subtitle: event.target.value.replace(/\n/g, '') })
                    }
                  />
                </>
              )}
            </div>
          </div>

          <PlainEditor
            // calc(max-w-3xl /* 768px */ + --spacing(16)  /* 64px */ + --spacing(16) /* 64px */) /* = 896px */
            className="mx-auto h-fit max-w-[896px] px-5 sm:px-16"
            placeholder={previewing ? undefined : 'What do you have to say?'}
            data-editor-root={true}
          />
        </EditorContainer>

        {!previewing && (
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
        )}
      </Plate>
    </div>
  )
}
