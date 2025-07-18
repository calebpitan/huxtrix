import * as uc from '../../../usecases/user/update'
import { protectedProcedure } from '../../../server/trpc'

export const updateUser = protectedProcedure
  .input(uc.updateUserInput)
  .mutation(async ({ ctx, input }) => {
    return await ctx.runEffect(uc.updateUserUseCase(input))
  })

export const updateUserProfile = protectedProcedure
  .input(uc.updateUserProfileInput)
  .mutation(async ({ ctx, input }) => {
    return await ctx.runEffect(uc.updateUserProfileUseCase(input))
  })

export const updateUsername = protectedProcedure
  .input(uc.updateUsernameInput)
  .mutation(async ({ ctx, input }) => {
    return await ctx.runEffect(uc.updateUsernameUseCase(input))
  })
