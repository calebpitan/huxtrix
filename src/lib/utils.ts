import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const _formatNumber = (num: number): string => {
  const lookup = [
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ]

  const item = lookup.find((item) => num >= item.value)

  if (!item) return num.toString()

  const formattedNum = (num / item.value).toFixed(1).replace(/\.0$/, '')
  return formattedNum + item.symbol
}

export const formatNumber = (num: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num)
}

export const isFn = (value: unknown): value is CallableFunction => {
  return typeof value === 'function'
}

export const scroll = (x: number, y: number) =>
  window.scrollTo({ top: y, left: x, behavior: 'smooth' })

export const createDomRect = (rect: Partial<DOMRect> = {}): DOMRect => ({
  left: rect.left ?? 0,
  top: rect.top ?? 0,
  width: rect.width ?? 0,
  height: rect.height ?? 0,
  bottom: rect.bottom ?? 0,
  right: rect.right ?? 0,
  x: rect.x ?? 0,
  y: rect.y ?? 0,
  toJSON() {
    return this
  },
})

/**
 * Creates a smooth quadratic bell curve easing function.
 *
 * This function generates a smooth, symmetrical bell curve that:
 * - Starts at 0 when x = 0
 * - Peaks at 1 when x = 0.5
 * - Returns to 0 when x = 1
 *
 * The curve is quadratic (x²), making it suitable for smooth, gradual transitions.
 *
 * @param x - A number between 0 and 1 representing the progress of the animation
 * @returns A number between 0 and 1 representing the eased value
 *
 * @example
 * ```ts
 * // For a smooth fade in/out effect
 * const opacity = quadraticEase(progress) // progress is between 0 and 1
 * ```
 */
export const quadraticEase = (x: number) => {
  return 4 * x * (1 - x)
}

/**
 * Creates a sharp quartic bell curve easing function.
 *
 * This function generates a more pronounced, symmetrical bell curve that:
 * - Starts at 0 when x = 0
 * - Peaks at 1 when x = 0.5
 * - Returns to 0 when x = 1
 *
 * The curve is quartic (x⁴), making it suitable for more dramatic transitions
 * with sharper acceleration and deceleration.
 *
 * @param x - A number between 0 and 1 representing the progress of the animation
 * @returns A number between 0 and 1 representing the eased value
 *
 * @example
 * ```ts
 * // For a more dramatic fade in/out effect
 * const opacity = quarticEase(progress) // progress is between 0 and 1
 * ```
 */
export const quarticEase = (x: number) => {
  return 16 * x ** 2 * (1 - x) ** 2
}
