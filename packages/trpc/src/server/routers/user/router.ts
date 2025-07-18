import { createTRPCRouter } from '../../trpc'
import { getUserByID } from './get'
import { updateUser, updateUserProfile, updateUsername } from './update'

export const userRouter = createTRPCRouter({
  getByID: getUserByID,
  update: updateUser,
  updateProfile: updateUserProfile,
  updateUsername: updateUsername,
})
