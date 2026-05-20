/**
 * Zenith Healthcare — API client
 * Calls Express backend on http://localhost:5000
 * Falls back gracefully if backend is offline.
 */

import { getStoredToken } from '@/lib/auth-storage'

const BASE_URL = 'http://localhost:3001'

function withAuthHeaders(init = {}) {
  const token = getStoredToken()
  const headers = { ...(init.headers || {}) }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return {
    ...init,
    headers,
  }
}

// GET /appointments
export async function getAppointments() {
  const res = await fetch(`${BASE_URL}/appointments`, withAuthHeaders())
  if (!res.ok) throw new Error('Failed to fetch appointments')
  return res.json()
}

// POST /appointments
export async function createAppointment(data) {
  const res = await fetch(`${BASE_URL}/appointments`, withAuthHeaders({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }))
  if (!res.ok) throw new Error('Failed to create appointment')
  return res.json()
}

// GET /records
export async function getRecords() {
  const res = await fetch(`${BASE_URL}/records`)
  if (!res.ok) throw new Error('Failed to fetch records')
  return res.json()
}

// POST /records (file upload)
export async function uploadRecord(formData) {
  const res = await fetch(`${BASE_URL}/records`, {
    method: 'POST',
    body: formData, // multipart/form-data — do NOT set Content-Type manually
  })
  if (!res.ok) throw new Error('Failed to upload record')
  return res.json()
}

// Stream / download a record file
export function getRecordStreamUrl(filename) {
  return `${BASE_URL}/records/${filename}`
}

// POST /feedback
export async function submitFeedback(data) {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to submit feedback')
  return res.json()
}

// GET /feedback
export async function getFeedback() {
  const res = await fetch(`${BASE_URL}/feedback`)
  if (!res.ok) throw new Error('Failed to fetch feedback')
  return res.json()
}

// GET /prescriptions
export async function getPrescriptions() {
  const res = await fetch(`${BASE_URL}/prescriptions`, withAuthHeaders())
  if (!res.ok) throw new Error('Failed to fetch prescriptions')
  return res.json()
}

// POST /prescriptions
export async function createPrescription(data) {
  const res = await fetch(`${BASE_URL}/prescriptions`, withAuthHeaders({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }))
  if (!res.ok) throw new Error('Failed to create prescription')
  return res.json()
}

// GET /reminders
export async function getReminders() {
  const res = await fetch(`${BASE_URL}/reminders`, withAuthHeaders())
  if (!res.ok) throw new Error('Failed to fetch reminders')
  return res.json()
}

// POST /reminders
export async function createReminder(data) {
  const res = await fetch(`${BASE_URL}/reminders`, withAuthHeaders({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }))
  if (!res.ok) throw new Error('Failed to create reminder')
  return res.json()
}

// PUT /reminders/:id
export async function updateReminder(id, data) {
  const res = await fetch(`${BASE_URL}/reminders/${id}`, withAuthHeaders({
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }))
  if (!res.ok) throw new Error('Failed to update reminder')
  return res.json()
}

// DELETE /reminders/:id
export async function deleteReminder(id) {
  const res = await fetch(`${BASE_URL}/reminders/${id}`, withAuthHeaders({
    method: 'DELETE',
  }))
  if (!res.ok) throw new Error('Failed to delete reminder')
  return res.json()
}

// GET /concepts/request-flow
export async function getRequestFlow() {
  const res = await fetch(`${BASE_URL}/concepts/request-flow`)
  if (!res.ok) throw new Error('Failed to fetch request flow')
  return res.json()
}

// GET /concepts/blocking-demo
export async function getBlockingDemo() {
  const res = await fetch(`${BASE_URL}/concepts/blocking-demo`)
  if (!res.ok) throw new Error('Failed to run blocking demo')
  return res.json()
}

// GET /concepts/non-blocking-demo
export async function getNonBlockingDemo() {
  const res = await fetch(`${BASE_URL}/concepts/non-blocking-demo`)
  if (!res.ok) throw new Error('Failed to run non-blocking demo')
  return res.json()
}

// Session demos need cookies, so credentials must be included.
export async function setSession(theme = 'system') {
  const res = await fetch(`${BASE_URL}/session/set?theme=${encodeURIComponent(theme)}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to set session')
  return res.json()
}

export async function checkSession() {
  const res = await fetch(`${BASE_URL}/session/check`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to check session')
  return res.json()
}

export async function logoutSession() {
  const res = await fetch(`${BASE_URL}/session/logout`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to clear session')
  return res.json()
}

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to register user')
  return json
}

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to login user')
  return json
}

export async function loginUserWithPassport(data) {
  const res = await fetch(`${BASE_URL}/auth/login/passport`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to login with Passport')
  return json
}

export async function getProfile(token) {
  const authToken = token || getStoredToken()
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to load profile')
  return json
}

export async function getDbNotes() {
  const res = await fetch(`${BASE_URL}/db/notes`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to fetch notes')
  return json
}

export async function createDbNote(data) {
  const res = await fetch(`${BASE_URL}/db/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to create note')
  return json
}
