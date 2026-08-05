import { useState } from 'react'
import { Button, Divider } from '../components/cultr-ui'

function PasswordStrength({ password }: { password: string }) {
  const score = Math.min(
    4,
    [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
  )
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = ['var(--color-coral)', 'rgba(239,120,104,0.6)', 'var(--color-sage)', 'var(--color-sage)']

  if (!password) return null

  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? colors[score - 1] : 'var(--color-line-light)' }}
          />
        ))}
      </div>
      {score > 0 && (
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: colors[score - 1] }}>
          {labels[score - 1]}
        </span>
      )}
    </div>
  )
}

export default function SignUp({ onSignIn, onComplete }: { onSignIn: () => void; onComplete: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name) errs.name = 'Enter your full name.'
    if (!form.email || !form.email.includes('@')) errs.email = 'Enter a work email to continue.'
    if (!form.company) errs.company = 'Enter your company name.'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.'
    if (!agreed) errs.terms = 'You must agree to the terms to continue.'
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => { setLoading(false); onComplete() }, 1000)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-offwhite)' }}>
      {/* Left panel */}
      <div
        className="hidden md:flex flex-col w-[55%] p-12 relative"
        style={{ background: 'var(--color-navy)' }}
      >
        <button
          onClick={onSignIn}
          className="font-display font-700 text-[18px] text-(--color-offwhite) tracking-tight hover:text-(--color-coral) transition-colors w-fit"
        >
          Cultr HR
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-sm">
          <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest">Get started</span>
          <h2 className="font-display font-700 text-[36px] text-(--color-offwhite) mt-4 leading-[1.1] tracking-tight">
            Set up your organization in minutes.
          </h2>
          <p className="mt-4 text-[16px] leading-[1.6]" style={{ color: 'rgba(243,239,230,0.6)' }}>
            No credit card required. Invite your team, configure your scopes, and be operational before end of day.
          </p>

          {/* Mini console */}
          <div className="mt-10 rounded-[10px] overflow-hidden"
            style={{ border: '1px solid var(--color-line-dark)', background: 'var(--color-navy-raised)' }}>
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--color-line-dark)' }}>
              <span className="font-mono text-[10px] text-(--color-sage-dim) uppercase tracking-widest">
                Setup progress
              </span>
            </div>
            {[
              { label: 'Org created', done: true },
              { label: 'Team invited', done: false },
              { label: 'Scopes configured', done: false },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: '1px solid var(--color-line-dark)' }}>
                <span className="font-mono text-[11px] text-(--color-offwhite)/60 uppercase tracking-wide">{label}</span>
                <span className="font-mono text-[10px]" style={{ color: done ? 'var(--color-sage)' : 'var(--color-sage-dim)' }}>
                  {done ? '✓' : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="font-mono text-[10px] text-(--color-sage-dim) flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-sage) animate-pulse-status" />
          All systems operational
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16 overflow-y-auto">
        {/* Mobile wordmark */}
        <div className="md:hidden mb-8">
          <button onClick={onSignIn} className="font-display font-700 text-[18px] text-(--color-ink) tracking-tight">
            Cultr HR
          </button>
        </div>

        <div className="max-w-[400px] w-full mx-auto">
          <h1 className="font-display font-700 text-[28px] text-(--color-ink) leading-tight tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-[14px] text-(--color-sage-dim)">
            Already have an account?{' '}
            <button onClick={onSignIn} className="text-(--color-coral) hover:underline underline-offset-2">Sign in</button>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullname" className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">Full name</label>
              <input
                id="fullname"
                type="text"
                name="name"
                placeholder="Alexandra Kim"
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
                className="w-full px-4 py-3 bg-transparent border rounded-[6px] text-[15px] text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral) transition-colors"
                style={{ borderColor: errors.name ? 'var(--color-coral)' : 'var(--color-line-light)' }}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <p id="name-error" className="text-[13px] text-(--color-coral)" role="alert">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="workemail" className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">Work email</label>
              <input
                id="workemail"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
                className="w-full px-4 py-3 bg-transparent border rounded-[6px] text-[15px] text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral) transition-colors"
                style={{ borderColor: errors.email ? 'var(--color-coral)' : 'var(--color-line-light)' }}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <p id="email-error" className="text-[13px] text-(--color-coral)" role="alert">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="company" className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">Company name</label>
              <input
                id="company"
                type="text"
                name="company"
                placeholder="Acme Inc."
                value={form.company}
                onChange={set('company')}
                className="w-full px-4 py-3 bg-transparent border rounded-[6px] text-[15px] text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral) transition-colors"
                style={{ borderColor: errors.company ? 'var(--color-coral)' : 'var(--color-line-light)' }}
              />
              {errors.company && <p className="text-[13px] text-(--color-coral)" role="alert">{errors.company}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newpassword" className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">Password</label>
              <div className="relative">
                <input
                  id="newpassword"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 bg-transparent border rounded-[6px] text-[15px] text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral) transition-colors"
                  style={{ borderColor: errors.password ? 'var(--color-coral)' : 'var(--color-line-light)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-sage-dim) hover:text-(--color-ink)"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    {showPass
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  </svg>
                </button>
              </div>
              <PasswordStrength password={form.password} />
              {errors.password && <p className="text-[13px] text-(--color-coral)" role="alert">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm" className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">Confirm password</label>
              <input
                id="confirm"
                type="password"
                name="confirm"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={set('confirm')}
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-transparent border rounded-[6px] text-[15px] text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral) transition-colors"
                style={{ borderColor: errors.confirm ? 'var(--color-coral)' : 'var(--color-line-light)' }}
              />
              {errors.confirm && <p className="text-[13px] text-(--color-coral)" role="alert">{errors.confirm}</p>}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-(--color-coral) cursor-pointer"
                aria-describedby={errors.terms ? 'terms-error' : undefined}
              />
              <span className="text-[14px] text-(--color-sage-dim) leading-[1.5]">
                I agree to the{' '}
                <a href="#" className="text-(--color-coral) hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-(--color-coral) hover:underline">Privacy Policy</a>.
              </span>
            </label>
            {errors.terms && <p id="terms-error" className="text-[13px] text-(--color-coral) -mt-2" role="alert">{errors.terms}</p>}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-1">
              Create account
            </Button>

            <Divider label="or continue with" />

            <div className="flex gap-3">
              <button type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[6px] text-[14px] text-(--color-ink) transition-colors"
                style={{ border: '1px solid var(--color-line-light)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[6px] text-[14px] text-(--color-ink) transition-colors"
                style={{ border: '1px solid var(--color-line-light)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
