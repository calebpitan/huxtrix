import Image, { ImageProps } from 'next/image'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'

export interface PostImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  className?: string
  rounded?: boolean
  aspectRatio?: number
}

export function PostImage({
  src,
  alt,
  className,
  rounded = true,
  aspectRatio = 1,
  ...props
}: PostImageProps) {
  return (
    <AspectRatio ratio={aspectRatio} className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        className={cn('object-cover', rounded && 'rounded-lg')}
        sizes="(max-width: 768px) 100vw, 400px"
        {...props}
      />
    </AspectRatio>
  )
}
