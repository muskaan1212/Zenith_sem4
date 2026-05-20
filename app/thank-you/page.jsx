import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Thank You | Zenith Healthcare',
  description: 'Your appointment request has been received.',
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-24 bg-[var(--color-surface)]">
        <div className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={28} className="text-[var(--color-primary)]" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">Request Received</p>
          <h1 className="font-serif text-3xl font-light text-[var(--color-foreground)] mb-4">Thank you!</h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-8 text-pretty">
            Your appointment request has been received. Our care team will contact you within 24 hours to confirm and answer any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="px-6 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded hover:bg-[var(--color-primary-light)] transition-colors">
              Return Home
            </Link>
            <Link href="/appointments" className="px-6 py-2.5 border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] rounded hover:border-[var(--color-foreground)] transition-colors">
              View Appointments
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
