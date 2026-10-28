'use client'

import { useMemo } from 'react'

import { KEYS, NodeApi, type TElement, type Value } from 'platejs'
import { useEditorRef, useSelectionVersion, useValueVersion } from 'platejs/react'

import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'

const HEADING_TYPES = new Set<string>([KEYS.h1, KEYS.h2, KEYS.h3])

interface OutlineHeading {
  path: number[]
  text: string
}

function headingsFromValue(value: Value | null | undefined): OutlineHeading[] {
  if (!value) return []

  return value.flatMap((node, index) => {
    if (!isHeading(node)) return []
    return [{ path: [index], text: NodeApi.string(node).trim() }]
  })
}

function isHeading(node: TElement): boolean {
  return HEADING_TYPES.has(node.type)
}

function scrollableAncestor(node: HTMLElement) {
  let parent = node.parentElement

  while (parent && parent !== document.body && parent !== document.documentElement) {
    const { overflowX, overflowY } = getComputedStyle(parent)
    // overflow-x: hidden makes overflow-y compute to auto. That box is as tall as
    // the article, so scrolling it does not move the page.
    const forcedByHiddenX = overflowX === 'hidden' && overflowY === 'auto'
    const scrolls = (overflowY === 'auto' || overflowY === 'scroll') && !forcedByHiddenX
    if (scrolls && parent.scrollHeight > parent.clientHeight + 1) return parent
    parent = parent.parentElement
  }

  return null
}

function stickyCoverBottom() {
  const toolbar = document.querySelector('[role="toolbar"]')
  const band = toolbar?.closest('[class*="sticky"]')
  const header = [...document.querySelectorAll('header')].find(
    (el) => getComputedStyle(el).display !== 'none',
  )
  const bottoms = [band, header]
    .filter((el): el is HTMLElement => el instanceof HTMLElement)
    .map((el) => el.getBoundingClientRect().bottom)

  return bottoms.length ? Math.max(...bottoms) : 0
}

function scrollHeadingIntoView(node: HTMLElement) {
  const scroller = scrollableAncestor(node)

  if (scroller) {
    const delta = node.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 24
    scroller.scrollBy({ top: delta })
    return
  }

  const delta = node.getBoundingClientRect().top - stickyCoverBottom() - 24
  window.scrollBy({ top: delta })
}

export function ArticleOutline() {
  const editor = useEditorRef()
  // These versions re-render the list. Reading children or the selection through
  // Plate's tracked selectors throws until the primary editor has registered.
  const valueVersion = useValueVersion()
  const selectionVersion = useSelectionVersion()
  const debouncedVersion = useDebounce(valueVersion, 200)
  const headings = useMemo(() => {
    if (typeof debouncedVersion !== 'number') return []
    return headingsFromValue(editor.children)
  }, [debouncedVersion, editor])

  const blockIndex = selectionVersion ? editor.selection?.anchor.path[0] : undefined
  let activeIndex = -1
  if (blockIndex !== undefined) {
    for (let index = 0; index < headings.length; index++) {
      if (headings[index].path[0] <= blockIndex) activeIndex = index
      else break
    }
  }

  function focusHeading(path: number[]) {
    editor.tf.select(path, { edge: 'start' })
    editor.tf.focus()
    const entry = editor.api.node(path)
    const node = entry ? editor.api.toDOMNode(entry[0]) : null
    if (!(node instanceof HTMLElement)) return

    scrollHeadingIntoView(node)
    // The editor focus scrolls on a later frame and can stop short of the heading.
    window.setTimeout(() => scrollHeadingIntoView(node), 50)
  }

  return (
    <section>
      <h2 className="text-sm font-semibold">Outline</h2>
      {headings.length === 0 ? (
        <p className="text-muted-foreground mt-4 text-sm">No headings yet</p>
      ) : (
        <div className="relative mt-3 flex flex-col">
          <div aria-hidden className="bg-foreground/15 pointer-events-none absolute inset-y-0 left-0 w-0.5" />
          {headings.map((heading, index) => {
            const active = index === activeIndex
            const label = heading.text || 'Untitled'

            return (
              <Button
                key={heading.path.join('.')}
                type="button"
                variant="ghost"
                size="sm"
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'relative w-full min-w-0 justify-start pl-5 text-left font-normal',
                  active ? 'font-semibold text-foreground' : 'text-muted-foreground',
                )}
                onClick={() => focusHeading(heading.path)}
              >
                {active ? (
                  <span
                    aria-hidden
                    className="bg-foreground pointer-events-none absolute inset-y-0 left-0 w-0.5"
                  />
                ) : null}
                <span className={cn('min-w-0 truncate', !heading.text && 'text-muted-foreground')}>
                  {label}
                </span>
              </Button>
            )
          })}
        </div>
      )}
    </section>
  )
}
