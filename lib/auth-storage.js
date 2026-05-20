const AUTH_STORAGE_KEY = 'zenith-auth'

export function readStoredAuth() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeStoredAuth(value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value))
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getStoredToken() {
  return readStoredAuth()?.token || null
}
