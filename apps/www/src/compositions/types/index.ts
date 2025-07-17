export interface Profile {
  name: string
  username: string
  image: string
  bio: string
  social: SocialProfile[]
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
