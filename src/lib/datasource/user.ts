import { User } from '@/lib/datasource/types'

export type { User }

export function getUserProfileById(_id: string): Promise<User> {
  return Promise.resolve({
    name: 'Caleb Adepitan',
    username: 'caleb',
    image: 'https://avatars.githubusercontent.com/u/36812893?v=4',
    bio: 'I am a software engineer. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    social: [
      { name: 'x', url: 'https://x.com/realongman' },
      { name: 'ig', url: 'https://instagram.com/realongman' },
      { name: 'yt', url: null },
      { name: 'tiktok', url: null },
      { name: 'substack', url: 'https://substack.com/calebpitan' },
    ],
  })
}
