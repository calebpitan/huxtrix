import { Fragment } from 'react'

import { headers } from 'next/headers'

import { getNavItems } from '@/compositions/data/nav-items'
import { getSessionUser } from '@/lib/datasource/user'
import { getServerUrl } from '@/lib/server'

import { PageBottomBar } from './PageBottomBar'
import { PageTopBar } from './PageTopBar'

export interface PageAppBarProps {
  title?: string
}

export async function PageAppBar({ title }: PageAppBarProps) {
  const headersList = await headers()
  const user = await getSessionUser()
  const uri = getServerUrl(headersList, (v) => new URL(v))
  const items = getNavItems(user, { pageUrl: uri })

  return (
    <Fragment>
      <PageTopBar title={title} />
      <PageBottomBar items={items} />
    </Fragment>
  )
}
