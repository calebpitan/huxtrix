'use client'

import { Gift } from 'lucide-react'

import { Switch } from '@/components/ui/switch'
import { useTextEditor } from '@/compositions/editor'

import { PublishOptionRow } from './option-row'

export function PublishRewardsField() {
  const { draft, updateDraft } = useTextEditor()

  return (
    <PublishOptionRow icon={Gift} title="Allow rewards" description="Readers can send you a reward">
      <Switch
        checked={draft.rewardsEnabled}
        onCheckedChange={(checked) => updateDraft({ rewardsEnabled: checked })}
        aria-label="Allow rewards"
      />
    </PublishOptionRow>
  )
}
