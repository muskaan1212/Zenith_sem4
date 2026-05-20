import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-hero)]">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <Image src="/zenith-logo.svg" alt="Zenith logo" width={232} height={52} className="h-11 w-auto" />
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-sm">Advanced care, thoughtful tools, and a patient experience designed to feel calm and clear.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/appointments', label: 'Appointments' },
            { href: '/prescriptions', label: 'Prescriptions' },
            { href: '/wellness', label: 'Wellness' },
            { href: '/feedback', label: 'Feedback' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-[var(--color-text-light)]">&copy; {new Date().getFullYear()} Zenith</p>
      </div>
    </footer>
  )
}
