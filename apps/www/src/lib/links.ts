export const Links = {
  profile: {
    edit: '/profile/edit',
  },
  signin: (callbackUrl?: string) => `/signin?callbackUrl=${callbackUrl ?? '/'}` as const,
} as const
