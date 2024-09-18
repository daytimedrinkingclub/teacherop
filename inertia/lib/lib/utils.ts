import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculatePercentage(total: number = 0, completed: number = 0) {
  return Math.round((completed || 0 / total || 0) * 100)
}
