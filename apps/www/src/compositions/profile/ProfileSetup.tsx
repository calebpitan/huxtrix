'use client'

import { ComponentProps, useState } from 'react'

import { useTRPC } from '@hux/trpc/react'
import { useMutation } from '@tanstack/react-query'

import * as AppDialog from '@/components/dialog/app-dialog'
import { useCurrentBreakpoint } from '@/hooks/use-breakpoint'
import { useMounted } from '@/hooks/use-mounted'

import { ProfileSetupForm } from './ProfileSetupForm'

type User = Parameters<ComponentProps<typeof ProfileSetupForm>['onSave']>[0] & { id: string }

export function ProfileSetup(props: Readonly<{ user: User }>) {
  const trpc = useTRPC()
  const mounted = useMounted()
  const [open, setOpen] = useState(true)
  const breakpoint = useCurrentBreakpoint()
  const dialogType = breakpoint === 'base' ? 'swipe' : 'float'

  const updateUserMutation = useMutation(trpc.user.update.mutationOptions())

  const handleOpenChange = (_open: boolean) => {
    // setOpen(open)
  }

  const handleSave = (data: Omit<User, 'id'>) => {
    return void updateUserMutation
      .mutateAsync({
        id: props.user.id,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
        },
      })
      .then(() => setOpen(false))
  }

  if (!mounted) return null

  return (
    <AppDialog.Root
      type={dialogType}
      title="Setup Your Profile"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <ProfileSetupForm onSave={handleSave} data={props.user} />
    </AppDialog.Root>
  )
}
