'use client'

import { useEffect, useRef, useState } from 'react'

import { cva } from 'class-variance-authority'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ClampedTextProps extends React.ComponentProps<'span'> {
  children: React.ReactNode
  alignment?: 'center' | 'left' | 'right'
  lines?: number
}

const variants = cva('', {
  variants: {
    component: {
      root: 'relative inline-flex items-center gap-1',
      text: 'relative',
      button:
        'absolute top-12/12 p-0 text-blue-400 dark:text-blue-400 backdrop-brightness-100 dark:backdrop-brightness-0 h-auto',
    },
    alignment: { center: '', left: '', right: '' },
    clamped: {
      true: '[mask-image:linear-gradient(0deg,transparent,black_100%,transparent)]',
      false: '',
    },
    disclosure: {
      expanded: '',
      collapsed: 'line-clamp-[var(--lines)]',
    },
  },
  compoundVariants: [
    {
      component: 'text',
      alignment: 'center',
      className: 'text-center',
    },
    {
      component: 'text',
      alignment: 'left',
      className: 'text-left',
    },
    {
      component: 'text',
      alignment: 'right',
      className: 'text-right',
    },
    {
      component: 'button',
      alignment: 'center',
      className: 'right-6/12 translate-x-6/12',
    },
    {
      component: 'button',
      alignment: 'left',
      className: 'left-0',
    },
    {
      component: 'button',
      alignment: 'right',
      className: 'right-0',
    },
  ],
})

export function ClampedText({
  children,
  className,
  alignment = 'center',
  lines = 2,
  ...props
}: ClampedTextProps) {
  const [isClamped, setIsClamped] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = textRef.current
    if (!element) return

    const checkClamped = () => {
      const isTruncated = element.scrollHeight > element.clientHeight
      setIsClamped(isTruncated)
    }

    checkClamped()
    window.addEventListener('resize', checkClamped)

    return () => window.removeEventListener('resize', checkClamped)
  }, [children])

  return (
    <span className={cn(variants({ component: 'root' }), className)}>
      <span
        ref={textRef}
        style={{ '--lines': lines } as React.CSSProperties}
        className={variants({
          alignment,
          component: 'text',
          disclosure: isExpanded ? 'expanded' : 'collapsed',
          clamped: isClamped && !isExpanded,
        })}
        {...props}
      >
        {children}
      </span>
      {isClamped && (
        <Button
          variant="link"
          size="sm"
          className={variants({ component: 'button', alignment })}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'less' : 'more'}
        </Button>
      )}
    </span>
  )
}
