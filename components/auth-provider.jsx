'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getProfile } from '@/lib/api'
import { clearStoredAuth, readStoredAuth, writeStoredAuth } from '@/lib/auth-storage'

const AuthContext = createContext(null)

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
      <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-card)] px-8 py-6 text-sm text-[var(--color-text-secondary)] shadow-[var(--shadow-card)]">
        Checking your secure session...
      </div>
    </div>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

export default function AuthProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    let active = true

    async function restoreSession() {
      const storedAuth = readStoredAuth()

      if (!storedAuth?.token) {
        if (active) setLoading(false)
        return
      }

      try {
        const result = await getProfile(storedAuth.token)
        if (!active) return

        const nextAuth = {
          token: storedAuth.token,
          user: result.user,
        }

        writeStoredAuth(nextAuth)
        setToken(nextAuth.token)
        setUser(nextAuth.user)
      } catch {
        clearStoredAuth()
        if (!active) return
        setToken(null)
        setUser(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (loading) return

    const isRoot = pathname === '/'

    if (!user && !isRoot) {
      router.replace('/')
      return
    }

    if (user && isRoot) {
      router.replace('/dashboard')
    }
  }, [loading, pathname, router, user])

  function login(nextAuth) {
    writeStoredAuth(nextAuth)
    setToken(nextAuth.token)
    setUser(nextAuth.user)
    router.replace('/dashboard')
  }

  function logout() {
    clearStoredAuth()
    setToken(null)
    setUser(null)
    router.replace('/')
  }

  const value = useMemo(
    () => ({
      loading,
      token,
      user,
      login,
      logout,
      isAuthenticated: Boolean(user && token),
    }),
    [loading, token, user],
  )

  if (loading) {
    return <LoadingScreen />
  }

  if (!user && pathname !== '/') {
    return <LoadingScreen />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
