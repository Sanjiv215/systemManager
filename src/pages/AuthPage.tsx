import { useState } from 'react'
import { api, setToken } from '../api/client'
import type { User } from '../types/api'

type AuthResponse = {
  token: string
  user: User
}

export function AuthPage({ onAuth }: { onAuth: (user: User) => void }) {
  const [mode, setMode] = useState<'login' | 'setup'>('setup')
  const [form, setForm] = useState({ name: 'Admin', email: 'admin@woodwise.local', password: 'Admin12345' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = mode === 'setup' ? form : { email: form.email, password: form.password }
      const response = await api<AuthResponse>(mode === 'setup' ? '/auth/setup-admin' : '/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setToken(response.token)
      onAuth(response.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-screen">
      <form className="auth-card" onSubmit={submit}>
        <div className="brand">
          <div className="brand-mark">W</div>
          <div>
            <strong>WoodWise</strong>
            <span>Business Management</span>
          </div>
        </div>
        <h1>{mode === 'setup' ? 'Create admin account' : 'Sign in'}</h1>
        <p className="auth-hint">{mode === 'setup' ? 'Create the first admin account to continue.' : 'Use your admin credentials to continue.'}</p>
        {mode === 'setup' ? (
          <label>
            Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
        ) : null}
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} minLength={mode === 'setup' ? 10 : 8} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-button" disabled={loading} type="submit">{loading ? 'Please wait' : mode === 'setup' ? 'Create admin' : 'Sign in'}</button>
        <button className="text-button" type="button" onClick={() => setMode(mode === 'setup' ? 'login' : 'setup')}>
          {mode === 'setup' ? 'I already have an account' : 'Set up the first admin'}
        </button>
      </form>
    </main>
  )
}
