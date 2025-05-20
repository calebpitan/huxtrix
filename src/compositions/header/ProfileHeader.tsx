'use client'

import { ComponentProps, forwardRef } from 'react'

import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export type Profile = {
  name: string
  username: string
  image: string
  bio: string
}

export interface ProfileHeaderProps extends HTMLMotionProps<'div'> {
  profile: Profile
  AvatarProps?: Pick<ComponentProps<typeof Avatar>, 'className'>
  animation?: number
  position?: 'primary' | 'alternate'
}

export const ProfileHeader = forwardRef<HTMLDivElement, ProfileHeaderProps>(
  ({ className, profile, position = 'primary', animation = 0, AvatarProps, ...props }, ref) => {
    const bioTransform = `-${animation * 100}%`
    let bioOpacity = Math.min(1 * (1 - animation), 1)
    bioOpacity = isNaN(bioOpacity) ? 1 : bioOpacity

    const alternateBioProps = {
      initial: { y: '0', opacity: 1 },
      animate: { y: '-100%', opacity: 0 },
    //   exit: { y: '-100%', opacity: 0 },
    }
    const primaryBioProps = { whileInView: { opacity: bioOpacity, y: bioTransform } }

    return (
      <motion.div data-component="profile-header" className={cn(className)} {...props} ref={ref}>
        <div className="flex flex-col gap-4 items-center">
          <Avatar className="size-24 lg:size-32" {...AvatarProps}>
            <AvatarImage src={profile.image} />
            <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1 justify-center items-center">
            <div className="w-full flex flex-col gap-1 text-center bg-background z-10">
              <h1 className="text-2xl font-bold tracking-tighter">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">
                <span className="text-primary">@</span>
                {profile.username}
              </p>
            </div>

            <motion.div
              className={cn('h-[3lh] max-w-62.5 text-center text-sm text-muted-foreground')}
              {...(position === 'primary' ? primaryBioProps : alternateBioProps)}
            >
              <span className="text-foreground">{profile.bio}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  },
)

ProfileHeader.displayName = 'ProfileHeader'
