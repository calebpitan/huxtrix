'use client'

import { useLayoutEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useTextEditor } from '@/compositions/editor'

import { PublishChannelField } from './channel-field'
import { PublishChecklist } from './checklist'
import { PublishCoverField } from './cover-field'
import { PublishHeader } from './header'
import { PublishIntro } from './intro'
import { PublishRewardsField } from './rewards-field'
import { PublishScheduleField } from './schedule-field'
import { PublishTagsField } from './tags-field'
import { PublishVisibilityField } from './visibility-field'

export function PublishStep() {
  const router = useRouter()
  const { draft } = useTextEditor()

  useLayoutEffect(() => {
    if (draft.type === 'post') router.replace('/create')
  }, [draft.type, router])

  if (draft.type === 'post') return null

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col overflow-y-auto xl:h-auto xl:overflow-visible">
      <PublishHeader />
      <div className="flex flex-col gap-10 px-2 py-8 lg:px-28">
        <PublishIntro />
        <PublishChannelField />
        <PublishCoverField />
        <PublishTagsField />
        <section className="flex flex-col">
          <h2 className="text-base font-bold">Options</h2>
          <div className="mt-4 border-t">
            <PublishVisibilityField />
            <PublishRewardsField />
            <PublishScheduleField />
          </div>
        </section>
        <PublishChecklist className="xl:hidden" />
      </div>
    </div>
  )
}
