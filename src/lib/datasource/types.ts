export interface User {
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
