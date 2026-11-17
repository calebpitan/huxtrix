'use client'

import { useState } from 'react'

import { Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTextEditor } from '@/compositions/editor'

import { PublishOptionRow } from './option-row'

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function timeValue(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatScheduled(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function PublishScheduleField() {
  const { draft, updateDraft } = useTextEditor()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState('')

  function write(nextDate: Date | undefined, nextTime: string) {
    if (!nextDate || !nextTime) return
    const [hours, minutes] = nextTime.split(':').map(Number)
    if (
      hours === undefined ||
      minutes === undefined ||
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return
    }
    const scheduled = new Date(nextDate)
    scheduled.setHours(hours, minutes, 0, 0)
    updateDraft({ scheduledAt: scheduled.toISOString() })
  }

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) return
    if (!draft.scheduledAt) {
      setDate(undefined)
      setTime('')
      return
    }
    const scheduled = new Date(draft.scheduledAt)
    setDate(scheduled)
    setTime(timeValue(scheduled))
  }

  function clear() {
    setDate(undefined)
    setTime('')
    updateDraft({ scheduledAt: null })
  }

  return (
    <PublishOptionRow
      icon={Clock}
      title="Publish now"
      description={
        draft.scheduledAt ? formatScheduled(draft.scheduledAt) : 'Or pick a date and time'
      }
    >
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="rounded-full">
            Schedule
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(next) => {
              setDate(next)
              write(next, time)
            }}
          />
          <div className="flex items-center gap-2 border-t p-3">
            <Input
              type="time"
              aria-label="Time"
              value={time}
              onChange={(event) => {
                const nextTime = event.target.value
                setTime(nextTime)
                write(date, nextTime)
              }}
            />
            <Button type="button" variant="ghost" className="rounded-full" onClick={clear}>
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </PublishOptionRow>
  )
}
