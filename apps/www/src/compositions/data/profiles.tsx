import { Profile } from '../types'

export const profiles: Profile[] = [
  {
    name: 'John Doe',
    username: 'john_doe',
    avatar: 'https://github.com/shadcn.png',
    summary: 'I am a software engineer',
    socials: [
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
    avatar: 'https://github.com/shadcn.png',
    summary: 'I am a software engineer',
    socials: [
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
    avatar: 'https://avatars.githubusercontent.com/u/36812893?v=4',
    summary:
      'I am a software engineer. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    socials: [
      { name: 'x', url: 'https://x.com/caleb' },
      { name: 'ig', url: 'https://instagram.com/caleb' },
      { name: 'yt', url: 'https://youtube.com/caleb' },
      { name: 'tiktok', url: 'https://tiktok.com/caleb' },
      { name: 'substack', url: 'https://substack.com/caleb' },
    ],
  },
]
