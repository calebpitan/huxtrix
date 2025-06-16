import { TextEditorProvider } from '@/compositions/editor'
import { PageLayout } from '@/compositions/layout'

export interface CreateLayoutProps {
  children: React.ReactElement
  sidebar: React.ReactElement
  appbar: React.ReactElement
}

export default function CreateLayout({ children, sidebar, appbar }: CreateLayoutProps) {
  return (
    <TextEditorProvider>
      <PageLayout>
        <div className="-mx-4 mt-0 sm:-mx-8 lg:-mx-0 lg:w-full">
          {appbar}
          {children}
        </div>

        {sidebar}
      </PageLayout>
    </TextEditorProvider>
  )
}
