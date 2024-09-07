import { Transmit } from '@adonisjs/transmit-client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transmit = new Transmit({
  baseUrl: window.location.origin,
})
