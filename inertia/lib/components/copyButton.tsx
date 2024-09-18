'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
}

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopied(false)
      return false
    }
  }

  return { copied, copy }
}

export default function CopyButton({ text, className }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <Button
      onClick={() => copy(text)}
      variant="ghost"
      size="icon"
      className={cn(
        'absolute top-2 right-2 text-muted-foreground hover:text-foreground',
        copied && 'right-4',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <span className="flex items-center gap-1">
          Copied <Check className="h-4 w-4" />
        </span>
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}
