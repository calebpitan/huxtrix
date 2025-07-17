'use client'

import { ComponentProps } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface LinkPromptProps extends ComponentProps<'div'> {
  data: { text?: string; url?: string; og?: boolean }
  onConfirm: (respones: z.infer<typeof formSchema>) => void
}

const formSchema = z.object({
  text: z.string().optional(),
  url: z.string().url(),
  og: z.boolean().optional(),
})

export function LinkPrompt({ data, onConfirm, ...props }: LinkPromptProps) {
  const { text = '', url = '', og = false } = data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text, url, og },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onConfirm(values)
  }

  return (
    <div {...props}>
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Input placeholder="check out this example" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="og"
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-zinc-600 has-[[aria-checked=true]]:bg-zinc-50 dark:has-[[aria-checked=true]]:border-zinc-900 dark:has-[[aria-checked=true]]:bg-zinc-950">
                      <Checkbox
                        checked={value}
                        onCheckedChange={onChange}
                        {...field}
                        className="data-[state=checked]:border-zinc-600 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-white dark:data-[state=checked]:border-zinc-700 dark:data-[state=checked]:bg-zinc-700"
                      />
                      <div className="grid gap-1.5 font-normal">
                        <p className="text-sm font-medium leading-none">Preview</p>
                        <p className="text-muted-foreground text-xs">
                          Using OpenGraph and related metadata, insert a preview along with the
                          link.
                        </p>
                      </div>
                    </Label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <Button type="submit" size="lg" className="w-full" variant="secondary">
            Done
          </Button>
        </form>
      </Form>
    </div>
  )
}
