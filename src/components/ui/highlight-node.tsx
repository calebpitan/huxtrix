'use client';

import * as React from 'react';

import type { PlateLeafProps } from 'platejs/react';

import { PlateLeaf } from 'platejs/react';

export function HighlightLeaf(props: PlateLeafProps) {
  return (
    <PlateLeaf {...props} as="mark" className="bg-highlight/30 dark:bg-highlight/90 dark:text-black dark:caret-current text-inherit rounded-[2.5px] px-0.5">
      {props.children}
    </PlateLeaf>
  );
}
