import { User } from '@/lib/datasource/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getAuthUser(token: string): Promise<User> {
  return Promise.resolve({
    name: 'Caleb Adepitan',
    username: 'caleb',
    image: 'https://avatars.githubusercontent.com/u/36812893?v=4',
    bio: 'I am a software engineer. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    social: [
      { name: 'x', url: 'https://x.com/caleb' },
      { name: 'ig', url: 'https://instagram.com/caleb' },
      { name: 'yt', url: 'https://youtube.com/caleb' },
      { name: 'tiktok', url: 'https://tiktok.com/caleb' },
      { name: 'substack', url: 'https://substack.com/caleb' },
    ],
  })
}
