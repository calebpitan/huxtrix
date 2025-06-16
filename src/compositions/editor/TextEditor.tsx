'use client'

import { ComponentProps, cloneElement, useRef, useState } from 'react'

import MDEditor, { GroupOptions, PreviewType, RefMDEditor, commands } from '@uiw/react-md-editor'

import { Bold, ChevronDown, Code, Heading1, Heading2, Heading3 } from 'lucide-react'
import { Heading4, Heading5, Heading6, Italic, Strikethrough, Type } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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

const CUSTOMIZATIONS = {
  bold: <Bold aria-hidden={true} />,
  italic: <Italic aria-hidden={true} />,
  strikethrough: <Strikethrough aria-hidden={true} />,
  code: <Code aria-hidden={true} />,
  typography: <Type aria-hidden={true} />,
  title1: <Heading1 aria-hidden={true} />,
  title2: <Heading2 aria-hidden={true} />,
  title3: <Heading3 aria-hidden={true} />,
  title4: <Heading4 aria-hidden={true} />,
  title5: <Heading5 aria-hidden={true} />,
  title6: <Heading6 aria-hidden={true} />,
}

const TYPOGRAPHY_CMDS = [
  commands.title1,
  commands.title2,
  commands.title3,
  commands.title4,
  commands.title5,
  commands.title6,
]

export function TextEditor({
  className,
  content,
  placeholder,
  onChange,
  mode = 'edit',
  TextAreaProps,
  ...props
}: TextEditorProps) {
  const editorRef = useRef<RefMDEditor>(null)

  return (
    <div className={cn(className)} {...props}>
      <MDEditor
        value={content}
        ref={editorRef}
        textareaProps={{ ...TextAreaProps, placeholder }}
        commands={[
          commands.group([], { name: 'typography', groupName: 'typography' }),
          commands.divider,
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.code,
          commands.divider,
        ]}
        extraCommands={[]}
        onChange={(v) => onChange?.(v ?? '')}
        preview={mode}
        components={{ toolbar: ToolbarButton }}
        autoFocus={true}
      />
    </div>
  )
}

export const ToolbarButton: NonNullable<commands.ICommand['render']> = (
  command,
  disabled,
  executeCommand,
  index,
) => {
  if (command.name === 'typography')
    return TypographyDropdown(command, disabled, executeCommand, index)

  const icon = CUSTOMIZATIONS[command.name! as keyof typeof CUSTOMIZATIONS]
  return (
    <div key={index}>
      <Button
        variant="ghost"
        className="text-lg"
        onClick={() => executeCommand(command)}
        disabled={disabled}
        aria-label={command.name}
      >
        {icon}
      </Button>
    </div>
  )
}

export const TypographyDropdown: NonNullable<GroupOptions['render']> = (
  command,
  disabled,
  executeCommand,
  index,
) => {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div key={index}>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={disabled} asChild>
          <Button
            size="sm"
            variant="ghost"
            className="text-base font-normal"
            onClick={() => executeCommand(command, command.groupName)}
          >
            <span style={{ textTransform: 'capitalize' }}>{command.name}</span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="supports-[backdrop-filter]:bg-muted/50 backdrop-blur-md"
          align="start"
        >
          {TYPOGRAPHY_CMDS.map((command, i) => {
            const icon = CUSTOMIZATIONS[command.name! as keyof typeof CUSTOMIZATIONS]

            return (
              <DropdownMenuCheckboxItem
                className="focus:bg-zinc-200 dark:focus:bg-zinc-800"
                key={command.name!}
                checked={selected === command.name}
                onClick={() => {
                  setSelected(command.name!)
                  executeCommand(command, command.groupName)
                }}
              >
                <div className="inline-flex items-center gap-4">
                  {cloneElement(icon, { className: 'size-5' })}
                  <span className="me-4">{`Heading ${i + 1}`}</span>
                </div>
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
