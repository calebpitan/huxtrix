import z from 'zod'

import { AccountDict, AccountModel, AccountSSOProvider, AccountType } from '../schema/account/model'
import { DeepReadonly, ForUpdate } from '../type'
import { BaseEntity, ID } from './base'
import { UserEntity, UserEntityMapper } from './user'

export type BaseAccountEntity = DeepReadonly<z.infer<typeof BaseAccountEntity>>

export interface AccountEntity extends BaseAccountEntity {
  readonly user?: UserEntity
}

/**
 * Value object for {@link AccountEntity} `provider`
 */
export const AccountProviderVObject = z.object({
  name: z.enum([AccountSSOProvider.google]),
  accountId: z.string(),
})

/**
 * Value object for {@link AccountEntity} `tokens`
 */
export const AccountTokensVObject = z.object({
  access: z.string().nullable(),
  openid: z.string().nullable(),
  refresh: z.string().nullable(),
  type: z.string().nullable(),
  scope: z.string().nullable(),
  expiry: z.int().nullable(),
  sessionState: z.string().nullable(),
})

export const BaseAccountEntity = z.object({
  ...BaseEntity.shape,
  provider: AccountProviderVObject,
  tokens: AccountTokensVObject,
  type: z.enum([AccountType.email, AccountType.oidc]),
  userId: ID,
})

export const AccountEntity = z.object({
  ...BaseAccountEntity.shape,
  get user(): z.ZodOptional<typeof UserEntity> {
    return z.optional(UserEntity)
  },
})

export const AccountEntityMapper = {
  /**
   * A noop method that only helps to statically typecheck that a data matches an expected shape
   * @private
   * @param data The structured data
   * @returns The structured data
   */
  struct: (data: AccountEntity): AccountEntity => {
    return data
  },

  /**
   * Map an entity from its corresponding model
   * @param model The model to map from, into a corresponding entity
   * @returns The mapped entity
   */
  from: (model: AccountDict | AccountModel): AccountEntity => {
    return AccountEntity.parse(
      AccountEntityMapper.struct({
        id: model.id,
        createdAt: model.createdAt,
        deletedAt: model.deletedAt,
        provider: {
          accountId: model.providerAccountId,
          name: model.provider,
        },
        tokens: {
          access: model.access_token,
          expiry: model.expires_at,
          openid: model.id_token,
          refresh: model.refresh_token,
          scope: model.scope,
          sessionState: model.session_state,
          type: model.token_type,
        },
        type: model.type,
        updatedAt: model.updatedAt,
        userId: model.userId,
        user: model.user ? UserEntityMapper.from(model.user) : undefined,
      }),
    )
  },

  /**
   * Map an entity into its corresponding model
   * @param entity The entity to map into a corresposing model
   * @returns The mapped model
   */
  into: (entity: AccountEntity): AccountModel => {
    return new AccountModel({
      access_token: entity.tokens.access,
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      expires_at: entity.tokens.expiry,
      id: entity.id,
      id_token: entity.tokens.openid,
      provider: entity.provider.name,
      providerAccountId: entity.provider.accountId,
      refresh_token: entity.tokens.refresh,
      scope: entity.tokens.scope,
      session_state: entity.tokens.sessionState,
      token_type: entity.tokens.type,
      type: entity.type,
      updatedAt: entity.updatedAt,
      user: entity.user && UserEntityMapper.into(entity.user),
      userId: entity.userId,
    })
  },

  /**
   * Map an entity into its corresponding model
   * @param entity The entity to map into a corresposing model
   * @returns The mapped model
   */
  pinto: (entity: ForUpdate<'account', AccountEntity>): ForUpdate<'account', AccountModel> => {
    const model = {
      access_token: entity.tokens?.access,
      deletedAt: entity.deletedAt,
      expires_at: entity.tokens?.expiry,
      id_token: entity.tokens?.openid,
      provider: entity.provider?.name,
      providerAccountId: entity.provider?.accountId,
      refresh_token: entity.tokens?.refresh,
      scope: entity.tokens?.scope,
      session_state: entity.tokens?.sessionState,
      token_type: entity.tokens?.type,
      type: entity.type,
      userId: entity.userId,
    }

    return Object.fromEntries(Object.entries(model).filter(([, v]) => typeof v !== 'undefined'))
  },
}
