import { useState, useEffect, useRef } from 'react'
import { Button, Reveal } from '../components/cultr-ui'

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav({ onSignIn, onSignUp }: { onSignIn: () => void; onSignUp: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const navItems = [
    { label: 'Product', href: '#product' },
    { label: 'Modules', href: '#modules' },
    { label: 'Security', href: '#security' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Company', href: '#company' },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-8 md:px-12 h-16 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--color-navy)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-line-dark)' : '1px solid transparent',
      }}
    >
      <a href="#product" className="flex items-center gap-2" aria-label="Cultr HR home">
        <img src="/cultr-favicon.png" alt="" className="h-8 w-8 shrink-0 rounded-[6px] object-cover" />
        <span className="font-display font-700 text-[18px] text-(--color-offwhite) tracking-tight">Cultr</span>
        <span
          className="w-1.5 h-1.5 rounded-full bg-(--color-coral) animate-pulse-status"
          title="System status: operational"
          aria-label="System status: operational"
        />
      </a>
      <div className="hidden md:flex items-center gap-8">
        {navItems.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="font-body text-[14px] text-(--color-offwhite)/60 hover:text-(--color-offwhite) transition-colors duration-150"
          >
            {label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onSignIn}>Sign In</Button>
        <Button variant="primary" size="sm" onClick={onSignUp}>Start Free</Button>
      </div>
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function ConsolePanel() {
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="rounded-[12px] overflow-hidden"
      style={{
        background: 'var(--color-navy-raised)',
        border: '1px solid var(--color-line-dark)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--color-line-dark)' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-(--color-coral)/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-(--color-sage)/40" />
        <span className="w-2.5 h-2.5 rounded-full bg-(--color-sage-dim)/30" />
        <span className="ml-3 font-mono text-[10px] text-(--color-sage-dim) uppercase tracking-widest">Cultr HR · Live</span>
      </div>

      {/* Org chart */}
      <div className="px-6 pt-5 pb-4">
        <svg viewBox="0 0 320 80" className="w-full" aria-hidden="true">
          {/* Nodes */}
          <rect x="10" y="28" width="72" height="24" rx="4" fill="none" stroke="var(--color-sage)" strokeWidth="1" />
          <text x="46" y="44" textAnchor="middle" fill="var(--color-sage)" fontFamily="JetBrains Mono" fontSize="9">ONBOARDING</text>

          <rect x="124" y="28" width="72" height="24" rx="4" fill="none" stroke="var(--color-accent)" strokeWidth="1" />
          <text x="160" y="44" textAnchor="middle" fill="var(--color-accent)" fontFamily="JetBrains Mono" fontSize="9">APPROVAL</text>

          <rect x="238" y="28" width="72" height="24" rx="4"
            fill="rgba(239,120,104,0.12)"
            stroke="var(--color-coral)" strokeWidth="1" />
          <text x="274" y="44" textAnchor="middle" fill="var(--color-coral)" fontFamily="JetBrains Mono" fontSize="9">ACTIVE</text>

          {/* Connecting lines */}
          <path
            d="M82 40 L124 40"
            stroke="var(--color-sage)"
            strokeWidth="1"
            strokeDasharray="200"
            style={{
              strokeDashoffset: drawn ? 0 : 200,
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s',
            }}
          />
          <path
            d="M196 40 L238 40"
            stroke="var(--color-coral)"
            strokeWidth="1"
            strokeDasharray="200"
            style={{
              strokeDashoffset: drawn ? 0 : 200,
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1) 0.5s',
            }}
          />

          {/* Arrow heads */}
          {drawn && (
            <>
              <polygon points="124,37 117,40 124,43" fill="var(--color-sage)" />
              <polygon points="238,37 231,40 238,43" fill="var(--color-coral)" />
            </>
          )}
        </svg>
      </div>

      {/* Status list */}
      <div className="px-6 pb-5" style={{ borderTop: '1px solid var(--color-line-dark)', paddingTop: '16px' }}>
        {[
          { label: 'MFA enforced', value: '128/128 users', ok: true, delay: 600 },
          { label: 'Onboarding', value: '4 in progress', ok: true, delay: 720 },
          { label: 'Pending approvals', value: '3', ok: false, delay: 840 },
        ].map(({ label, value, ok, delay }) => (
          <div
            key={label}
            className="flex justify-between items-center py-1.5"
            style={{
              opacity: drawn ? 1 : 0,
              transform: drawn ? 'none' : 'translateY(6px)',
              transition: `opacity 0.3s ease ${delay}ms, transform 0.3s ease ${delay}ms`,
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: ok ? 'var(--color-sage)' : 'var(--color-coral)' }}
              />
              <span className="font-mono text-[11px] text-(--color-sage-dim) uppercase tracking-wide">{label}</span>
            </div>
            <span className="font-mono text-[11px] text-(--color-offwhite)/80">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero({ onSignUp }: { onSignUp: () => void }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const w = window.innerWidth, h = window.innerHeight
      setMouse({ x: (e.clientX / w - 0.5) * 0.018, y: (e.clientY / h - 0.5) * 0.018 })
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <section
      id="product"
      className="min-h-screen relative flex scroll-mt-16 items-center pt-16"
      style={{ background: 'var(--color-navy)' }}
    >
      {/* Grid lines background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-sage) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-sage) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          opacity: 0.03,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1280px] mx-auto w-full px-8 md:px-12 py-24 grid md:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div>
          <div
            className="animate-fade-in"
            style={{ animationDelay: '0ms' }}
          >
            <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-[0.2em]">
              People Operations · Engineered
            </span>
          </div>

          <h1
            className="font-display font-800 text-[52px] md:text-[64px] leading-[1.02] tracking-[-0.03em] text-(--color-offwhite) mt-6 animate-fade-in"
            style={{ animationDelay: '80ms' }}
          >
            The operating system for how people join, work, and grow.
          </h1>

          <p
            className="mt-6 text-[17px] leading-[1.6] animate-fade-in"
            style={{ color: 'rgba(243,239,230,0.7)', animationDelay: '160ms' }}
          >
            Cultr HR replaces scattered spreadsheets, email chains, and disconnected tools with one precise system for identity, time, and approvals — built for teams that take operations seriously.
          </p>

          <div
            className="flex items-center gap-4 mt-10 animate-fade-in"
            style={{ animationDelay: '240ms' }}
          >
            <Button variant="primary" size="lg" onClick={onSignUp}>Start Free</Button>
            <Button variant="text" size="lg">
              View live demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Right: Console Panel */}
        <div
          className="animate-fade-in"
          style={{
            animationDelay: '300ms',
            transform: `perspective(1000px) rotateY(${mouse.x}rad) rotateX(${-mouse.y}rad)`,
            transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <ConsolePanel />
        </div>
      </div>
    </section>
  )
}

// ── Impact Snapshot ───────────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, duration = 1000) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return value
}

function ImpactSnapshot() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const hireTime = useCountUp(17, visible, 1000)
  const onboarding = useCountUp(42, visible, 900)
  const turnaround = useCountUp(6, visible, 800)
  const uptime = useCountUp(9998, visible, 1200)

  return (
    <section style={{ background: 'var(--color-offwhite)', padding: '96px 0' }}>
      <div className="max-w-[1280px] mx-auto px-8 md:px-12">
        <Reveal>
          <div
            className="rounded-[12px] overflow-hidden"
            style={{ border: '1px solid var(--color-line-light)' }}
            ref={ref}
          >
            <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr]" style={{ borderBottom: 'none' }}>
              {/* Mini line chart */}
              <div className="p-8" style={{ borderRight: '1px solid var(--color-line-light)' }}>
                <span className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">
                  Time-to-hire · last 90 days
                </span>
                <div className="mt-6">
                  <svg viewBox="0 0 280 80" className="w-full" aria-label="Time to hire trend chart">
                    <polyline
                      points="0,60 40,55 80,45 120,40 160,30 200,22 240,18 280,14"
                      fill="none"
                      stroke="var(--color-coral)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="0,60 40,55 80,45 120,40 160,30 200,22 240,18 280,14"
                      fill="url(#chartGrad)"
                      stroke="none"
                      opacity="0.12"
                    />
                    <defs>
                      <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-coral)" />
                        <stop offset="100%" stopColor="var(--color-coral)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* X axis */}
                    <line x1="0" y1="75" x2="280" y2="75" stroke="var(--color-line-light)" strokeWidth="1" />
                  </svg>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="font-display font-700 text-[36px] text-(--color-ink)">{hireTime}d</span>
                    <span className="font-mono text-[12px] text-(--color-sage)">▼ avg time-to-hire</span>
                  </div>
                </div>
              </div>

              {/* Stat segments */}
              {[
                { label: 'Avg onboarding completion', value: `${onboarding / 10}d`, raw: onboarding, decimals: 1 },
                { label: 'Approval turnaround', value: `${turnaround}h avg`, raw: turnaround },
                { label: 'Uptime', value: `${(uptime / 100).toFixed(2)}%`, raw: uptime },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className="p-8 flex flex-col justify-between"
                  style={{ borderLeft: i > 0 ? '1px solid var(--color-line-light)' : undefined }}
                >
                  <span className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">{label}</span>
                  <span className="font-display font-700 text-[36px] text-(--color-ink) mt-4">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── Modules ───────────────────────────────────────────────────────────────────

function ModuleTag({ children }: { children: string }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-[4px]"
      style={{ border: '1px solid var(--color-line-dark)', color: 'var(--color-sage)' }}>
      {children}
    </span>
  )
}

function ModuleIdentity() {
  return (
    <Reveal className="min-w-0 h-full lg:col-span-7">
      <div className="flex h-full flex-col p-8 md:p-10 rounded-[12px]"
        style={{ border: '1px solid var(--color-line-dark)', background: 'var(--color-navy-raised)' }}>
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest">Module 01</span>
          <h3 className="font-display font-700 text-[28px] text-(--color-offwhite) mt-3 leading-[1.15] tracking-tight">
            Identity, verified once, trusted everywhere
          </h3>
          <p className="mt-4 text-[16px] leading-[1.6]" style={{ color: 'rgba(243,239,230,0.65)' }}>
            MFA enforcement, password policy management, and dynamic approval chains — unified identity infrastructure that travels with each person across every system they touch.
          </p>
        </div>
        {/* Architecture diagram */}
        <div
          className="mt-6 flex min-h-[180px] flex-1 flex-col justify-between rounded-[10px] border border-(--color-line-dark) p-5 md:p-6"
          style={{ background: 'rgba(158,173,156,0.045)' }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-(--color-line-dark) pb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">Verified access path</span>
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-(--color-sage)">
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-sage)" aria-hidden="true" />
              Enforced
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {['MFA', 'SSO-Ready', 'Audit Log', 'Dynamic Approvals'].map(t => <ModuleTag key={t}>{t}</ModuleTag>)}
          </div>
          <svg viewBox="0 34 320 52" className="mt-5 w-full" aria-label="Identity access flow diagram">
            {[
              { x: 10, label: 'USER' },
              { x: 90, label: 'MFA CHECK' },
              { x: 180, label: 'ROLE SCOPE' },
              { x: 260, label: 'ACCESS\nGRANTED' },
            ].map(({ x, label }, i) => (
              <g key={label}>
                <rect x={x} y="44" width="60" height="32" rx="4"
                  fill={i === 3 ? 'rgba(239,120,104,0.1)' : 'transparent'}
                  stroke={i === 3 ? 'var(--color-coral)' : 'var(--color-sage)'}
                  strokeWidth="1" />
                <text x={x + 30} y={60} textAnchor="middle" fill={i === 3 ? 'var(--color-coral)' : 'var(--color-sage)'}
                  fontFamily="JetBrains Mono" fontSize="7">{label.split('\n')[0]}</text>
                {label.split('\n')[1] && <text x={x + 30} y={69} textAnchor="middle" fill={i === 3 ? 'var(--color-coral)' : 'var(--color-sage)'}
                  fontFamily="JetBrains Mono" fontSize="7">{label.split('\n')[1]}</text>}
                {i < 3 && <path d={`M${x + 60} 60 L${x + 90} 60`} stroke="var(--color-sage)" strokeWidth="0.75"
                  strokeDasharray="3 2" fill="none" />}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </Reveal>
  )
}

function ModuleOnboarding() {
  return (
    <Reveal delay={60} className="min-w-0 h-full lg:col-span-5">
      <div className="flex h-full flex-col gap-10 p-8 md:p-10 rounded-[12px]"
        style={{ border: '1px solid var(--color-line-dark)', background: 'var(--color-navy-raised)' }}>
        {/* Timeline */}
        <div className="relative flex flex-col gap-0">
          <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest mb-6">Module 02</span>
          {[
            { label: 'Offer accepted', done: true },
            { label: 'Documents', done: true },
            { label: 'Equipment', done: true, active: true },
            { label: 'System access', done: false },
            { label: 'Day 1', done: false },
          ].map(({ label, done, active }, i) => (
            <div key={label} className="flex items-start gap-4 pb-6 relative">
              {i < 4 && (
                <div className="absolute left-[9px] top-5 w-[1px] h-full"
                  style={{ background: done ? 'var(--color-coral)' : 'var(--color-line-dark)' }} />
              )}
              <div className="flex-shrink-0 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center mt-0.5 z-10"
                style={{
                  borderColor: active ? 'var(--color-coral)' : done ? 'var(--color-sage)' : 'var(--color-line-dark)',
                  background: done ? (active ? 'var(--color-coral)' : 'var(--color-sage)') : 'var(--color-navy)',
                }}>
                {done && !active && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                    <path d="M1.5 4l2 2 3-3" stroke="var(--color-navy)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div>
                <span className="font-mono text-[12px] text-(--color-offwhite)/80">{label}</span>
                {active && <span className="ml-3 font-mono text-[10px] text-(--color-coral)">← current</span>}
              </div>
            </div>
          ))}
          <div className="mt-1 ml-8">
            <span className="font-mono text-[10px] text-(--color-sage-dim)">SLA: 5 business days</span>
          </div>
        </div>

        <div>
          <h3 className="font-display font-700 text-[28px] text-(--color-offwhite) leading-[1.15] tracking-tight">
            Structured progress instead of email threads
          </h3>
          <p className="mt-4 text-[16px] leading-[1.6]" style={{ color: 'rgba(243,239,230,0.65)' }}>
            Onboarding and offboarding with visible progress, SLA tracking, and automatic routing — so nothing waits in someone's inbox.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['Offer to Day-1', 'Access Revoke', 'Checklist SLAs', 'Auto-routing'].map(t => <ModuleTag key={t}>{t}</ModuleTag>)}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function ModulePermissions() {
  const roles = ['Admin', 'Manager', 'Employee']
  const scopes = ['Payroll', 'Records', 'Approvals', 'Reports']
  const matrix = [
    [true, true, true, true],
    [false, true, true, false],
    [false, false, false, false],
  ]
  return (
    <Reveal delay={120} className="min-w-0 h-full lg:col-span-5">
      <div className="flex h-full flex-col gap-10 p-8 md:p-10 rounded-[12px]"
        style={{ border: '1px solid var(--color-line-dark)', background: 'var(--color-navy-raised)' }}>
        <div>
          <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest">Module 03</span>
          <h3 className="font-display font-700 text-[28px] text-(--color-offwhite) mt-3 leading-[1.15] tracking-tight">
            Access scoped to role, team, and context
          </h3>
          <p className="mt-4 text-[16px] leading-[1.6]" style={{ color: 'rgba(243,239,230,0.65)' }}>
            Not all-or-nothing permissions. Define exactly what each role can see, edit, and approve — and change it without a support ticket.
          </p>
        </div>
        {/* Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-3 font-mono text-[10px] text-(--color-sage-dim) uppercase tracking-widest w-24">Role</th>
                {scopes.map(s => <th key={s} className="pb-3 font-mono text-[10px] text-(--color-sage-dim) uppercase tracking-widest text-center">{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {roles.map((role, ri) => (
                <tr key={role} style={{ borderTop: '1px solid var(--color-line-dark)' }}>
                  <td className="py-3 font-mono text-[12px] text-(--color-offwhite)/70">{role}</td>
                  {matrix[ri].map((granted, ci) => (
                    <td key={ci} className="py-3 text-center">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ background: granted ? 'var(--color-sage)' : 'rgba(158,173,156,0.15)' }}
                        aria-label={granted ? 'Granted' : 'Restricted'}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  )
}

function ModuleTime() {
  return (
    <Reveal delay={60} className="min-w-0 h-full lg:col-span-7">
      <div className="h-full p-8 md:p-10 rounded-[12px]"
        style={{ border: '1px solid var(--color-line-dark)', background: 'var(--color-navy-raised)' }}>
        <div className="grid h-full md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest">Module 04</span>
            <h3 className="font-display font-700 text-[28px] text-(--color-offwhite) mt-3 leading-[1.15] tracking-tight">
              Time tracked with precision, not friction
            </h3>
            <p className="mt-4 text-[16px] leading-[1.6]" style={{ color: 'rgba(243,239,230,0.65)' }}>
              Flexible clock-in, break tracking, shift scheduling, and automated overtime alerts. Reports that don't need a spreadsheet.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {['Flexible Clock-In', 'Overtime Alerts', 'Shift Swaps', 'Reporting'].map(t => <ModuleTag key={t}>{t}</ModuleTag>)}
            </div>
          </div>
          {/* Timeline bar */}
          <div>
            <div className="mb-2 flex justify-between font-mono text-[10px] text-(--color-sage-dim)">
              <span>00:00</span><span>12:00</span><span>24:00</span>
            </div>
            <div className="relative h-8 rounded-[4px]" style={{ background: 'rgba(158,173,156,0.1)' }}>
              {/* Shift block */}
              <div className="absolute top-1 h-6 rounded-[3px]"
                style={{ left: '37.5%', width: '33.3%', background: 'rgba(158,173,156,0.3)' }} />
              {/* Break */}
              <div className="absolute top-1 h-6 rounded-[3px]"
                style={{ left: '52%', width: '6%', background: 'rgba(11,20,38,0.5)' }} />
              {/* Clock-in marker */}
              <div className="absolute top-0 bottom-0 w-0.5 rounded" style={{ left: '37.5%', background: 'var(--color-sage)' }} />
              {/* Clock-out marker */}
              <div className="absolute top-0 bottom-0 w-0.5 rounded" style={{ left: '70.8%', background: 'var(--color-sage)' }} />
              {/* Overtime alert */}
              <div className="absolute top-0 bottom-0 w-0.5 rounded animate-pulse-status"
                style={{ left: '66.7%', background: 'var(--color-coral)' }} />
              <span className="absolute top-[-18px] font-mono text-[9px] text-(--color-coral)"
                style={{ left: '64%' }}>overtime</span>
            </div>
            <div className="mt-4 flex gap-4 font-mono text-[10px] text-(--color-sage-dim)">
              <span><span style={{ color: 'var(--color-sage)' }}>│</span> Clock-in/out</span>
              <span><span style={{ color: 'var(--color-coral)' }}>│</span> Overtime alert</span>
              <span><span style={{ color: 'rgba(158,173,156,0.3)' }}>█</span> Active shift</span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function ModuleLeave() {
  const requests = [
    { name: 'A. Rossi', type: 'WFH request', status: 'Pending', variant: 'pending' as const },
    { name: 'M. Chen', type: 'Annual leave', status: 'Approved', variant: 'success' as const },
    { name: 'J. Okoro', type: 'Loan request', status: 'In review', variant: 'neutral' as const },
  ]
  return (
    <Reveal delay={80} className="min-w-0 h-full lg:col-span-7">
      <div className="grid h-full md:grid-cols-2 gap-10 items-center p-8 md:p-10 rounded-[12px]"
        style={{ border: '1px solid var(--color-line-dark)', background: 'var(--color-navy-raised)' }}>
        <div>
          <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest">Module 05</span>
          <h3 className="font-display font-700 text-[28px] text-(--color-offwhite) mt-3 leading-[1.15] tracking-tight">
            One queue. Chains that route themselves.
          </h3>
          <p className="mt-4 text-[16px] leading-[1.6]" style={{ color: 'rgba(243,239,230,0.65)' }}>
            Leave, WFH, promotions, and loans — one unified request queue with approval chains that know where to go.
          </p>
        </div>
        <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid var(--color-line-dark)' }}>
          {requests.map((r, i) => (
            <div key={r.name} className="flex items-center justify-between px-5 py-3.5"
              style={{ borderTop: i > 0 ? '1px solid var(--color-line-dark)' : undefined }}>
              <div>
                <span className="font-mono text-[11px] text-(--color-offwhite)/50 mr-2">{r.name}</span>
                <span className="text-[13px] text-(--color-offwhite)/80">{r.type}</span>
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                r.variant === 'success' ? 'text-(--color-sage)' :
                r.variant === 'pending' ? 'text-(--color-coral)' :
                'text-(--color-sage-dim)'
              }`}
                style={{ border: '1px solid', borderColor: r.variant === 'success' ? 'rgba(158,173,156,0.4)' : r.variant === 'pending' ? 'rgba(239,120,104,0.4)' : 'var(--color-line-dark)' }}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

function ModuleNotifs() {
  return (
    <Reveal delay={60} className="min-w-0 h-full lg:col-span-5">
      <div className="h-full p-8 md:p-10 rounded-[12px]"
        style={{ border: '1px solid var(--color-line-dark)', background: 'var(--color-navy-raised)' }}>
        <div className="flex h-full flex-col justify-between gap-10">
          <div>
            <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest">Module 06</span>
            <h3 className="font-display font-700 text-[28px] text-(--color-offwhite) mt-3 leading-[1.15] tracking-tight">
              The right message, in the right channel
            </h3>
            <p className="mt-4 text-[16px] leading-[1.6]" style={{ color: 'rgba(243,239,230,0.65)' }}>
              Automated routing across in-app and email channels, without anyone chasing it.
            </p>
          </div>
          <div className="flex gap-6 items-center justify-center">
            {[
              { label: 'IN-APP', active: true },
              { label: 'EMAIL', active: true },
              { label: 'AUTOMATED', active: false },
            ].map(({ label, active }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: active ? 'var(--color-coral)' : 'var(--color-sage)',
                    animation: `status-pulse ${active ? '2s' : '3s'} ease-in-out infinite`,
                  }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function Modules() {
  return (
    <section id="modules" className="scroll-mt-16" style={{ background: 'var(--color-navy)', padding: '96px 0' }}>
      <div className="max-w-[1280px] mx-auto px-8 md:px-12">
        <Reveal>
          <div className="mb-16">
            <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest">Core Modules</span>
            <h2 className="font-display font-700 text-[40px] text-(--color-offwhite) mt-4 leading-[1.1] tracking-tight max-w-xl">
              Every function of people operations, precisely built.
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-12">
          <ModuleIdentity />
          <ModuleOnboarding />
          <ModulePermissions />
          <ModuleTime />
          <ModuleLeave />
          <ModuleNotifs />
        </div>
      </div>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Provision', body: 'Add your organization, invite your team, and connect your existing identity provider in minutes.' },
    { n: '02', title: 'Configure scopes & chains', body: 'Define roles, approval sequences, leave policies, and notification rules with a visual builder.' },
    { n: '03', title: 'Operate', body: 'Your people operate inside one coherent system. The org chart reflects reality. Every request has a trail.' },
  ]
  return (
    <section style={{ background: 'var(--color-offwhite)', padding: '96px 0' }}>
      <div className="max-w-[1280px] mx-auto px-8 md:px-12">
        <Reveal>
          <span className="font-mono text-[11px] text-(--color-sage-dim) uppercase tracking-widest">How it works</span>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-3 gap-0 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-5 left-[16.67%] right-[16.67%] h-[1px]"
            style={{ background: 'var(--color-line-light)' }} />
          {steps.map(({ n, title, body }, i) => (
            <Reveal key={n} delay={i * 100}>
              <div className="relative flex flex-col gap-4 pr-12 md:pr-16">
                <div className="w-10 h-10 rounded-full border flex items-center justify-center mb-2 bg-(--color-offwhite) relative z-10"
                  style={{ borderColor: 'var(--color-line-light)' }}>
                  <span className="font-mono text-[12px] text-(--color-ink)">{n}</span>
                </div>
                <h3 className="font-display font-700 text-[22px] text-(--color-ink) tracking-tight">{title}</h3>
                <p className="text-[16px] leading-[1.6] text-(--color-sage-dim)">{body}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-5 right-0 text-(--color-line-light)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Security ──────────────────────────────────────────────────────────────────

function Security() {
  const specs = [
    { label: 'MFA Enforcement', desc: 'Organization-wide or per-group enforcement, with grace periods and bypass logging.' },
    { label: 'Audit Logging', desc: 'Immutable, timestamped event log for every access, approval, and configuration change.' },
    { label: 'Encrypted Credentials', desc: 'Secrets stored with AES-256 encryption at rest; keys never stored alongside data.' },
    { label: 'Scoped Data Access', desc: 'No user ever sees data outside their role and team boundary — enforced at the API layer.' },
    { label: 'SSO-Ready', desc: 'SAML 2.0 and OIDC compatible with your existing identity provider.' },
    { label: 'Session Controls', desc: 'Configurable session TTL, forced re-auth for sensitive actions, and device management.' },
  ]
  return (
    <section id="security" className="scroll-mt-16" style={{ background: 'var(--color-navy)', padding: '96px 0' }}>
      <div className="max-w-[1280px] mx-auto px-8 md:px-12">
        <Reveal>
          <div className="mb-16">
            <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest">Security & Trust</span>
            <h2 className="font-display font-700 text-[40px] text-(--color-offwhite) mt-4 leading-[1.1] tracking-tight">
              Built for organizations that operate at trust.
            </h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
          {specs.map(({ label, desc }, i) => (
            <Reveal key={label} delay={i * 60}>
              <div className="py-8 pr-8"
                style={{
                  borderTop: '1px solid var(--color-line-dark)',
                  borderLeft: i % (window.innerWidth >= 1024 ? 3 : 2) !== 0 ? '1px solid var(--color-line-dark)' : undefined,
                }}>
                <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest block mb-3">{label}</span>
                <p className="text-[14px] leading-[1.6]" style={{ color: 'rgba(243,239,230,0.6)' }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Closing ───────────────────────────────────────────────────────────────────

function Closing({ onSignUp }: { onSignUp: () => void }) {
  return (
    <section id="pricing" className="scroll-mt-16 py-32 text-center" style={{ background: 'var(--color-navy)' }}>
      <div className="max-w-[1280px] mx-auto px-8 md:px-12">
        <Reveal>
          <h2 className="font-display font-800 text-[56px] md:text-[72px] leading-[1.0] tracking-[-0.04em] text-(--color-offwhite) max-w-3xl mx-auto">
            Run people operations like an engineered system.
          </h2>
          <p className="mt-6 text-[17px] max-w-md mx-auto" style={{ color: 'rgba(243,239,230,0.55)' }}>
            Join teams that have replaced patchwork HR with one coherent platform.
          </p>

          {/* Email capture */}
          <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@company.com"
              className="flex-1 px-5 py-4 text-[15px] text-(--color-offwhite) bg-transparent placeholder:text-(--color-sage-dim) focus:outline-none"
              style={{ borderBottom: '1px solid var(--color-coral)' }}
              aria-label="Work email"
            />
            <button
              onClick={onSignUp}
              className="sm:ml-4 px-6 py-4 font-display font-600 text-[15px] text-(--color-coral) hover:text-(--color-coral-deep) transition-colors flex items-center gap-2"
              aria-label="Start free"
            >
              Start Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
          <p className="mt-4 font-mono text-[11px] text-(--color-sage-dim) uppercase tracking-widest">
            No credit card required · Setup in minutes
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    { title: 'Product', links: ['Overview', 'Modules', 'Security', 'Pricing', 'Changelog'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
    { title: 'Legal', links: ['Privacy', 'Terms', 'DPA', 'Cookies'] },
  ]
  return (
    <footer id="company" className="scroll-mt-16" style={{ background: 'var(--color-navy)', borderTop: '1px solid var(--color-line-dark)' }}>
      <div className="max-w-[1280px] mx-auto px-8 md:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <span className="font-display font-700 text-[18px] text-(--color-offwhite)">Cultr HR</span>
            <p className="mt-3 text-[14px] leading-[1.6]" style={{ color: 'rgba(243,239,230,0.45)' }}>
              People operations infrastructure for serious teams.
            </p>
          </div>
          {cols.map(({ title, links }) => (
            <div key={title}>
              <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">{title}</span>
              <ul className="mt-4 flex flex-col gap-3">
                {links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-[14px] transition-colors duration-150"
                      style={{ color: 'rgba(243,239,230,0.5)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-offwhite)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(243,239,230,0.5)')}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid var(--color-line-dark)' }}>
          <span className="font-mono text-[11px] text-(--color-sage-dim)">
            © 2026 Cultr HR, Inc.
          </span>
          <span className="font-mono text-[11px] flex items-center gap-2" style={{ color: 'rgba(158,173,156,0.6)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-sage) animate-pulse-status" />
            All systems operational · Updated just now
          </span>
        </div>
      </div>
    </footer>
  )
}

// ── Landing ───────────────────────────────────────────────────────────────────

export default function Landing({ onSignIn, onSignUp }: { onSignIn: () => void; onSignUp: () => void }) {
  return (
    <div>
      <Nav onSignIn={onSignIn} onSignUp={onSignUp} />
      <Hero onSignUp={onSignUp} />
      <ImpactSnapshot />
      <Modules />
      <HowItWorks />
      <Security />
      <Closing onSignUp={onSignUp} />
      <Footer />
    </div>
  )
}
