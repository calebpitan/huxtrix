import { createTRPCRouter } from '../../trpc'
import { getUserByID } from './get'
import { updateUser } from './update'

export const userRouter = createTRPCRouter({
  getByID: getUserByID,
  update: updateUser,
})
