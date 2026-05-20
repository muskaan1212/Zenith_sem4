'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero from '@/components/page-hero'
import { User, Heart, Edit2, Check, X, ShieldPlus } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'

const DEFAULT = { name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', dob: '1990-01-15', blood: 'O+', height: "5'10\"", weight: '75 kg', allergies: 'None' }

const input = 'w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm bg-[var(--color-input)] focus:outline-none focus:border-[var(--color-primary)] transition-colors'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(DEFAULT)
  const [editPersonal, setEditPersonal] = useState(false)
  const [editHealth, setEditHealth] = useState(false)
  const [draft, setDraft] = useState(DEFAULT)
  const set = (k) => (e) => setDraft((p) => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    if (!user) return

    const nextProfile = {
      ...DEFAULT,
      name: user.name || DEFAULT.name,
      email: user.email || DEFAULT.email,
    }

    setProfile(nextProfile)
    setDraft(nextProfile)
  }, [user])

  function savePersonal() { setProfile((p) => ({ ...p, name: draft.name, email: draft.email, phone: draft.phone, dob: draft.dob })); setEditPersonal(false) }
  function saveHealth() { setProfile((p) => ({ ...p, blood: draft.blood, height: draft.height, weight: draft.weight, allergies: draft.allergies })); setEditHealth(false) }
  function cancel() { setDraft(profile); setEditPersonal(false); setEditHealth(false) }

  function Field({ label, field, editing }) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</span>
        {editing
          ? <input value={draft[field]} onChange={set(field)} className={input} />
          : <span className="text-sm font-medium text-[var(--color-foreground)]">{profile[field]}</span>
        }
      </div>
    )
  }

  function CardHeader({ icon: Icon, title, editing, onEdit, onSave }) {
    return (
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-[var(--color-primary)]" />
          <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">{title}</h3>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={onSave} className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-medium rounded hover:bg-[var(--color-primary-light)] transition-colors"><Check size={11} /> Save</button>
            <button onClick={cancel} className="flex items-center gap-1 px-3 py-1.5 border border-[var(--color-border)] text-xs rounded text-[var(--color-text-secondary)] hover:border-[var(--color-foreground)] transition-colors"><X size={11} /> Cancel</button>
          </div>
        ) : (
          <button onClick={() => { setDraft(profile); onEdit() }} className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] text-xs rounded text-[var(--color-text-secondary)] hover:border-[var(--color-foreground)] transition-colors">
            <Edit2 size={11} /> Edit
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Navbar />
      <PageHero
        title="About You"
        current="Profile"
        description="View and edit your personal and health details in the same existing profile flow, now styled to match the refreshed healthcare interface."
      />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16">

        <div className="grid gap-5">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-5">
            <div className="flex items-center gap-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-6 shadow-[var(--shadow-card)]">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <span className="text-2xl font-semibold text-[var(--color-primary)]">{profile.name[0]}</span>
              </div>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">{profile.name}</h2>
                <p className="text-sm text-[var(--color-text-muted)]">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-[28px] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)]">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <ShieldPlus size={42} />
                </div>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Verified Patient</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)] max-w-xs">
                  Your account details are protected and linked to your personal dashboard, appointments, reminders, and prescriptions.
                </p>
              </div>
            </div>
          </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-6 shadow-[var(--shadow-card)]">
          <CardHeader icon={User} title="Personal Information" editing={editPersonal} onEdit={() => setEditPersonal(true)} onSave={savePersonal} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[['Full Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Date of Birth', 'dob']].map(([l, f]) => (
              <Field key={f} label={l} field={f} editing={editPersonal} />
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[28px] p-6 shadow-[var(--shadow-card)]">
          <CardHeader icon={Heart} title="Health Information" editing={editHealth} onEdit={() => setEditHealth(true)} onSave={saveHealth} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[['Blood Group', 'blood'], ['Height', 'height'], ['Weight', 'weight'], ['Allergies', 'allergies']].map(([l, f]) => (
              <Field key={f} label={l} field={f} editing={editHealth} />
            ))}
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
