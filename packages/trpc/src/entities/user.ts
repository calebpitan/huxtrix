import {
  AccountSSOProvider,
  AccountType,
  EmailVObject,
  NameVObject,
  SocialTypes,
  SocialsVObject,
  UserDict,
  UserEntity,
  socialsToEntries,
} from '@hux/datasource'

import z from 'zod'

import { BaseReadEntity } from './base'

export type UserSocials = Array<{ name: SocialTypes; url: string }>

export type BaseUserReadInput = z.input<typeof BaseUserReadEntity>
export type UserReadInput = z.input<typeof UserReadEntity>

export type BaseUserReadEntity = z.infer<typeof BaseUserReadEntity> & Record<string, unknown>
export type UserReadEntity = z.infer<typeof UserReadEntity> & Record<string, unknown>

export const BaseUserReadEntity = z.object({
  ...BaseReadEntity.shape,
  avatar: z.url().nullable(),
  names: NameVObject.transform((o) => ({
    ...o,
    name: `${o.first}${o.last ? ' ' : ''}${o.last}`,
  })),
  socials: z.array(SocialsVObject),
  summary: z.string(),
  username: z.string().nullable(),
})

export const UserReadEntity = z.object({
  ...BaseUserReadEntity.shape,
  email: EmailVObject,
  accounts: z
    .object({
      provider: z.enum(Object.values(AccountSSOProvider)),
      type: z.enum(Object.values(AccountType)),
    })
    .array()
    .optional(),
})

export const UserReadEntityMapper = {
  baseFromAggregate: (agg: UserEntity): BaseUserReadEntity => {
    return BaseUserReadEntity.parse({
      id: agg.id,
      avatar: agg.avatar,
      names: agg.name,
      socials: agg.socials as UserSocials,
      summary: agg.summary,
      username: agg.username,
      createdAt: agg.createdAt,
      updatedAt: agg.updatedAt,
    } satisfies BaseUserReadInput)
  },

  baseFromDict: (dict: UserDict): BaseUserReadEntity => {
    return BaseUserReadEntity.parse({
      id: dict.id,
      avatar: dict.image,
      names: {
        first: dict.givenName,
        last: dict.familyName,
      },
      socials: socialsToEntries(dict.socials),
      summary: dict.summary,
      username: dict.username,
      createdAt: dict.createdAt,
      updatedAt: dict.updatedAt,
    } satisfies BaseUserReadInput)
  },

  fromAggregate: (agg: UserEntity): UserReadEntity => {
    return UserReadEntity.parse({
      ...UserReadEntityMapper.baseFromAggregate(agg),
      email: agg.email,
      accounts: agg.accounts?.map((a) => ({ provider: a.provider.name, type: a.type })),
    } satisfies UserReadInput)
  },

  fromDict: (dict: UserDict): UserReadEntity => {
    return UserReadEntity.parse({
      ...UserReadEntityMapper.baseFromDict(dict),
      email: {
        address: dict.email,
        verified: dict.emailVerified !== null,
        verifiedAt: dict.emailVerified,
      },
      accounts: dict.accounts?.map((a) => ({ provider: a.provider, type: a.type })),
    } satisfies UserReadInput)
  },
}
