import { Profile } from '@/compositions/types'

export const profiles: Profile[] = [
  {
    name: 'John Doe',
    username: 'john_doe',
    image: 'https://github.com/shadcn.png',
    bio: 'I am a software engineer',
    social: [
      { name: 'x', url: 'https://x.com/john_doe' },
      { name: 'ig', url: 'https://instagram.com/john_doe' },
      { name: 'yt', url: 'https://youtube.com/john_doe' },
      { name: 'tiktok', url: 'https://tiktok.com/john_doe' },
      { name: 'substack', url: 'https://substack.com/john_doe' },
    ],
  },
  {
    name: 'Jane Doe',
    username: 'jane_doe',
    image: 'https://github.com/shadcn.png',
    bio: 'I am a software engineer',
    social: [
      { name: 'x', url: 'https://x.com/jane_doe' },
      { name: 'ig', url: 'https://instagram.com/jane_doe' },
      { name: 'yt', url: 'https://youtube.com/jane_doe' },
      { name: 'tiktok', url: 'https://tiktok.com/jane_doe' },
      { name: 'substack', url: 'https://substack.com/jane_doe' },
    ],
  },
  {
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
  },
]
