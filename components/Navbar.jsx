'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { LogOut, Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/theme-toggle'
import { useAuth } from '@/components/auth-provider'

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/appointments', label: 'Appointments' },
  { href: '/prescriptions', label: 'Prescriptions' },
  { href: '/wellness', label: 'Wellness' },
  { href: '/feedback', label: 'Feedback' },
  { href: '/profile', label: 'Profile' },
  { href: '/server-status', label: 'Server Status' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const safePathname = pathname || '/'
  const { user, logout, isAuthenticated } = useAuth()
  const isHome = safePathname === '/' && !isAuthenticated

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[var(--color-hero)]/88 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 h-[78px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center text-[var(--color-foreground)] transition-colors shrink-0">
          <Image src="/zenith-logo.svg" alt="Zenith logo" width={232} height={52} priority className="h-11 w-auto" />
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex min-w-0 items-center justify-center gap-0.5 flex-1" aria-label="Primary">
          {isHome ? (
            <></>
          ) : (
            NAV.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-2.5 py-2 text-[13px] font-medium rounded-lg whitespace-nowrap transition-colors ${safePathname === href ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'}`}>
                {label}
              </Link>
            ))
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <div className="hidden 2xl:flex items-center max-w-[170px] rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                <span className="ml-2 truncate font-semibold text-[var(--color-foreground)]">{user?.name || user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-primary)] bg-transparent px-3.5 py-2.5 text-sm font-semibold text-[var(--color-primary)] whitespace-nowrap hover:bg-[var(--color-primary)]/8 transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)]">
              Secure Login
            </span>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] transition-colors"
            onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <nav className="flex flex-col py-1" aria-label="Mobile navigation">
            {(isHome
              ? []
              : NAV
            ).map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`px-6 py-3 text-sm border-b border-[var(--color-border-subtle)] transition-colors ${safePathname === href ? 'text-[var(--color-primary)] font-semibold bg-[var(--color-hero)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hero)]'}`}>
                {label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  setOpen(false)
                  logout()
                }}
                className="px-6 py-3 text-left text-sm text-[var(--color-primary)]"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
