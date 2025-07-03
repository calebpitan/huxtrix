'use client'

import {
  BulletedListPlugin,
  ListItemPlugin,
  ListPlugin,
  NumberedListPlugin,
} from '@platejs/list-classic/react'

import { BulletedListElement, NumberedListElement } from '@/components/ui/list-classic-node'

export const ListKit = [
  ListPlugin.configure({
    options: { enableResetOnShiftTab: true },
  }),
  BulletedListPlugin.configure({
    node: { component: BulletedListElement },
    shortcuts: { toggle: { keys: 'mod+alt+5' } },
  }),
  NumberedListPlugin.configure({
    node: { component: NumberedListElement },
    shortcuts: { toggle: { keys: 'mod+alt+6' } },
  }),
  ListItemPlugin,
]
