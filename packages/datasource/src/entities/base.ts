import z from 'zod'

export type BaseEntity = Readonly<z.infer<typeof BaseEntity>>

export const BaseTimestampEntity = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const TimestampEntity = z.object({
  ...BaseTimestampEntity.shape,
  deletedAt: z.date().nullable(),
})

export const IDEntity = z.object({
  id: z.ulid(),
})

export const BaseEntity = z.object({
  ...IDEntity.shape,
  ...TimestampEntity.shape,
})

export const ID = z.ulid()
