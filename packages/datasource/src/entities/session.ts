import z from 'zod'

import { SessionModel } from '../schema/session/model'
import { BaseTimestampEntity, ID } from './base'

export type SessionEntity = z.infer<typeof SessionEntity>

export const SessionEntity = BaseTimestampEntity.merge(
  z.object({
    userId: ID,
    token: z.string(),
    expires: z.date(),
  }),
)

export const SessionEntityMapper = {
  /**
   * A noop method that only helps to statically typecheck that a data matches an expected shape
   * @private
   * @param data The structured data
   * @returns The structured data
   */
  struct(data: SessionEntity): SessionEntity {
    return data
  },

  /**
   * Map an entity from its corresponding model
   * @param model The model to map from, into a corresponding entity
   * @returns The mapped entity
   */
  from(model: SessionModel): SessionEntity {
    return SessionEntity.parse(
      this.struct({
        createdAt: model.createdAt,
        expires: model.expires,
        token: model.sessionToken,
        updatedAt: model.updatedAt,
        userId: model.userId,
      }),
    )
  },

  /**
   * Map an entity into its corresponding model
   * @param entity The entity to map into a corresposing model
   * @returns The mapped model
   */
  into(entity: SessionEntity): SessionModel {
    return {
      createdAt: entity.createdAt,
      expires: entity.expires,
      sessionToken: entity.token,
      updatedAt: entity.updatedAt,
      userId: entity.userId,
    }
  },
}
