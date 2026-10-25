import z from 'zod'

import { type SocialTypes, type UserDict, UserModel } from '../schema/user/model'
import { DeepReadonly, ForUpdate } from '../type'
import { AccountEntity, AccountEntityMapper } from './account'
import { BaseEntity } from './base'
import { SessionEntity, SessionEntityMapper } from './session'

export type BaseUserEntity = DeepReadonly<z.infer<typeof BaseUserEntity>>

export interface UserEntity extends BaseUserEntity {
  readonly sessions?: ReadonlyArray<SessionEntity>
  readonly accounts?: ReadonlyArray<AccountEntity>
}

/**
 * Value object for email addresses
 */
export const EmailVObject = z.object({
  address: z.email(),
  verified: z.boolean().default(false),
  verifiedAt: z.date().nullable().default(null),
})

/**
 * Value object for {@link UserEntity} names
 */
export const NameVObject = z.object({
  first: z.string().default(''),
  last: z.string().default(''),
})

export const SocialsVObject = z.object({
  name: z.enum(['x', 'ig', 'yt', 'tiktok']),
  url: z.url(),
})

export const BaseUserEntity = z.object({
  ...BaseEntity.shape,
  avatar: z.url().nullable(),
  email: EmailVObject,
  name: NameVObject,
  username: z.string().nullable().default(null),
  socials: z.array(SocialsVObject),
  summary: z.string(),
})

export const UserEntity: z.ZodType<UserEntity> = z.object({
  ...BaseUserEntity.shape,
  get sessions() {
    return z.array(SessionEntity).optional()
  },
  get accounts() {
    return z.array(AccountEntity).optional()
  },
})

export const UserEntityMapper = {
  /**
   * A noop method that only helps to statically typecheck that a data matches an expected shape
   * @private
   * @param data The structured data
   * @returns The structured data
   */
  struct: (data: UserEntity): UserEntity => {
    return data
  },

  /**
   * Map an entity from its corresponding model
   * @param model The model to map from, into a corresponding entity
   * @returns The mapped entity
   */
  from: (model: UserDict | UserModel): UserEntity => {
    return UserEntity.parse(
      UserEntityMapper.struct({
        accounts: model.accounts?.map(AccountEntityMapper.from),
        avatar: model.image,
        createdAt: model.createdAt,
        deletedAt: model.deletedAt,
        email: {
          address: model.email,
          verified: model.emailVerified !== null,
          verifiedAt: model.emailVerified,
        },
        id: model.id,
        name: {
          first: model.givenName,
          last: model.familyName,
        },
        sessions: model.sessions?.map(SessionEntityMapper.from),
        socials: socialsToEntries(model.socials),
        summary: model.summary,
        updatedAt: model.updatedAt,
        username: model.username,
      }),
    )
  },

  /**
   * Map an entity into its corresponding model
   * @param entity The entity to map into a corresposing model
   * @returns The mapped model
   */
  into: (entity: UserEntity): UserModel => {
    return new UserModel({
      accounts: entity.accounts?.map(AccountEntityMapper.into),
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      email: entity.email.address,
      emailVerified: entity.email.verifiedAt,
      familyName: entity.name.last,
      givenName: entity.name.first,
      id: entity.id,
      image: entity.avatar,
      name: entity.name.first.concat(' ', entity.name.last),
      sessions: entity.sessions?.map(SessionEntityMapper.into),
      socials: socialsFromEntries(entity.socials),
      summary: entity.summary,
      updatedAt: entity.updatedAt,
      username: entity.username,
    })
  },

  /**
   * Map an entity into its corresponding model
   * @param entity The entity to map into a corresposing model
   * @returns The mapped model
   */
  pinto: (entity: ForUpdate<'user', UserEntity>): ForUpdate<'user', UserModel> => {
    const model = {
      deletedAt: entity.deletedAt,
      email: entity.email?.address,
      emailVerified: entity.email?.verifiedAt,
      familyName: entity.name?.last,
      givenName: entity.name?.first,
      image: entity.avatar,
      name: entity.name?.first.concat(' ', entity.name.last),
      socials: entity.socials && socialsFromEntries(entity.socials),
      username: entity.username,
    }

    return omitUndefined(model)
  },
}

function omitUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => typeof v !== 'undefined')) as T
}

export function socialsFromEntries(entries: ReadonlyArray<z.infer<typeof SocialsVObject>>) {
  return Object.fromEntries(entries.map((s) => [s.name, s.url])) as Record<SocialTypes, string>
}

export function socialsToEntries(socials: Record<SocialTypes, string> | null) {
  const socialEntries = socials ? (Object.entries(socials) as Array<[SocialTypes, string]>) : []
  return socialEntries.flatMap(([name, url]) => ({ name, url }))
}
