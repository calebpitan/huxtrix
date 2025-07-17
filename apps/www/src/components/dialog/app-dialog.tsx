'use client'

import { ComponentProps, ReactElement, ReactNode } from 'react'

import { Sheet } from '@silk-hq/components'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Discriminate } from '@/lib/types'
import { cn } from '@/lib/utils'

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
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface AppSwipeDialogProps
  extends AppDialogBaseProps,
    Omit<ComponentProps<typeof Sheet.Root>, SwipeDialogOmittedProps> {
  children: ReactNode
  Trigger?: ReactElement<ComponentProps<typeof Sheet.Trigger>>
  SwipeContentProps?: ComponentProps<typeof Sheet.Content>
}

interface AppFloatDialogProps
  extends AppDialogBaseProps,
    Omit<ComponentProps<typeof Dialog>, FloatDialogOmittedProps> {
  children: ReactNode
  Footer?: ReactElement<ComponentProps<typeof DialogFooter>>
  Trigger?: ReactElement<ComponentProps<typeof DialogTrigger>>
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
export type AppDialogTriggerProps<T extends DialogType> = {
  float: ComponentProps<typeof DialogTrigger> & Discriminate<'float', 'variant'>
  swipe: ComponentProps<typeof Sheet.Trigger> & Discriminate<'swipe', 'variant'>
}[T]

export function AppDialogRoot<T extends DialogType>(props: AppDialogProps<T>) {
  if (props.type === 'float') {
    const { type: _, Trigger, ...rest } = props
    return <AppFloatDialog Trigger={Trigger as AppFloatDialogProps['Trigger']} {...rest} />
  }

  const { type: _, Trigger, ...rest } = props
  return <AppSwipeDialog Trigger={Trigger as AppSwipeDialogProps['Trigger']} {...rest} />
}

export function AppDialogTrigger<T extends DialogType>(props: AppDialogTriggerProps<T>) {
  if (props.variant === 'float') {
    const { variant: _, children, ref, ...rest } = props
    return (
      <DialogTrigger ref={ref} {...rest}>
        {children}
      </DialogTrigger>
    )
  }

  const { variant: _, children, onClick, ...rest } = props
  return (
    <Sheet.Trigger onClick={onClick} {...rest}>
      {children}
    </Sheet.Trigger>
  )
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
  Trigger: trigger,
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
    <Sheet.Root
      className="Sheet-root"
      license="commercial"
      presented={open}
      onPresentedChange={onOpenChange}
      {...rest}
    >
      {trigger}
      <Sheet.Portal>
        <Sheet.View className="Sheet-view z-50" nativeFocusScrollPrevention={false}>
          <Sheet.Backdrop className="Sheet-backdrop dark:bg-muted" />
          <Sheet.Content
            className={cn(
              'Sheet-content safe-area grid h-auto justify-items-center',
              contentClassName,
            )}
            {...contentProps}
          >
            <Sheet.BleedingBackground className="Sheet-bleedingBackground bg-background rounded-t-4xl" />
            <Sheet.Handle className="Sheet-handle dark:bg-muted mt-2 rounded-full" />

            <div className="mt-12 flex h-fit max-h-dvh flex-col overflow-auto">
              <div data-component="content" className="flex flex-col gap-4 p-4">
                {(titleElement !== undefined || descriptionElement !== undefined) && (
                  <div data-component="header" className="block flex-1 space-y-3">
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
  Footer: footer,
  Trigger: trigger,
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
      {trigger}
      <DialogContent className={cn('rounded-4xl gap-6', contentClassName)} {...contentProps}>
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

export {
  AppDialogRoot as Root,
  AppDialogTrigger as Trigger,
  AppDialogTitle as Title,
  AppDialogDescription as Description,
}
