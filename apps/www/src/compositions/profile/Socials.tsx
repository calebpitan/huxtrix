'use client'

import { HTMLMotionProps, motion } from 'motion/react'

import { cn } from '@/lib/utils'
import Instagram from '@/public/icons/instagram.svg'
import Substack from '@/public/icons/substack.svg'
import Tiktok from '@/public/icons/tiktok.svg'
import X from '@/public/icons/x.svg'
import Youtube from '@/public/icons/youtube.svg'
import { ComponentProps, FC } from 'react'

export interface SocialProfile {
  name: 'x' | 'ig' | 'yt' | 'tiktok' | 'substack'
  url: string | null
}

export interface SocialProfilesProps extends HTMLMotionProps<'div'> {
  profiles: SocialProfile[]
}

const icons = {
  x: X as FC<ComponentProps<'svg'>>,
  ig: Instagram as FC<ComponentProps<'svg'>>,
  yt: Youtube as FC<ComponentProps<'svg'>>,
  tiktok: Tiktok as FC<ComponentProps<'svg'>>,
  substack: Substack as FC<ComponentProps<'svg'>>,
}

export const SocialProfiles = ({ className, profiles, ...props }: SocialProfilesProps) => {
  return (
    <motion.div
      data-component="social-profiles"
      className={cn('flex flex-row gap-8', className)}
      {...props}
    >
      {profiles.map((profile) => {
        if (!profile.url) return null

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
