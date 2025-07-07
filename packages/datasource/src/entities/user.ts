import z from 'zod'

import { UserModel, UserRelations } from '../schema'
import { AccountEntity, AccountEntityMapper } from './account'
import { BaseEntity } from './base'
import { SessionEntity, SessionEntityMapper } from './session'

export type UserEntity = z.infer<typeof UserEntity>

/**
 * Value object for email addresses
 */
export const EmailVObject = z.object({
  address: z.string().email(),
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

export const UserEntity = BaseEntity.merge(
  z.object({
    avatar: z.string().url().nullable(),
    email: EmailVObject,
    name: NameVObject,
    username: z.string().nullable().default(null),
    accounts: z.array(AccountEntity),
    sessions: z.array(SessionEntity),
  }),
)

export const UserEntityMapper = {
  /**
   * A noop method that only helps to statically typecheck that a data matches an expected shape
   * @private
   * @param data The structured data
   * @returns The structured data
   */
  struct(data: UserEntity): UserEntity {
    return data
  },

  /**
   * Map an entity from its corresponding model
   * @param model The model to map from, into a corresponding entity
   * @returns The mapped entity
   */
  from(model: UserModel): UserEntity {
    return UserEntity.parse(
      this.struct({
        accounts: model.accounts.map(AccountEntityMapper.from),
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
        sessions: model.sessions.map(SessionEntityMapper.from),
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
  into(entity: UserEntity): UserModel {
    return {
      accounts: entity.accounts.map(AccountEntityMapper.into),
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      email: entity.email.address,
      emailVerified: entity.email.verifiedAt,
      familyName: entity.name.last,
      givenName: entity.name.first,
      id: entity.id,
      image: entity.avatar,
      name: entity.name.first.concat(' ', entity.name.last),
      sessions: entity.sessions.map(SessionEntityMapper.into),
      updatedAt: entity.updatedAt,
      username: entity.username,
    }
  },
}
