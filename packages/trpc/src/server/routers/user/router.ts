import { createTRPCRouter } from '../../trpc'
import { getUserByID, getUserByUsername } from './get'
import { updateUser, updateUserProfile, updateUsername } from './update'

export const userRouter = createTRPCRouter({
  getByID: getUserByID,
  getByUsername: getUserByUsername,
  update: updateUser,
  updateProfile: updateUserProfile,
  updateUsername: updateUsername,
})
