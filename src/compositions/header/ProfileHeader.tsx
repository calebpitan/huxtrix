'use client'

import { ComponentProps, forwardRef } from 'react'

import { HTMLMotionProps, motion } from 'motion/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, quarticEase } from '@/lib/utils'

export type Profile = {
  name: string
  username: string
  image: string
  bio: string
}

export interface ProfileHeaderProps extends HTMLMotionProps<'div'> {
  profile: Profile
  AvatarProps?: Pick<ComponentProps<typeof Avatar>, 'className'>
  animationProgress?: number
  mode?: 'primary' | 'alternate'
}

export const ProfileHeader = forwardRef<HTMLDivElement, ProfileHeaderProps>(
  ({ className, profile, animationProgress = 0, AvatarProps, ...props }, ref) => {
    return (
      <motion.div data-component="profile-header" className={cn(className)} {...props} ref={ref}>
        <div className="flex flex-col gap-4 items-center">
          <Avatar className="size-24 lg:size-32" {...AvatarProps}>
            <AvatarImage src={profile.image} />
            <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1 justify-center items-center">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-bold tracking-tighter">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">
                <span className="text-primary">@</span>
                {profile.username}
              </p>
            </div>

            <div
              className={cn('h-[3lh] max-w-62.5 text-center text-sm text-muted-foreground')}
              style={{ opacity: quarticEase(0.5 - animationProgress) }}
            >
              <span className="text-foreground">{profile.bio}</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  },
)

ProfileHeader.displayName = 'ProfileHeader'
