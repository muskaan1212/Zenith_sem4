'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] shadow-[var(--shadow-card)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} mode` : 'Toggle theme'}
      title={mounted ? `Switch to ${isDark ? 'light' : 'dark'} mode` : 'Toggle theme'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
