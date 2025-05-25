import { Fragment } from 'react'

type ProfileLayoutProps = Readonly<{ children: React.ReactNode }>

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return <Fragment>{children}</Fragment>
}
