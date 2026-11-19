import type { Metadata } from 'next'

import { PublishStep } from './step'

export const metadata: Metadata = {
  title: 'Publish — Huxtrix',
  description: 'Choose where your article appears',
}

export default function CreatePublishPage() {
  return <PublishStep />
}
