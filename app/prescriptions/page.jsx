'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero from '@/components/page-hero'
import { Pill, Download, RefreshCw, Loader2 } from 'lucide-react'
import { getPrescriptions } from '@/lib/api'

const TABS = ['active', 'completed', 'refill']

function fmt(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PrescriptionsPage() {
  const [tab, setTab] = useState('active')
  const [allPrescriptions, setAllPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPrescriptions()
      .then((data) => setAllPrescriptions(data))
      .catch(() => setAllPrescriptions([]))
      .finally(() => setLoading(false))
  }, [])

  const list =
    tab === 'refill'
      ? allPrescriptions.filter((p) => p.status === 'active' && p.refills > 0)
      : allPrescriptions.filter((p) => p.status === tab)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Navbar />
      <PageHero
        title="Prescriptions"
        current="Prescriptions"
        description="Review active, completed, and refill-eligible medications using the same flows and actions, refreshed with the new healthcare UI."
      />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">

        <div className="flex gap-1 p-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-fit mb-8 shadow-[var(--shadow-card)]">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm capitalize rounded-md transition-all ${tab === t ? 'bg-[var(--color-primary)] text-white font-medium' : 'text-[var(--color-text-muted)] hover:text-[var(--color-foreground)]'}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-[var(--color-text-muted)]">
            <Loader2 size={18} className="animate-spin" /> Loading prescriptions...
          </div>
        ) : list.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-10 text-center shadow-[var(--shadow-card)]">
            No prescriptions found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((rx) => (
              <div key={rx.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-md bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                    <Pill size={16} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-foreground)] text-sm">{rx.med}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{rx.by}</p>
                  </div>
                  {tab === 'active' && (
                    <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-y-3 mb-4">
                  {[
                    ['Dosage', rx.dose],
                    ['Frequency', rx.freq],
                    ['Start', fmt(rx.start)],
                    ['End', fmt(rx.end)],
                    ...(rx.refills != null ? [['Refills Left', rx.refills]] : []),
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{l}</p>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {tab === 'active' && rx.refills > 0 && (
                    <button
                      onClick={() => alert('Refill requested!')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-[var(--color-accent)] text-[var(--color-foreground)] rounded hover:bg-[var(--color-accent-light)] transition-colors">
                      <RefreshCw size={11} /> Refill
                    </button>
                  )}
                  <button
                    onClick={() => alert('Downloaded!')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] hover:border-[var(--color-foreground)] transition-colors">
                    <Download size={11} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
