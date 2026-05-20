'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero from '@/components/page-hero'
import { Plus, X, Calendar, Clock, FileText, Loader2 } from 'lucide-react'
import { getAppointments, createAppointment } from '@/lib/api'

const DOCTORS = { 'Dr. A. Sharma': 'Cardiology', 'Dr. P. Gupta': 'Neurology', 'Dr. R. Mehta': 'Orthopaedics', 'Dr. S. Patel': 'Paediatrics' }

const input = 'w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm bg-[var(--color-input)] focus:outline-none focus:border-[var(--color-primary)] transition-colors'

export default function AppointmentsPage() {
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ doctor: '', date: '', time: '', reason: '' })
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  const now = new Date()
  const upcoming = appts.filter((a) => new Date(a.date) >= now)
  const past = appts.filter((a) => new Date(a.date) < now)

  useEffect(() => {
    getAppointments()
      .then((data) => setAppts(data))
      .catch(() => setAppts([]))
      .finally(() => setLoading(false))
  }, [])

  async function book(e) {
    e.preventDefault()
    const payload = { doctor: form.doctor, specialty: DOCTORS[form.doctor] || 'General', date: form.date, time: form.time, reason: form.reason }
    try {
      const res = await createAppointment(payload)
      setAppts((p) => [res.appointment, ...p])
    } catch (_) {
      const local = { id: Date.now(), ...payload }
      setAppts((p) => [local, ...p])
    }
    setForm({ doctor: '', date: '', time: '', reason: '' })
    setModal(false)
    window.location.href = '/thank-you'
  }

  function Card({ a }) {
    const future = new Date(a.date) >= now
    return (
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="font-semibold text-[var(--color-foreground)] text-sm">{a.doctor}</p>
            <p className="text-xs text-[var(--color-primary)] font-semibold uppercase tracking-wide mt-0.5">{a.specialty || a.spec}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${future ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'}`}>
            {future ? 'Upcoming' : 'Completed'}
          </span>
        </div>
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]"><Calendar size={12} className="text-[var(--color-text-light)]" />{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]"><Clock size={12} className="text-[var(--color-text-light)]" />{a.time}</div>
          {a.reason && <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]"><FileText size={12} className="text-[var(--color-text-light)]" />{a.reason}</div>}
        </div>
        {future && (
          <div className="flex gap-2">
            <button className="flex-1 py-1.5 text-xs border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] hover:border-[var(--color-foreground)] transition-colors">Reschedule</button>
            <button onClick={() => setAppts((p) => p.filter((x) => x.id !== a.id))} className="flex-1 py-1.5 text-xs border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] hover:border-[var(--color-error)] hover:text-[var(--color-error)] transition-colors">Cancel</button>
          </div>
        )}
      </div>
    )
  }

  function Section({ title, list }) {
    return (
      <div className="mb-10">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)] mb-5">{title} <span className="text-[var(--color-text-light)] font-sans font-normal text-base">({list.length})</span></h2>
        {list.length === 0
          ? <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-8 text-center shadow-[var(--shadow-card)]">No appointments here.</p>
          : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{list.map((a) => <Card key={a.id} a={a} />)}</div>
        }
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Navbar />
      <PageHero
        title="Appointments"
        current="Appointments"
        description="Manage upcoming consultations, view completed visits, and book fresh appointments without changing any of the existing workflows."
      />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <div className="mb-10 flex justify-end">
          <button onClick={() => setModal(true)} className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:bg-[var(--color-primary-light)]">
            <Plus size={14} /> Book New
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-[var(--color-text-muted)]">
            <Loader2 size={18} className="animate-spin" /> Loading appointments...
          </div>
        ) : (
          <>
            <Section title="Upcoming" list={upcoming} />
            <Section title="Past" list={past} />
          </>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <div className="bg-[var(--color-card-elevated)] border border-[var(--color-border)] rounded-[28px] p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">Book Appointment</h3>
              <button onClick={() => setModal(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={book} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Doctor *</label>
                <select value={form.doctor} onChange={set('doctor')} required className={input}>
                  <option value="">Select a doctor</option>
                  {Object.keys(DOCTORS).map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Date *</label>
                  <input type="date" value={form.date} onChange={set('date')} required min={new Date().toISOString().split('T')[0]} className={input} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Time *</label>
                  <input type="time" value={form.time} onChange={set('time')} required className={input} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Reason</label>
                <input value={form.reason} onChange={set('reason')} placeholder="Brief description" className={input} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-[var(--color-border)] text-sm rounded text-[var(--color-text-secondary)] hover:border-[var(--color-foreground)] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded hover:bg-[var(--color-primary-light)] transition-colors">Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
