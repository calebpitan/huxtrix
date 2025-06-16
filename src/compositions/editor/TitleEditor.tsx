import React from 'react'

import { cn } from '@/lib/utils'

export function TitleEditor({
  children,
  className,
  value,
  defaultValue,
  ...rest
}: Omit<React.ComponentProps<'textarea'>, 'rows'>) {
  return (
    <div
      data-component="title-editor"
      data-content={value || defaultValue}
      className={cn(
        "grid after:invisible after:whitespace-pre-wrap after:content-[attr(data-content)_'_']",
        'after:[grid-area:1_/_1_/_2_/_2] [&>textarea]:[grid-area:1_/_1_/_2_/_2]',
        className,
      )}
    >
      <textarea
        className="placeholder:text-muted-foreground flex field-sizing-content h-[1.1lh] resize-none overflow-visible focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        spellCheck="false"
        rows={1}
        defaultValue={defaultValue}
        value={value}
        onBeforeInput={(e) => {
          if ((e.nativeEvent as InputEvent).data === '\n') {
            e.preventDefault()
          }
        }}
        {...rest}
      >
        {children}
      </textarea>
    </div>
  )
}
