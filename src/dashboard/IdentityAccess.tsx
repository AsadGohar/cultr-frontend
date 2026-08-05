import { useState } from 'react'
import { StatusChip, StatusDot, SlideOver, Toggle, Reveal } from '../components/cultr-ui'

export type IdentityAccessView = 'users' | 'mfa' | 'onboarding' | 'offboarding' | 'chains'

const users = [
  { name: 'Alexandra Rossi', role: 'Admin', dept: 'Engineering', mfa: true, lastActive: '2m ago' },
  { name: 'Marcus Chen', role: 'Manager', dept: 'Design', mfa: true, lastActive: '14m ago' },
  { name: 'Jasmine Okoro', role: 'Employee', dept: 'Operations', mfa: false, lastActive: '1h ago' },
  { name: 'Lena Singh', role: 'Manager', dept: 'Finance', mfa: true, lastActive: '3h ago' },
  { name: 'Taehyun Park', role: 'Employee', dept: 'Engineering', mfa: false, lastActive: 'Yesterday' },
  { name: 'Rosa Torres', role: 'Employee', dept: 'HR', mfa: true, lastActive: '45m ago' },
]

const onboardingHires = [
  { name: 'Daniel Yuen', stage: 3, started: 'Jul 29', dept: 'Product' },
  { name: 'Sophie Müller', stage: 2, started: 'Aug 1', dept: 'Design' },
  { name: 'Arjun Nair', stage: 4, started: 'Jul 22', dept: 'Engineering' },
  { name: 'Camille Fontaine', stage: 1, started: 'Aug 3', dept: 'Sales' },
]

const offboardingHires = [
  { name: 'Carlos Rivera', stage: 2, started: 'Jul 20', dept: 'Operations' },
  { name: 'Priya Kapoor', stage: 4, started: 'Jul 15', dept: 'Finance' },
]

const onboardingStages = ['Offer accepted', 'Documents', 'Equipment', 'System access', 'Day 1']
const offboardingStages = ['Notice period', 'Access revoke', 'Equipment return', 'Exit interview', 'Complete']

function UsersView() {
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [selected, setSelected] = useState<number | null>(null)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.dept.toLowerCase().includes(search.toLowerCase())
  )

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc)
    else { setSortCol(col); setSortAsc(true) }
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-sage-dim)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-transparent border border-(--color-line-light) rounded-[6px] text-[14px] text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral) transition-colors"
          />
        </div>
        <span className="font-mono text-[11px] text-(--color-sage-dim)">{filtered.length} users</span>
      </div>

      {/* Table */}
      <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] overflow-hidden">
        <div className="w-full overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-line-light)' }}>
              {[
                { key: 'name', label: 'Name' },
                { key: 'role', label: 'Role' },
                { key: 'dept', label: 'Department' },
                { key: 'mfa', label: 'MFA' },
                { key: 'lastActive', label: 'Last active' },
                { key: 'actions', label: '' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-5 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim) cursor-pointer select-none"
                  onClick={() => key !== 'actions' && handleSort(key)}
                >
                  {label}
                  {sortCol === key && (
                    <span className="ml-1 text-(--color-coral)">{sortAsc ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr
                key={u.name}
                className="cursor-pointer transition-colors"
                style={{
                  borderTop: i > 0 ? '1px solid var(--color-line-light)' : undefined,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-offwhite)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
                onClick={() => setSelected(i)}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px]"
                      style={{ background: 'var(--color-navy)', color: 'var(--color-sage)' }}>
                      {u.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-[14px] font-500 text-(--color-ink)">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatusChip variant={u.role === 'Admin' ? 'alert' : u.role === 'Manager' ? 'info' : 'neutral'}>
                    {u.role}
                  </StatusChip>
                </td>
                <td className="px-5 py-4 text-[14px] text-(--color-sage-dim)">{u.dept}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <StatusDot variant={u.mfa ? 'success' : 'alert'} />
                    <span className="font-mono text-[11px] text-(--color-sage-dim)">{u.mfa ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-[12px] text-(--color-sage-dim)">{u.lastActive}</td>
                <td className="px-5 py-4">
                  <button className="text-[13px] text-(--color-coral) hover:underline underline-offset-2">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {/* Pagination */}
        <div className="px-5 py-3.5 flex justify-between items-center" style={{ borderTop: '1px solid var(--color-line-light)' }}>
          <span className="font-mono text-[11px] text-(--color-sage-dim)">1–{filtered.length} of {users.length}</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded-[4px] font-mono text-[11px] text-(--color-sage-dim) border border-(--color-line-light) hover:border-(--color-coral) transition-colors">
              ← Prev
            </button>
            <button className="px-3 py-1.5 rounded-[4px] font-mono text-[11px] text-(--color-sage-dim) border border-(--color-line-light) hover:border-(--color-coral) transition-colors">
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* User detail slide-over */}
      <SlideOver
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected !== null ? users[selected]?.name : ''}
      >
        {selected !== null && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-mono text-[16px] font-500"
                style={{ background: 'var(--color-navy)', color: 'var(--color-sage)' }}>
                {users[selected].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-display font-700 text-[18px] text-(--color-ink)">{users[selected].name}</h3>
                <p className="text-[14px] text-(--color-sage-dim)">{users[selected].role} · {users[selected].dept}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'MFA', value: users[selected].mfa ? 'Enabled' : 'Disabled', ok: users[selected].mfa },
                { label: 'Last active', value: users[selected].lastActive, ok: true },
                { label: 'Department', value: users[selected].dept, ok: true },
                { label: 'Role', value: users[selected].role, ok: true },
              ].map(({ label, value, ok }) => (
                <div key={label} className="p-4 rounded-[8px]" style={{ background: 'var(--color-offwhite)', border: '1px solid var(--color-line-light)' }}>
                  <span className="font-mono text-[10px] text-(--color-sage-dim) uppercase tracking-widest block mb-1">{label}</span>
                  <span className="text-[14px] font-500" style={{ color: ok ? 'var(--color-ink)' : 'var(--color-coral)' }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-3 rounded-[6px] font-display font-600 text-[14px]"
                style={{ background: 'var(--color-coral)', color: 'white' }}>
                Edit user
              </button>
              <button className="flex-1 py-3 rounded-[6px] font-display font-600 text-[14px] border"
                style={{ border: '1px solid var(--color-line-light)', color: 'var(--color-sage-dim)' }}>
                Suspend
              </button>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  )
}

function MfaView() {
  const [policies, setPolicies] = useState({
    orgMfa: true,
    passwordExpiry: false,
    strongPassword: true,
    sessionTtl: false,
  })

  const auditLog = [
    { time: '09:41', event: 'MFA enforced for Engineering group', actor: 'A. Rossi' },
    { time: '08:30', event: 'Password policy updated — min length 12', actor: 'A. Rossi' },
    { time: 'Yesterday 16:12', event: 'Login from new device flagged', actor: 'System' },
    { time: 'Yesterday 10:05', event: 'SSO connection established', actor: 'A. Rossi' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
        <h3 className="font-display font-600 text-[16px] text-(--color-ink) mb-5">Security policies</h3>
        <div className="flex flex-col gap-0">
          {[
            { key: 'orgMfa', label: 'Require MFA org-wide', desc: 'All users must complete MFA setup before accessing the platform.' },
            { key: 'passwordExpiry', label: 'Password expiry (90 days)', desc: 'Users are prompted to change their password every 90 days.' },
            { key: 'strongPassword', label: 'Strong password enforcement', desc: 'Minimum 12 characters, upper, lower, number, and symbol required.' },
            { key: 'sessionTtl', label: 'Session timeout (30 min)', desc: 'Inactive sessions are terminated after 30 minutes of inactivity.' },
          ].map(({ key, label, desc }, i) => (
            <div key={key} className="flex items-start justify-between gap-6 py-4"
              style={{ borderTop: i > 0 ? '1px solid var(--color-line-light)' : undefined }}>
              <div>
                <p className="text-[15px] font-500 text-(--color-ink)">{label}</p>
                <p className="text-[13px] text-(--color-sage-dim) mt-0.5">{desc}</p>
              </div>
              <Toggle
                checked={policies[key as keyof typeof policies]}
                onChange={v => setPolicies(p => ({ ...p, [key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
        <h3 className="font-display font-600 text-[16px] text-(--color-ink) mb-5">Audit log</h3>
        <div className="flex flex-col">
          {auditLog.map(({ time, event, actor }, i) => (
            <div key={i} className="flex gap-5 py-3" style={{ borderTop: i > 0 ? '1px solid var(--color-line-light)' : undefined }}>
              <span className="font-mono text-[11px] text-(--color-sage-dim) w-36 shrink-0">{time}</span>
              <span className="text-[13px] text-(--color-ink) flex-1">{event}</span>
              <span className="font-mono text-[11px] text-(--color-sage-dim)">{actor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OnboardingView() {
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        {onboardingHires.map((hire, i) => (
          <button
            key={hire.name}
            className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-(--color-coral) hover:shadow-[0_10px_24px_rgba(11,20,38,0.07)]"
            onClick={() => setSelected(i)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-display font-600 text-[15px] text-(--color-ink)">{hire.name}</h4>
                <span className="font-mono text-[11px] text-(--color-sage-dim)">{hire.dept} · Started {hire.started}</span>
              </div>
              <StatusChip variant={hire.stage >= 4 ? 'success' : 'pending'}>
                Stage {hire.stage}/5
              </StatusChip>
            </div>
            {/* Progress bar */}
            <div className="flex gap-1">
              {onboardingStages.map((_, si) => (
                <div key={si} className="flex-1 h-1.5 rounded-full transition-all"
                  style={{ background: si < hire.stage ? 'var(--color-coral)' : 'var(--color-line-light)' }} />
              ))}
            </div>
            <div className="mt-2">
              <span className="font-mono text-[11px] text-(--color-sage-dim)">
                {onboardingStages[Math.min(hire.stage, 4)]}
              </span>
            </div>
          </button>
        ))}
      </div>

      <SlideOver open={selected !== null} onClose={() => setSelected(null)}
        title={selected !== null ? onboardingHires[selected]?.name : ''}>
        {selected !== null && (
          <div className="flex flex-col gap-5">
            <StatusChip variant="pending">{onboardingHires[selected].dept}</StatusChip>
            <h4 className="font-display font-600 text-[15px] text-(--color-ink)">Onboarding checklist</h4>
            {onboardingStages.map((stage, i) => {
              const done = i < onboardingHires[selected].stage
              const active = i === onboardingHires[selected].stage - 1
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: done ? 'var(--color-sage)' : active ? 'var(--color-coral)' : 'var(--color-line-light)', background: done ? 'var(--color-sage)' : 'transparent' }}>
                    {done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 5l2 2 4-4" stroke="var(--color-navy)" strokeWidth="1.5" /></svg>}
                  </div>
                  <span className="text-[14px]" style={{ color: active ? 'var(--color-ink)' : done ? 'var(--color-sage-dim)' : 'var(--color-line-light)' }}>
                    {stage}
                  </span>
                  {active && <span className="font-mono text-[10px] text-(--color-coral)">in progress</span>}
                </div>
              )
            })}
          </div>
        )}
      </SlideOver>
    </div>
  )
}

function OffboardingView() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {offboardingHires.map(hire => (
        <div key={hire.name} className="cursor-pointer bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-(--color-coral) hover:shadow-[0_10px_24px_rgba(11,20,38,0.07)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-display font-600 text-[15px] text-(--color-ink)">{hire.name}</h4>
              <span className="font-mono text-[11px] text-(--color-sage-dim)">{hire.dept} · Since {hire.started}</span>
            </div>
            <StatusChip variant={hire.stage >= 4 ? 'success' : 'alert'}>
              Stage {hire.stage}/5
            </StatusChip>
          </div>
          <div className="flex gap-1">
            {offboardingStages.map((_, si) => (
              <div key={si} className="flex-1 h-1.5 rounded-full"
                style={{ background: si < hire.stage ? 'var(--color-coral)' : 'var(--color-line-light)' }} />
            ))}
          </div>
          <span className="font-mono text-[11px] text-(--color-sage-dim) mt-2 block">
            {offboardingStages[Math.min(hire.stage, 4)]}
          </span>
        </div>
      ))}
    </div>
  )
}

function ChainsView() {
  const chain = [
    { name: 'Direct Manager', role: 'Manager' },
    { name: 'Department Head', role: 'Senior Manager' },
    { name: 'HR Lead', role: 'Admin' },
  ]
  return (
    <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-8">
      <h3 className="font-display font-600 text-[16px] text-(--color-ink) mb-8">Default approval chain</h3>
      <div className="flex flex-col gap-0 max-w-md">
        {chain.map((node, i) => (
          <div key={node.name}>
            <div className="flex items-center gap-4 p-4 rounded-[8px] border transition-colors"
              style={{ border: '1px solid var(--color-line-light)', background: 'var(--color-offwhite)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[12px]"
                style={{ background: 'var(--color-navy)', color: 'var(--color-sage)' }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-500 text-(--color-ink)">{node.name}</p>
                <p className="font-mono text-[11px] text-(--color-sage-dim)">{node.role}</p>
              </div>
              <button className="font-mono text-[11px] text-(--color-coral) hover:underline">Edit</button>
            </div>
            {i < chain.length - 1 && (
              <div className="flex items-center gap-4 py-2 ml-4">
                <div className="w-px h-6" style={{ background: 'var(--color-line-light)', marginLeft: '15px' }} />
                <span className="font-mono text-[10px] text-(--color-sage-dim)">then</span>
              </div>
            )}
          </div>
        ))}
        <button className="mt-4 py-3 border rounded-[8px] font-mono text-[12px] text-(--color-sage-dim) uppercase tracking-widest text-center hover:border-(--color-coral) hover:text-(--color-coral) transition-colors"
          style={{ border: '1px dashed var(--color-line-light)' }}>
          + Add step
        </button>
      </div>
    </div>
  )
}

const subViews: { id: IdentityAccessView; label: string }[] = [
  { id: 'users', label: 'Users' },
  { id: 'mfa', label: 'MFA & Security' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'offboarding', label: 'Offboarding' },
  { id: 'chains', label: 'Approval Chains' },
]

export default function IdentityAccess({ sub, onSubChange }: { sub?: IdentityAccessView; onSubChange?: (sub: IdentityAccessView) => void }) {
  const [internalActive, setInternalActive] = useState<IdentityAccessView>('users')
  const active = sub ?? internalActive

  const selectView = (next: IdentityAccessView) => {
    setInternalActive(next)
    onSubChange?.(next)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-nav tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1" style={{ borderBottom: '1px solid var(--color-line-light)' }}>
        {subViews.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => selectView(id)}
            className="px-4 py-2.5 font-display font-500 text-[14px] whitespace-nowrap transition-colors relative shrink-0 cursor-pointer rounded-t-[5px] hover:bg-(--color-navy)/5"
            style={{ color: active === id ? 'var(--color-ink)' : 'var(--color-sage-dim)' }}
          >
            {label}
            {active === id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: 'var(--color-coral)' }} />
            )}
          </button>
        ))}
      </div>

      <Reveal>
        {active === 'users' && <UsersView />}
        {active === 'mfa' && <MfaView />}
        {active === 'onboarding' && <OnboardingView />}
        {active === 'offboarding' && <OffboardingView />}
        {active === 'chains' && <ChainsView />}
      </Reveal>
    </div>
  )
}
