import { Effect } from 'effect'

import { UserReadEntityMapper } from '../../entities/user'
import { UserNotFoundError } from '../../server/errors/user/notfound'
import { DatabaseSessionDep } from '../injection'

export function queryUserByID(id: string) {
  return Effect.gen(function* () {
    const db = yield* DatabaseSessionDep
    const user = yield* Effect.promise(() =>
      db.query.user.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, id)
        },
      }),
    )

    if (!user) {
      return yield* Effect.fail(new UserNotFoundError({ info: { label: 'id', value: id } }))
    }

    return UserReadEntityMapper.fromDict(user)
  })
}

export function queryUserByUsername(username: string) {
  return Effect.gen(function* () {
    const db = yield* DatabaseSessionDep
    const user = yield* Effect.promise(() =>
      db.query.user.findFirst({
        where(fields, operators) {
          return operators.eq(fields.username, username)
        },
      }),
    )

    if (!user) {
      return yield* Effect.fail(
        new UserNotFoundError({
          info: {
            label: 'username',
            value: username,
          },
        }),
      )
    }

    return UserReadEntityMapper.fromDict(user)
  })
}
