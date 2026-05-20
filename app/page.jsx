'use client'

import { useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/auth-provider'
import { loginUser, registerUser } from '@/lib/api'

const inputClassName =
  'w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3.5 text-sm text-[var(--color-foreground)] outline-none transition-colors focus:border-[var(--color-primary)]'

export default function HomePage() {
  const { login } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function setField(key) {
    return (event) => {
      setForm((current) => ({ ...current, [key]: event.target.value }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (mode === 'register') {
        await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
        })
      }

      const result = await loginUser({
        email: form.email,
        password: form.password,
      })

      login({
        token: result.token,
        user: result.user,
      })
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Navbar />

      <main className="flex-1 pt-[92px] bg-[var(--color-hero)]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid gap-12 lg:grid-cols-[0.96fr_1.04fr] items-center">
          <section className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-primary)]">Zenith Secure Access</p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.02] text-[var(--color-foreground)] text-balance">
              Sign in to your healthcare dashboard
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-text-secondary)]">
              Every user now has their own authenticated workspace for appointments, prescriptions, reminders, and profile data. Log in to continue or create a patient account to begin.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Private dashboard', 'Only your reminders and activity appear in your account.'],
                ['Secure login', 'Bcrypt, JWT, and MongoDB-backed user access are active.'],
                ['Personal records', 'Appointments and prescriptions are tied to your login identity.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[var(--shadow-card)]">
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{description}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)]">
              <div className="relative aspect-[1.25/0.92]">
                <Image src="/images/emergency.jpeg" alt="Zenith healthcare access" fill className="object-cover" />
                <div className="absolute inset-0 bg-[var(--color-primary)]/14" />
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-[var(--shadow-soft)]">
            <div className="flex gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
              {[
                ['login', 'Sign In'],
                ['register', 'Create Account'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    mode === value
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Full Name</label>
                  <input value={form.name} onChange={setField('name')} required className={inputClassName} placeholder="Muskaan Sharma" />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Email</label>
                <input value={form.email} onChange={setField('email')} type="email" required className={inputClassName} placeholder="you@example.com" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Password</label>
                <input value={form.password} onChange={setField('password')} type="password" required className={inputClassName} placeholder="Enter your password" />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[var(--color-primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:bg-[var(--color-primary-light)] disabled:opacity-70"
              >
                {submitting ? 'Please wait...' : mode === 'login' ? 'Login to Dashboard' : 'Create Account & Continue'}
              </button>
            </form>

            <div className="mt-8 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-sm font-semibold text-[var(--color-foreground)]">Demo Login</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                You can still use the seeded account created in MongoDB:
              </p>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                Email: <span className="font-semibold text-[var(--color-foreground)]">demo@zenith.local</span>
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Password: <span className="font-semibold text-[var(--color-foreground)]">Zenith12345</span>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
