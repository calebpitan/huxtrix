'use client'

import { useSession } from '@hux/auth/react'
import { useTRPC } from '@hux/trpc/react'
import { useQuery } from '@tanstack/react-query'

import { previewAuthorInitials, previewAuthorName } from '@/compositions/card/preview'

export function useSignedInAuthor() {
  const { data: session } = useSession()
  const trpc = useTRPC()
  const { data: user } = useQuery(
    trpc.user.getByID.queryOptions(
      {
        id: session?.user.id ?? '',
      },
      {
        enabled: !!session?.user.id,
      },
    ),
  )

  const names = user
    ? {
        name: user.names.name,
        firstName: user.names.first,
        lastName: user.names.last,
        username: user.username,
      }
    : null

  return {
    name: previewAuthorName(names),
    initials: previewAuthorInitials(names),
    avatarUrl: user?.avatar ?? undefined,
  }
}
