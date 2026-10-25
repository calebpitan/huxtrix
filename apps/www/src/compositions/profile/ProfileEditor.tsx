'use client'

import { ComponentProps, useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'

import isEqual from 'lodash.isequal'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { USERNAME_REGEX, isUrl } from '@/lib/utils'

// Define the social media types based on the schema
const SOCIAL_TYPES = {
  x: 'X (Twitter)',
  ig: 'Instagram',
  yt: 'YouTube',
  tiktok: 'TikTok',
} as const

type SocialType = keyof typeof SOCIAL_TYPES

// Form schema based on the user model
const profileFormSchema = z.object({
  givenName: z.string().min(1, 'First name is required'),
  familyName: z.string().min(1, 'Last name is required'),
  username: z.string().regex(USERNAME_REGEX, 'Invalid username format'),
  summary: z.string().max(500, 'Summary must be less than 500 characters').optional(),
  image: z
    .string()
    .refine((val) => !val || isUrl(val), 'Must be a valid URL')
    .optional(),
  socials: z
    .object({
      x: z
        .string()
        .refine((val) => !val || isUrl(val), 'Must be a valid URL')
        .optional(),
      ig: z
        .string()
        .refine((val) => !val || isUrl(val), 'Must be a valid URL')
        .optional(),
      yt: z
        .string()
        .refine((val) => !val || isUrl(val), 'Must be a valid URL')
        .optional(),
      tiktok: z
        .string()
        .refine((val) => !val || isUrl(val), 'Must be a valid URL')
        .optional(),
    })
    .optional(),
})

type ProfileFormData = z.infer<typeof profileFormSchema>

export interface ProfileEditorProps extends ComponentProps<'div'> {
  initialData?: Partial<{
    givenName: string
    familyName: string
    username: string
    summary: string
    image: string
    socials: Record<SocialType, string>
  }>
  onSave?: (data: ProfileFormData) => void | Promise<void>
  isLoading?: boolean
}

const emptyToUndefined = (value: string | undefined) => {
  const trimmed = value?.trim()
  return trimmed === '' ? undefined : trimmed
}

const isFormDataEqual = (a: Partial<ProfileFormData>, b: ProfileFormData): boolean => {
  return isEqual(a, b)
}

export function ProfileEditor({
  initialData = {},
  onSave,
  isLoading = false,
  className,
  ...props
}: ProfileEditorProps) {
  const [hasChanges, setHasChanges] = useState(false)

  // Transform initial data to match form schema
  const initialFormData: ProfileFormData = useMemo(
    () => ({
      givenName: initialData.givenName ?? '',
      familyName: initialData.familyName ?? '',
      username: initialData.username ?? '',
      summary: initialData.summary ?? '',
      image: initialData.image ?? '',
      socials: {
        x: initialData.socials?.x ?? '',
        ig: initialData.socials?.ig ?? '',
        yt: initialData.socials?.yt ?? '',
        tiktok: initialData.socials?.tiktok ?? '',
      },
    }),
    [initialData],
  )

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialFormData,
    mode: 'onBlur',
  })

  // Reset form when initial data changes
  //   useEffect(() => {
  //     form.reset(transformedInitialData)
  //     setHasChanges(false)
  //   }, [form, transformedInitialData])

  // Watch for changes in form data
  useEffect(() => {
    if (!initialFormData) return

    const subscription = form.watch((value) => {
      const hasDataChanged = !isFormDataEqual(value, initialFormData)
      setHasChanges(hasDataChanged)
    })

    return () => subscription.unsubscribe()
  }, [form, initialFormData])

  const handleSubmit = async (data: ProfileFormData) => {
    if (!onSave) return

    // Clean up empty strings and null values
    const cleanedData: ProfileFormData = {
      ...data,
      username: data.username,
      summary: data.summary,
      image: emptyToUndefined(data.image),
      socials: {
        x: emptyToUndefined(data.socials?.x),
        ig: emptyToUndefined(data.socials?.ig),
        yt: emptyToUndefined(data.socials?.yt),
        tiktok: emptyToUndefined(data.socials?.tiktok),
      },
    }

    await onSave(cleanedData)

    // Reset changes state after successful save
    setHasChanges(false)
  }

  return (
    <div className={className} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your profile information and social media links.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                void form.handleSubmit(handleSubmit)(e)
              }}
              className="space-y-6"
            >
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="givenName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="familyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/your-image.jpg"
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself..."
                          className="min-h-20 resize-none"
                          maxLength={500}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <p className="text-muted-foreground text-xs">
                          {field.value.length}/500 characters
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Social Media Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Media Links</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(SOCIAL_TYPES).map(([key, label]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`socials.${key as SocialType}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Your ${label} profile URL`}
                              type="url"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset(initialFormData)
                    setHasChanges(false)
                  }}
                  disabled={!hasChanges || isLoading}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={!hasChanges || isLoading || !form.formState.isValid}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
