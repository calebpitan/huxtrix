'use client'

import { ComponentProps, ReactElement, ReactNode } from 'react'

import { Sheet } from '@silk-hq/components'

import { Dialog, DialogContent, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type Discriminate<T extends string> = { type: T }

type DialogType = 'swipe' | 'float'
type FloatDialogOmittedProps = 'open' | 'onOpenChange'
type SwipeDialogOmittedProps =
  | 'children'
  | 'title'
  | 'license'
  | 'role'
  | 'presented'
  | 'defaultPresented'
  | 'onPresentedChange'

interface AppDialogBaseProps {
  title?: ReactElement<ComponentProps<typeof AppDialogTitle>> | string
  description?: ReactElement<ComponentProps<typeof AppDialogDescription>> | string
  open: boolean
  onOpenChange(open: boolean): void
}

interface AppSwipeDialogProps
  extends AppDialogBaseProps,
    Omit<ComponentProps<typeof Sheet.Root>, SwipeDialogOmittedProps> {
  children: ReactNode
  SwipeContentProps?: ComponentProps<typeof Sheet.Content>
}

interface AppFloatDialogProps
  extends AppDialogBaseProps,
    Omit<ComponentProps<typeof Dialog>, FloatDialogOmittedProps> {
  children: ReactNode
  footer?: ReactElement<ComponentProps<typeof DialogFooter>>
  FloatContentProps?: ComponentProps<typeof DialogContent>
}

type FloatDialogDiscriminator = Discriminate<Extract<DialogType, 'float'>>
type SwipeDialogDiscriminator = Discriminate<Extract<DialogType, 'swipe'>>
type Discriminator = FloatDialogDiscriminator | SwipeDialogDiscriminator

export type AppDialogProps<T extends DialogType = DialogType> = {
  float: AppFloatDialogProps & Discriminate<T> // Extract<T, 'float'>
  swipe: AppSwipeDialogProps & Discriminate<T> // Extract<T, 'swipe'>
}[T]

export type AppDialogTitleProps = ComponentProps<typeof DialogTitle> & Discriminator
export type AppDialogDescriptionProps = ComponentProps<typeof DialogDescription> & Discriminator

export function AppDialogRoot<T extends DialogType>(props: AppDialogProps<T>) {
  if (props.type === 'float') {
    const { type: _, ...rest } = props
    return <AppFloatDialog {...rest} />
  }

  const { type: _, ...rest } = props
  return <AppSwipeDialog {...rest} />
}

export function AppDialogTitle({ children, className, type, ...rest }: AppDialogTitleProps) {
  if (type === 'float') {
    return (
      <DialogTitle className={cn(className)} {...rest}>
        {children}
      </DialogTitle>
    )
  }

  return (
    <h2 className={cn('text-lg font-bold', className)} {...rest}>
      {children}
    </h2>
  )
}

export function AppDialogDescription({
  children,
  className,
  type,
  ...rest
}: AppDialogDescriptionProps) {
  if (type === 'float') {
    return (
      <DialogDescription className={cn(className)} {...rest}>
        {children}
      </DialogDescription>
    )
  }

  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...rest}>
      {children}
    </p>
  )
}

function AppSwipeDialog({
  title,
  description,
  children,
  open,
  onOpenChange,
  SwipeContentProps: { className: contentClassName, ...contentProps } = {},
  ...rest
}: AppSwipeDialogProps) {
  const titleElement =
    typeof title === 'string' ? <AppDialogTitle type="swipe">{title}</AppDialogTitle> : title
  const descriptionElement =
    typeof description === 'string' ? (
      <AppDialogDescription type="swipe">{description}</AppDialogDescription>
    ) : (
      description
    )

  return (
    <Sheet.Root license="commercial" presented={open} onPresentedChange={onOpenChange} {...rest}>
      <Sheet.Portal>
        <Sheet.View>
          <Sheet.Backdrop className="dark:bg-muted" />
          <Sheet.Content
            className={cn('bg-background h-fit rounded-t-4xl', contentClassName)}
            {...contentProps}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-center py-2">
                <Sheet.Handle className="dark:bg-muted rounded-full" />
              </div>

              <div data-component="content" className="flex flex-1 flex-col gap-4 p-4">
                {(titleElement !== undefined || descriptionElement !== undefined) && (
                  <div data-component="header" className="mb-auto block flex-1 space-y-3">
                    {titleElement}
                    {descriptionElement}
                  </div>
                )}
                {children}
              </div>
            </div>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}

function AppFloatDialog({
  title,
  description,
  children,
  footer,
  FloatContentProps: { className: contentClassName, ...contentProps } = {},
  ...rest
}: AppFloatDialogProps) {
  const titleElement = typeof title === 'string' ? <DialogTitle>{title}</DialogTitle> : title
  const descriptionElement =
    typeof description === 'string' ? (
      <DialogDescription>{description}</DialogDescription>
    ) : (
      description
    )

  return (
    <Dialog {...rest}>
      <DialogContent className={cn('rounded-4xl', contentClassName)} {...contentProps}>
        {(titleElement !== undefined || descriptionElement !== undefined) && (
          <DialogHeader>
            {titleElement}
            {descriptionElement}
          </DialogHeader>
        )}
        {children}
        {footer}
      </DialogContent>
    </Dialog>
  )
}

export { AppDialogRoot as Root, AppDialogTitle as Title, AppDialogDescription as Description }
