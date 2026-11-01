import { TextEditorProvider } from '@/compositions/editor'
import { PageLayout } from '@/compositions/layout'

import { CreateNavigationGuard } from './navigation-guard'
import { CreatePlateController } from './plate-controller'

export interface CreateLayoutProps {
  children: React.ReactElement
  sidebar: React.ReactElement
  appbar: React.ReactElement
}

export default function CreateLayout({ children, sidebar, appbar }: CreateLayoutProps) {
  return (
    <TextEditorProvider>
      <CreatePlateController>
        <CreateNavigationGuard />
        <PageLayout
          className="h-[calc(100dvh_-_var(--topbar-height))] xl:h-auto"
          contextClassName="[&>:first-child]:w-100"
        >
          <div className="-mx-4 mt-0 h-full sm:-mx-8 lg:-mx-0 lg:w-full">
            {appbar}
            {children}
          </div>

          {sidebar}
        </PageLayout>
      </CreatePlateController>
    </TextEditorProvider>
  )
}
