'use client'

import { ComponentProps, forwardRef } from 'react'

import { HTMLMotionProps, motion } from 'motion/react'

import { ClampedText } from '@/components/typography/clamped-text'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Profile } from '@/compositions/types'
import { cn, quarticEase } from '@/lib/utils'

export interface ProfileHeaderProps extends HTMLMotionProps<'div'> {
  profile: Profile
  AvatarProps?: Pick<ComponentProps<typeof Avatar>, 'className'>
  animationProgress?: number
  mode?: 'primary' | 'alternate'
}

export const ProfileHeader = forwardRef<HTMLDivElement, ProfileHeaderProps>(
  ({ className, profile, animationProgress = 0, AvatarProps, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const opacity = quarticEase(0.5 - animationProgress)

    return (
      <motion.div data-component="profile-header" className={cn(className)} {...props} ref={ref}>
        <div className="flex flex-col items-center gap-4">
          <Avatar className="size-24 lg:size-32" {...AvatarProps}>
            <AvatarImage src={profile.image} />
            <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tighter">{profile.name}</h1>
              <p className="text-muted-foreground text-sm">
                <span className="text-primary">@</span>
                {profile.username}
              </p>
            </div>

            <div className={cn('text-muted-foreground h-[3lh] max-w-62.5 text-sm')}>
              <ClampedText className="text-foreground" alignment="center" lines={2}>
                {profile.bio}
              </ClampedText>
            </div>
          </div>
        </div>
      </motion.div>
    )
  },
)

ProfileHeader.displayName = 'ProfileHeader'
