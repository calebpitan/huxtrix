export type Profile = {
  name: string
  username: string
  image: string
  bio: string
  social: SocialProfile[]
}

export type SocialProfile = {
  name: 'x' | 'ig' | 'yt' | 'tiktok' | 'substack'
  url: string
}
