'use client'

import { ComponentProps, useCallback, useEffect, useMemo, useRef } from 'react'

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
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { cn } from '@/lib/utils'

import { PlainEditor, PlainEditorToolbar } from './PlainEditor'
import { useTextEditor } from './TextEditorProvider'
import { TitleEditor } from './TitleEditor'
import { ArticlePreviewHeading } from './article-preview-heading'
import { ChannelChip } from './channel-chip'
import { CoverChip } from './cover-chip'
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
  const isXLarge = useBreakpoint('xl')

  const editorContainerRef = useRef<HTMLDivElement>(null)

  const ctx = useTextEditor()
  const previewing = ctx.state.mode === 'preview' && ctx.draft.type === 'article'
  const showToolbar = ctx.draft.type === 'article' && ctx.state.mode !== 'preview'
  const value = useMemo<Value>(() => plateValueFromBody(ctx.draft.body), [ctx.draft.body])

  const editor: ArticleEditor = usePlateEditor({
    value,
    plugins: ArticleEditorKit,
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
    <div className={cn('flex h-full min-h-0 flex-col', className)} {...rest}>
      <Plate editor={editor} onChange={handleChange} readOnly={previewing}>
        {showToolbar ? (
          <div className="sticky top-[var(--create-header-height,0px)] z-30 w-full shrink-0 bg-background px-2 pt-3.5">
            <div className="flex w-full max-w-3xl justify-center">
              <PlainEditorToolbar className="bg-muted/30" />
            </div>
          </div>
        ) : null}
        <EditorContainer
          key={previewing ? 'preview' : 'edit'}
          className="h-auto min-h-0 flex-1 px-2 pt-12 xl:overflow-y-visible"
          ref={editorContainerRef}
        >
          <div className="flex w-full max-w-3xl flex-col gap-6">
            <div className="flex flex-col gap-6 ps-6">
              {previewing ? null : (
                <div className="flex items-center gap-2">
                  <ChannelChip />
                  <CoverChip />
                </div>
              )}
              <div className="flex flex-col gap-2">
                {previewing ? (
                  <ArticlePreviewHeading title={ctx.draft.title} subtitle={ctx.draft.subtitle} />
                ) : (
                  <>
                    <TitleEditor
                      id="title-editor"
                      className="py-2 text-5xl font-extrabold tracking-tighter"
                      placeholder="Title"
                      maxLength={192}
                      value={ctx.draft.title}
                      onChange={(event) =>
                        ctx.updateDraft({ title: event.target.value.replace(/\n/g, '') })
                      }
                    />
                    <TitleEditor
                      id="subtitle-editor"
                      className="text-foreground/70 py-1 text-lg font-medium"
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
              variant="none"
              className="h-fit pb-72 ps-6"
              placeholder={
                previewing ? undefined : 'Type / to insert a heading, image, code block…'
              }
              data-editor-root={true}
            />
          </div>
        </EditorContainer>
      </Plate>
    </div>
  )
}
