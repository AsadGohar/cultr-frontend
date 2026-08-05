import { useState } from 'react'
import { Button, Input } from '../components/cultr-ui'

export default function SignIn({ onSignIn, onSignUp }: { onSignIn: () => void; onSignUp: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); onSignIn() }, 900)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--color-offwhite)' }}>

      {/* Back to landing */}
      <div className="absolute top-6 left-8">
        <button
          onClick={onSignUp}
          className="flex items-center gap-2 font-display font-700 text-[16px] text-(--color-ink) tracking-tight hover:text-(--color-coral) transition-colors"
        >
          <img src="/cultr-favicon.png" alt="" className="h-8 w-8 shrink-0 rounded-[6px] object-cover" />
          Cultre
        </button>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[420px] rounded-[20px] px-10 py-12 animate-fade-in"
        style={{
          background: 'var(--color-offwhite-raised)',
          border: '1px solid var(--color-line-light)',
          boxShadow: '0 4px 40px rgba(11,20,38,0.08)',
        }}
      >
        <h1 className="font-display font-700 text-[28px] text-(--color-ink) leading-tight tracking-tight">
          Sign in to Cultre
        </h1>
        <p className="mt-2 text-[14px] text-(--color-sage-dim)">
          Welcome back. Enter your details to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
          <Input
            label="Work email"
            type="email"
            name="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">
                Password
              </label>
              <button
                type="button"
                className="font-mono text-[11px] text-(--color-coral) hover:underline underline-offset-2 uppercase tracking-widest"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 bg-transparent border border-(--color-line-light) rounded-[6px] text-[15px] text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral) transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-sage-dim) hover:text-(--color-ink) transition-colors"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2"
          >
            Sign in
          </Button>
        </form>

        <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--color-line-light)' }}>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[6px] text-[14px] text-(--color-ink) border transition-colors hover:border-(--color-ink)/30"
              style={{ border: '1px solid var(--color-line-light)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[6px] text-[14px] text-(--color-ink) border transition-colors hover:border-(--color-ink)/30"
              style={{ border: '1px solid var(--color-line-light)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>

      {/* Status line */}
      <p className="mt-6 font-mono text-[11px] text-center text-(--color-sage-dim) uppercase tracking-widest">
        Protected by MFA when enabled for your organization.
      </p>

      <p className="mt-4 text-[14px] text-(--color-sage-dim)">
        New to Cultre?{' '}
        <button onClick={onSignUp} className="text-(--color-coral) hover:underline underline-offset-2">
          Create an account
        </button>
      </p>
    </div>
  )
}
