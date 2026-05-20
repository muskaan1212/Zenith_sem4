'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero from '@/components/page-hero'
import { Bell, Calendar, CheckCircle, Clock, Plus, Trash2, RefreshCw, Loader2 } from 'lucide-react'
import { createReminder, deleteReminder, getAppointments, getReminders, updateReminder } from '@/lib/api'

const INIT_REMINDERS = [
  { id: 1, title: 'Take Morning Medication', time: '08:00', note: 'Take prescribed medication with breakfast', done: false },
  { id: 2, title: 'Cardiology Consultation', time: '14:30', note: 'With Dr. A. Sharma — Room 204', done: false },
]

function Modal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', time: '', note: '' })
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--color-card-elevated)] border border-[var(--color-border)] rounded-[28px] p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)] mb-5">Add Reminder</h3>
        <form onSubmit={(e) => { e.preventDefault(); onAdd(form); }} className="space-y-4">
          <Field label="Title" required><input value={form.title} onChange={set('title')} required placeholder="e.g. Take medication" className={input} /></Field>
          <Field label="Time" required><input type="time" value={form.time} onChange={set('time')} required className={input} /></Field>
          <Field label="Note"><input value={form.note} onChange={set('note')} placeholder="Optional" className={input} /></Field>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className={btnOutline + ' flex-1'}>Cancel</button>
            <button type="submit" className={btnPrimary + ' flex-1'}>Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const input = 'w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-input)] transition-colors'
const btnPrimary = 'px-5 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl shadow-[var(--shadow-soft)] hover:bg-[var(--color-primary-light)] transition-colors'
const btnOutline = 'px-5 py-3 border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] rounded-xl hover:border-[var(--color-foreground)] transition-colors'

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{label}{required && ' *'}</label>
      {children}
    </div>
  )
}

export default function DashboardPage() {
  const [reminders, setReminders] = useState(INIT_REMINDERS)
  const [consultations, setConsultations] = useState([])
  const [loadingAppts, setLoadingAppts] = useState(true)
  const [notes, setNotes] = useState([
    { id: 1, msg: 'Remember to stay hydrated today.', time: '09:15' },
    { id: 2, msg: 'Your health score is improving!', time: '08:00' },
  ])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    Promise.allSettled([getAppointments(), getReminders()])
      .then(([appointmentsResult, remindersResult]) => {
        setConsultations(appointmentsResult.status === 'fulfilled' ? appointmentsResult.value : [])
        setReminders(remindersResult.status === 'fulfilled' ? remindersResult.value : INIT_REMINDERS)
      })
      .finally(() => setLoadingAppts(false))
  }, [])

  async function addReminder(form) {
    const fallbackReminder = { id: Date.now(), title: form.title, time: form.time, note: form.note, done: false }

    try {
      const result = await createReminder(form)
      setReminders((p) => [...p, result.reminder])
    } catch {
      setReminders((p) => [...p, fallbackReminder])
    }

    setNotes((p) => [{ id: Date.now(), msg: `Reminder added: ${form.title}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...p])
    setShowModal(false)
  }

  async function toggleReminder(reminder) {
    const nextReminder = { ...reminder, done: !reminder.done }

    setReminders((p) => p.map((item) => (item.id === reminder.id ? nextReminder : item)))

    try {
      await updateReminder(reminder.id, { done: nextReminder.done })
    } catch {
      setReminders((p) => p.map((item) => (item.id === reminder.id ? reminder : item)))
    }
  }

  async function removeReminder(reminderId) {
    const previous = reminders
    setReminders((p) => p.filter((item) => item.id !== reminderId))

    try {
      await deleteReminder(reminderId)
    } catch {
      setReminders(previous)
    }
  }

  const upcomingConsultations = consultations.filter((c) => new Date(c.date) >= new Date())

  const stats = [
    { label: 'Reminders', value: reminders.length, icon: Bell },
    { label: 'Consultations', value: consultations.length, icon: Calendar },
    { label: 'Completed', value: reminders.filter((r) => r.done).length, icon: CheckCircle },
    { label: 'Upcoming', value: upcomingConsultations.length, icon: Clock },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Navbar />
      <PageHero
        title="Dashboard"
        current="Dashboard"
        description="Review reminders, consultations, and notifications in the same existing dashboard flow, restyled to fit the new healthcare interface."
      />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <div className="mb-10 flex justify-end">
          <button onClick={() => setShowModal(true)} className={btnPrimary + ' flex items-center gap-2'}>
            <Plus size={14} /> Add Reminder
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-5 shadow-[var(--shadow-card)]">
              <Icon size={16} className="text-[var(--color-primary)] mb-3" />
              <p className="font-serif text-3xl font-light text-[var(--color-foreground)]">{value}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reminders */}
          <div className="lg:col-span-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)] mb-5">Reminders</h2>
            {reminders.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] py-10 text-center">No reminders yet.</p>
            ) : (
              <ul className="space-y-2">
                {reminders.map((r) => (
                  <li key={r.id} className={`flex items-start gap-3 p-4 rounded-md border transition-all ${r.done ? 'opacity-50 bg-[var(--color-surface)] border-[var(--color-border)]' : 'bg-[var(--color-card)] border-[var(--color-border)]'}`}>
                    <button onClick={() => toggleReminder(r)}
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${r.done ? 'bg-[var(--color-success)] border-[var(--color-success)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'}`}>
                      {r.done && <CheckCircle size={10} color="white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${r.done ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-foreground)]'}`}>{r.title}</p>
                      {r.note && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{r.note}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[var(--color-text-light)] font-mono">{r.time}</span>
                      <button onClick={() => removeReminder(r.id)} className="text-[var(--color-text-light)] hover:text-[var(--color-error)] transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)] mb-4">Consultations</h2>
              {loadingAppts ? (
                <div className="flex items-center justify-center py-6 gap-2 text-[var(--color-text-muted)]">
                  <Loader2 size={14} className="animate-spin" /> Loading...
                </div>
              ) : upcomingConsultations.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-4">No upcoming appointments.</p>
              ) : (
                <ul className="space-y-3">
                  {upcomingConsultations.map((c) => (
                    <li key={c.id} className="p-3 bg-[var(--color-surface)] rounded-md border border-[var(--color-border)]">
                      <p className="text-sm font-medium text-[var(--color-foreground)]">{c.doctor}</p>
                      <p className="text-xs text-[var(--color-primary)] font-semibold uppercase tracking-wide mt-0.5">{c.specialty || c.spec}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1 font-mono">{c.date} · {c.time}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">Notifications</h2>
                <button onClick={() => setNotes([])} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors flex items-center gap-1">
                  <RefreshCw size={11} /> Clear
                </button>
              </div>
              {notes.length === 0
                ? <p className="text-sm text-[var(--color-text-muted)] text-center py-4">No notifications.</p>
                : <ul className="space-y-2">{notes.map((n) => (
                  <li key={n.id} className="flex gap-2 p-3 bg-[var(--color-primary)]/5 rounded-md">
                    <Bell size={12} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--color-foreground)]">{n.msg}</p>
                      <p className="text-xs text-[var(--color-text-light)] mt-0.5 font-mono">{n.time}</p>
                    </div>
                  </li>
                ))}</ul>
              }
            </div>
          </div>
        </div>
      </main>

      {showModal && <Modal onClose={() => setShowModal(false)} onAdd={addReminder} />}
      <Footer />
    </div>
  )
}
