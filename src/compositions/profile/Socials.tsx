'use client'

import { HTMLMotionProps, motion } from 'motion/react'

import { cn } from '@/lib/utils'
import Instagram from '@/public/icons/instagram.svg'
import Substack from '@/public/icons/substack.svg'
import Tiktok from '@/public/icons/tiktok.svg'
import X from '@/public/icons/x.svg'
import Youtube from '@/public/icons/youtube.svg'

export type SocialProfile = { name: 'x' | 'ig' | 'yt' | 'tiktok' | 'substack'; url: string }

export interface SocialProfilesProps extends HTMLMotionProps<'div'> {
  profiles: SocialProfile[]
}

const icons = {
  x: X,
  ig: Instagram,
  yt: Youtube,
  tiktok: Tiktok,
  substack: Substack,
}

export const SocialProfiles = ({ className, profiles, ...props }: SocialProfilesProps) => {
  return (
    <motion.div
      data-component="social-profiles"
      className={cn('flex flex-row gap-8', className)}
      {...props}
    >
      {profiles.map((profile) => {
        const BrandIcon = icons[profile.name]
        return (
          <a href={profile.url} key={profile.name}>
            <BrandIcon className="fill-muted-foreground h-6 w-6" />
          </a>
        )
      })}
    </motion.div>
  )
}
