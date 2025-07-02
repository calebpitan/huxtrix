import { Metadata } from 'next'

import { CreatorMain } from './main'

export const metadata: Metadata = {
  title: 'Create — Huxtrix',
  description: 'Get creative: share a useful hack or trick',
}

export default function CreatorPage() {
  return <CreatorMain />
}
