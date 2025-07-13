import { UserEntity } from '@hux/datasource'

import type { TRPCRoot } from './trpc'

export function createTRPCMiddlewares(t: TRPCRoot) {
  return {
    canUpdateUser: (subject: UserEntity) =>
      t.middleware(({ ctx, next }) => {
        return next({ ctx })
      }),
  }
}
