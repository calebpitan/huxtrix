'use client'

import { ComponentProps } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { USERNAME_REGEX } from '@/lib/utils'

export interface ProfileSetupProps extends ComponentProps<'div'> {
  data: { firstName?: string; lastName?: string; username?: string }
  onSave: (respones: z.infer<typeof formSchema>) => void
}

const formSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string(),
  username: z.string().regex(USERNAME_REGEX, { error: 'Invalid username' }),
})

export function ProfileSetupForm({ data, onSave, ...props }: ProfileSetupProps) {
  const { firstName = '', lastName = '', username = '' } = data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName, lastName, username },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values)
  }

  return (
    <div {...props}>
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <Button type="submit" size="lg" className="w-full" variant="default">
            Save
          </Button>
        </form>
      </Form>
    </div>
  )
}
