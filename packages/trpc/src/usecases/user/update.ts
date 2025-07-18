import { ID, SocialsVObject } from '@hux/datasource'

import { Effect, pipe } from 'effect'
import z from 'zod'

import { UserExistsError } from '../../server/errors/user'
import { UserRepositoryDep } from '../../services/injection'

const UsernameInput = z.string().regex(/^[A-Za-z]+(?:[_.]?[A-Za-z0-9]+)*$/)

const checkIfUsernameTaken = (username: string) => {
  return pipe(
    UserRepositoryDep,
    Effect.flatMap((repo) => Effect.promise(() => repo.existsByUsername(username))),
    Effect.flatMap((exists) =>
      Effect.fail(new UserExistsError({ info: { label: 'username', value: username } })).pipe(
        Effect.when(() => exists),
      ),
    ),
  )
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE USER PROFILE
export const updateUserProfileInput = z.object({
  id: ID,
  data: z.object({
    firstName: z.string(),
    lastName: z.string(),
    socials: z.array(SocialsVObject),
  }),
})

export function updateUserProfileUseCase(input: z.infer<typeof updateUserProfileInput>) {
  return Effect.gen(function* () {
    const repo = yield* UserRepositoryDep

    const result = yield* Effect.promise(() =>
      repo.update(input.id, {
        name: {
          first: input.data.firstName,
          last: input.data.lastName,
        },
        socials: input.data.socials,
      }),
    )

    if (result.isErr()) {
      return yield* Effect.fail(result.error)
    }

    return result.value
  })
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE USERNAME
export const updateUsernameInput = z.object({
  id: ID,
  data: z.object({ username: UsernameInput }),
})

export function updateUsernameUseCase(input: z.infer<typeof updateUsernameInput>) {
  const updateUsernameEffect = Effect.gen(function* () {
    const repo = yield* UserRepositoryDep

    const result = yield* Effect.promise(async () => {
      return repo.update(input.id, {
        username: input.data.username,
      })
    })

    if (result.isErr()) {
      return yield* Effect.fail(result.error)
    }

    return result.value
  })

  return Effect.andThen(checkIfUsernameTaken(input.data.username), updateUsernameEffect)
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE USER: Useful for doing initial user setup, for example, user's signed up with magic email
// don't get a chance to set their first name, last name, and user name, until now.
export const updateUserInput = z.object({
  id: ID,
  data: z.object({
    firstName: z.string(),
    lastName: z.string(),
    username: UsernameInput,
  }),
})

export function updateUserUseCase(input: z.infer<typeof updateUserInput>) {
  const updateUserEffect = Effect.gen(function* () {
    const repo = yield* UserRepositoryDep

    const result = yield* Effect.promise(() =>
      repo.update(input.id, {
        name: {
          first: input.data.firstName,
          last: input.data.lastName,
        },
        username: input.data.username,
      }),
    )

    if (result.isErr()) {
      return yield* Effect.fail(result.error)
    }

    return result.value
  })

  return Effect.andThen(checkIfUsernameTaken(input.data.username), updateUserEffect)
}
