'use client'

import { ComponentProps } from 'react'

import MDEditor, { PreviewType, commands } from '@uiw/react-md-editor'

import { cn } from '@/lib/utils'

import './editor.css'

export interface TextEditorProps {
  className?: string
  placeholder?: string
  content: string
  onChange?(value: string): void
  mode?: PreviewType
  TextAreaProps?: Omit<ComponentProps<'textarea'>, 'value' | 'onScroll' | 'placeholder'>
}

export function TextEditor({
  className,
  content,
  placeholder,
  onChange,
  mode = 'edit',
  TextAreaProps,
  ...props
}: TextEditorProps) {

  return (
    <div className={cn(className)} {...props}>
      <MDEditor
        value={content}
        textareaProps={{ ...TextAreaProps, placeholder }}
        commands={[commands.bold, commands.italic]}
        onChange={(v) => onChange?.(v ?? '')}
        preview={mode}
        // minHeight={300}
      />
    </div>
  )
}
