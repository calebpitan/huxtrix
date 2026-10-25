export interface Profile {
  name: string
  username: string
  avatar: string | null
  summary: string
  socials: SocialProfile[]
}

export interface SocialProfile {
  name: 'x' | 'ig' | 'yt' | 'tiktok' | 'substack'
  url: string
}

export interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  aria: string
}
