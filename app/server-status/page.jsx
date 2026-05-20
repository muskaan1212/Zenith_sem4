'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero from '@/components/page-hero'

const API_BASE = 'http://localhost:3001'

export default function ServerStatusPage() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('checking') // 'checking' | 'online' | 'offline'
  const [lastChecked, setLastChecked] = useState(null)
  const [loading, setLoading] = useState(false)

  const check = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) })
      if (!res.ok) throw new Error('Non-200 response')
      const json = await res.json()
      setData(json)
      setStatus('online')
    } catch {
      setData(null)
      setStatus('offline')
    } finally {
      setLastChecked(new Date())
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    check()
    const interval = setInterval(check, 15000)
    return () => clearInterval(interval)
  }, [check])

  const dot = status === 'online'
    ? 'bg-emerald-500'
    : status === 'offline'
      ? 'bg-red-500'
      : 'bg-amber-400'

  const label = status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking...'

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-surface)]">
      <Navbar />
      <PageHero
        title="Backend Status"
        current="System"
        description="Live health check for the Zenith Express API running on port 3001. Auto-refresh remains active every 15 seconds."
      />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16">

        {/* Main status card */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] overflow-hidden mb-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <span className={`relative flex h-3 w-3 ${status === 'online' ? 'animate-none' : ''}`}>
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'online' ? 'animate-ping bg-emerald-400' : ''}`} />
                <span className={`relative inline-flex rounded-full h-3 w-3 ${dot}`} />
              </span>
              <span className="font-semibold text-[var(--color-foreground)]">Zenith Healthcare API</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status === 'online' ? 'bg-emerald-500/12 text-emerald-400' :
                status === 'offline' ? 'bg-red-500/12 text-red-400' :
                  'bg-amber-500/12 text-amber-300'
                }`}>
                {label}
              </span>
              <button
                onClick={check}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-3 divide-x divide-[var(--color-border)]">
            {[
              { label: 'Host', value: 'localhost' },
              { label: 'Port', value: data?.port ?? '5000' },
              { label: 'Uptime', value: data ? `${data.uptime}s` : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="px-6 py-4">
                <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wide mb-1">{label}</p>
                <p className="font-mono text-sm font-semibold text-[var(--color-foreground)]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Routes table */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] overflow-hidden mb-6 shadow-[var(--shadow-card)]">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <p className="text-sm font-semibold text-[var(--color-foreground)]">API Routes</p>
          </div>
          {data?.routes ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {['Endpoint', 'Methods', 'Records'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wide px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.routes.map((r, i) => (
                  <tr key={i} className={i < data.routes.length - 1 ? 'border-b border-[var(--color-border)]' : ''}>
                    <td className="px-6 py-3 font-mono text-[var(--color-foreground)]">{r.path}</td>
                    <td className="px-6 py-3 text-[var(--color-text-muted)]">{r.method}</td>
                    <td className="px-6 py-3">
                      <span className="bg-[var(--color-surface)] text-[var(--color-text-muted)] text-xs font-mono px-2 py-0.5 rounded">{r.records}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-[var(--color-text-light)]">
              {status === 'offline' ? 'Could not connect to backend. Make sure it is running.' : 'Loading route data...'}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {lastChecked && (
          <p className="text-xs text-center text-[var(--color-text-light)]">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </main>

      <Footer />
    </div>
  )
}
