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
