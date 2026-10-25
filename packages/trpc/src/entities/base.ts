import { BaseTimestampEntity, IDEntity } from "@hux/datasource";
import z from "zod";

export const BaseReadEntity = z.object({
    ...IDEntity.shape,
    ...BaseTimestampEntity.shape
})