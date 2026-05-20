'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero from '@/components/page-hero'
import { Star, Plus, X, Loader2 } from 'lucide-react'
import { getFeedback, submitFeedback } from '@/lib/api'

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type={onChange ? 'button' : undefined} onClick={() => onChange?.(n)} className="transition-colors">
          <Star size={onChange ? 20 : 14} className={n <= value ? 'text-[var(--color-accent)] fill-[var(--color-accent)]' : 'text-[var(--color-border)]'} fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  )
}

const input = 'w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm bg-[var(--color-input)] focus:outline-none focus:border-[var(--color-primary)] transition-colors'

export default function FeedbackPage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ type: '', rating: 0, subject: '', message: '' })
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    getFeedback()
      .then((data) => setList(data))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  async function submit(e) {
    e.preventDefault()
    if (!form.type || !form.rating || !form.subject || !form.message) return
    try {
      const res = await submitFeedback({ author: 'You', ...form })
      setList((p) => [res.feedback, ...p])
    } catch (_) {
      const local = { id: Date.now(), author: 'You', ...form, date: new Date().toISOString().split('T')[0] }
      setList((p) => [local, ...p])
    }
    setForm({ type: '', rating: 0, subject: '', message: '' })
    setModal(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Navbar />
      <PageHero
        title="Feedback"
        current="Feedback"
        description="Browse patient reviews and submit new feedback with the same existing behavior, now presented in a clearer healthcare-inspired layout."
      />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        <div className="mb-10 flex justify-end">
          <button onClick={() => setModal(true)} className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:bg-[var(--color-primary-light)]">
            <Plus size={14} /> Submit Feedback
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-[var(--color-text-muted)]">
            <Loader2 size={18} className="animate-spin" /> Loading feedback...
          </div>
        ) : list.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-10 text-center shadow-[var(--shadow-card)]">No feedback yet. Be the first to share!</p>
        ) : (
          <div className="space-y-3">
            {list.map((fb) => (
              <div key={fb.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-[var(--color-foreground)] text-sm">{fb.author}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{fb.subject}</p>
                  </div>
                  <Stars value={fb.rating} />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">{fb.message}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium uppercase tracking-wide px-2 py-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-[var(--color-text-muted)] capitalize">{fb.type}</span>
                  <span className="text-xs text-[var(--color-text-light)]">{new Date(fb.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <div className="bg-[var(--color-card-elevated)] border border-[var(--color-border)] rounded-[28px] p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">Submit Feedback</h3>
              <button onClick={() => setModal(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Type *</label>
                <select value={form.type} onChange={set('type')} required className={input}>
                  <option value="">Select type</option>
                  <option value="doctor">Doctor</option>
                  <option value="service">Service</option>
                  <option value="facility">Facility</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Rating *</label>
                <Stars value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Subject *</label>
                <input value={form.subject} onChange={set('subject')} required placeholder="Brief subject" className={input} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Message *</label>
                <textarea value={form.message} onChange={set('message')} required rows={3} placeholder="Share your experience..." className={input + ' resize-none'} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-[var(--color-border)] text-sm rounded text-[var(--color-text-secondary)] hover:border-[var(--color-foreground)] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded hover:bg-[var(--color-primary-light)] transition-colors">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
