'use client'

import { ReactNode } from 'react'

import { Breakpoint, useCurrentBreakpoint } from '@/hooks/use-breakpoint'

export interface BreakpointPassthroughProps {
  breakpoints: Breakpoint | Breakpoint[]
  strategy: 'include' | 'exclude'
  children?: ReactNode
}

export function BreakpointPassthrough({
  breakpoints: expectedBreakpoints,
  strategy,
  children,
}: BreakpointPassthroughProps) {
  const actualBreakpoint = useCurrentBreakpoint()
  const isMatch = Array.isArray(expectedBreakpoints)
    ? expectedBreakpoints.includes(actualBreakpoint)
    : expectedBreakpoints === actualBreakpoint

  if (isMatch) {
    switch (strategy) {
      case 'include':
        return children
      case 'exclude':
        return null
    }
  } else {
    switch (strategy) {
      case 'include':
        return null
      case 'exclude':
        return children
    }
  }
}
