import { Fragment, useEffect, useMemo, useState } from 'react'

import { PopoverArrow } from '@radix-ui/react-popover'

import { cva } from 'class-variance-authority'
import { Path } from 'slate'
import { ReactEditor, RenderElementProps, RenderLeafProps, useFocused, useSlate } from 'slate-react'

import { PopoverArrowGraphic } from '@/components/popover/arrow'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useTimeout } from '@/hooks/use-timeout'
import { cn } from '@/lib/utils'

import { CustomEditor, CustomElement } from './customization'

const variants = cva('', {
  variants: {
    component: {
      paragraph: 'mb-5',
      heading: 'text-foreground my-6',
      list: 'list-outside mb-5',
      listitem: 'ms-8 mt-2 ps-2',
      link: 'text-blue-700 dark:text-blue-400 underline-offset-4 underline',
      'link-popover':
        'supports-[backdrop-filter]:bg-muted/60 z-40 rounded-xl p-2 backdrop-blur-2xl',
    },
    level: {
      '1': 'text-4xl font-black',
      '2': 'text-3xl font-black',
      '3': 'text-2xl font-extrabold',
      '4': 'text-xl font-extrabold',
      '5': 'text-lg font-bold',
      '6': 'text-base font-bold',
    },
    listType: {
      ol: 'list-decimal',
      ul: 'list-disc',
    },
    preview: { true: '', false: '' },
  },
  compoundVariants: [
    {
      component: 'link',
      preview: true,
      className:
        'inline-block max-w-65 min-w-0 overflow-hidden text-sm text-nowrap text-ellipsis whitespace-nowrap',
    },
    {
      component: 'link',
      preview: false,
      className: '',
    },
  ],
})

export function Leaf(props: RenderLeafProps) {
  let { children } = props
  const { attributes, leaf } = props

  if (leaf.bold) children = <strong>{children}</strong>
  if (leaf.code) children = <code className="bg-muted rounded-md p-0.5 font-mono text-sm">{children}</code>
  if (leaf.italic) children = <em>{children}</em>
  if (leaf.strikethrough) children = <s>{children}</s>
  // if (leaf.underline) children = <u>{children}</u>

  return (
    <span
      // The following is a workaround for a Chromium bug where,
      // if you have an inline at the end of a block,
      // clicking the end of a block puts the cursor inside the inline
      // instead of inside the final {text: ''} node
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      className={cn({ 'ps-[0.1px]': leaf.text === '' })}
      {...attributes}
    >
      {children}
    </span>
  )
}

export function Element(props: RenderElementProps) {
  const { element, ...rest } = props

  switch (element.type) {
    case 'heading':
      return <Heading element={element} {...rest} />
    case 'paragraph':
      return <Paragraph element={element} {...rest} />
    case 'list':
      return <List element={element} {...rest} />
    case 'link':
      return <Link element={element} {...rest} />
    case 'list-item':
      return <ListItem element={element} {...rest} />
    case 'line-break':
      return <LineBreak element={element} {...rest} />
  }
}

/**
 * Put this at the start and end of an inline component to work around this Chromium bug:
 * https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
 */
function InlineChromiumBugfix() {
  return (
    <span contentEditable={false} style={{ fontSize: 0 }}>
      {String.fromCodePoint(160) /* Non-breaking space */}
    </span>
  )
}

interface HeadingProps extends Omit<RenderElementProps, 'element'> {
  element: Extract<CustomElement, { type: 'heading' }>
}

function Heading({ children, element, attributes, ...props }: HeadingProps) {
  const Tag = `h${element.level}` as const

  return (
    <Tag
      className={variants({ component: 'heading', level: element.level })}
      {...attributes}
      {...props}
    >
      {children}
    </Tag>
  )
}

interface ParagraphProps extends Omit<RenderElementProps, 'element'> {
  element: Extract<CustomElement, { type: 'paragraph' }>
}

function Paragraph({ children, element: _, attributes, ...props }: ParagraphProps) {
  return (
    <p className={variants({ component: 'paragraph' })} {...attributes} {...props}>
      {children}
    </p>
  )
}

interface ListProps extends Omit<RenderElementProps, 'element'> {
  element: Extract<CustomElement, { type: 'list' }>
}

function List({ children, element, attributes, ...props }: ListProps) {
  const Tag = element.variant === 'ordered-list' ? 'ol' : 'ul'
  return (
    <Tag className={variants({ component: 'list', listType: Tag })} {...attributes} {...props}>
      {children}
    </Tag>
  )
}

interface ListItemProps extends Omit<RenderElementProps, 'element'> {
  element: Extract<CustomElement, { type: 'list-item' }>
}

function ListItem({ children, element: _, attributes, ...props }: ListItemProps) {
  return (
    <li className={variants({ component: 'listitem' })} {...attributes} {...props}>
      {children}
    </li>
  )
}

interface LinkProps extends Omit<RenderElementProps, 'element'> {
  element: Extract<CustomElement, { type: 'link' }>
}

function useDeferredFocused(wait?: number) {
  const focused = useFocused()
  const [deferred, setDeferred] = useState(() => focused)
  const schedule = useTimeout(wait!)
  useEffect(() => {
    schedule(() => setDeferred(focused))
  }, [focused, schedule])

  return deferred
}

function Link({ children, element, attributes, ...props }: LinkProps) {
  const editor = useSlate()
  const selection = editor.selection
  const focused = useDeferredFocused()

  const selected = useMemo(() => {
    const anchorPath = selection?.anchor.path
    const focusPath = selection?.focus.path
    const elementPath = ReactEditor.findPath(editor, element)
    const hasSelection = anchorPath !== undefined && focusPath !== undefined
    return (
      hasSelection &&
      Path.isCommon(elementPath, anchorPath) &&
      Path.isCommon(elementPath, focusPath)
    )
    // selection could change without editor changing
    // so don't use editor.selection and just add editor to the deps array
    // also track editor.selection in deps array
  }, [editor, selection, element])

  function handleEdit() {
    editor.callTool(`prompt:link`)
  }

  function handleRemove() {
    CustomEditor.unwrapLink(editor)
  }

  return (
    <Fragment>
      <Popover open={selected && focused}>
        <PopoverTrigger asChild>
          <a
            className={variants({ component: 'link' })}
            href={element.url}
            {...attributes}
            {...props}
          >
            <InlineChromiumBugfix />
            {children}
            <InlineChromiumBugfix />
          </a>
        </PopoverTrigger>

        <PopoverContent
          className={variants({ component: 'link-popover' })}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <PopoverArrow className="h-2 w-4" asChild>
            <PopoverArrowGraphic type="vector" />
          </PopoverArrow>

          <div className="grid w-full min-w-0 auto-cols-auto grid-flow-col items-center gap-1">
            <a
              className={variants({ component: 'link', preview: true })}
              href={element.url}
              title={element.url}
            >
              {element.url}
            </a>

            <Separator orientation="vertical" />

            <Button variant="link" size="sm" className="h-[1lh] px-1" onClick={handleEdit}>
              Edit
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-destructive h-[1lh] px-1"
              onClick={handleRemove}
            >
              Remove
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Fragment>
  )
}

interface LineBreakProps extends Omit<RenderElementProps, 'element'> {
  element: Extract<CustomElement, { type: 'line-break' }>
}

function LineBreak({ children, element: _, attributes, ...props }: LineBreakProps) {
  return (
    <Fragment>
      <InlineChromiumBugfix />
      {children}
      <br {...attributes} {...props} />
      <InlineChromiumBugfix />
    </Fragment>
  )
}
