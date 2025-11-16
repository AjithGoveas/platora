import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  categories: string[]
  value?: string
  onChange?: (c: string) => void
}

export default function Categories({ categories, value, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((c) => {
        const active = c === value
        return (
          <button
            key={c}
            onClick={() => onChange && onChange(c)}
            className={cn(
              'whitespace-nowrap px-3 py-1 rounded-full text-sm border',
              active ? 'bg-rose-600 text-white border-rose-600' : 'bg-card/60 text-muted-foreground'
            )}
          >
            {c}
          </button>
        )
      })}
    </div>
  )
}

