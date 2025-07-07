import z from 'zod'

export const BaseTimestampEntity = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const TimestampEntity = BaseTimestampEntity.merge(
  z.object({
    deletedAt: z.date().nullable(),
  }),
)

export const IDEntity = z.object({
  id: z.string().ulid(),
})

export const BaseEntity = IDEntity.merge(TimestampEntity)

export const ID = z.string().ulid()
