'use client'

import { Fragment } from 'react'

import dynamic from 'next/dynamic'

const PostCreator = dynamic(() => import('./creator').then((m) => m.PostCreator), {
  ssr: false,
})

export function CreatorMain() {
  return (
    <Fragment>
      <PostCreator />
    </Fragment>
  )
}
