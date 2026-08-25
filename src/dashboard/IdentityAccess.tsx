import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, Dropdown, Input, StatusChip, StatusDot, SlideOver, Toggle, Reveal } from '../components/cultre-ui'

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

type ProcessHire = { name: string; stage: number; started: string; dept: string }

function ProcessModal({
  hire,
  stages,
  process,
  onClose,
}: {
  hire: ProcessHire | null
  stages: string[]
  process: 'Onboarding' | 'Offboarding'
  onClose: () => void
}) {
  useEffect(() => {
    if (!hire) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [hire, onClose])

  if (!hire) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label={`Close ${process.toLowerCase()} details`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${process.toLowerCase()}-modal-title`}
        className="relative z-10 max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[12px] border border-(--color-line-light) bg-(--color-offwhite-raised) shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-(--color-line-light) px-6 py-5">
          <div>
            <h2 id={`${process.toLowerCase()}-modal-title`} className="font-display font-700 text-xl text-(--color-ink)">
              {hire.name}
            </h2>
            <p className="mt-1 font-mono text-[11px] text-(--color-sage-dim)">
              {hire.dept} · {process === 'Onboarding' ? 'Started' : 'Since'} {hire.started}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded text-(--color-sage-dim) transition-colors hover:text-(--color-ink)"
            aria-label="Close dialog"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-5 px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display font-600 text-[15px] text-(--color-ink)">{process} checklist</h3>
            <StatusChip variant={hire.stage >= 4 ? 'success' : process === 'Onboarding' ? 'pending' : 'alert'}>
              Stage {hire.stage}/{stages.length}
            </StatusChip>
          </div>
          <div className="flex flex-col gap-4">
            {stages.map((stage, index) => {
              const done = index < hire.stage
              const active = index === hire.stage - 1
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: done ? 'var(--color-sage)' : active ? 'var(--color-coral)' : 'var(--color-line-light)',
                      background: done ? 'var(--color-sage)' : 'transparent',
                    }}
                  >
                    {done && (
                      <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M2 5l2 2 4-4" stroke="var(--color-navy)" strokeWidth="1.5" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="flex-1 text-[14px]"
                    style={{ color: active ? 'var(--color-ink)' : done ? 'var(--color-sage-dim)' : 'var(--color-line-dark)' }}
                  >
                    {stage}
                  </span>
                  {active && <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-coral)">in progress</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function OnboardingView() {
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        {onboardingHires.map((hire, i) => (
          <button
            type="button"
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

      <ProcessModal
        hire={selected !== null ? onboardingHires[selected] : null}
        stages={onboardingStages}
        process="Onboarding"
        onClose={() => setSelected(null)}
      />
    </div>
  )
}

function OffboardingView() {
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        {offboardingHires.map((hire, index) => (
          <button
            type="button"
            key={hire.name}
            onClick={() => setSelected(index)}
            className="cursor-pointer bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-(--color-coral) hover:shadow-[0_10px_24px_rgba(11,20,38,0.07)]"
          >
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
          </button>
        ))}
      </div>
      <ProcessModal
        hire={selected !== null ? offboardingHires[selected] : null}
        stages={offboardingStages}
        process="Offboarding"
        onClose={() => setSelected(null)}
      />
    </div>
  )
}

type ApprovalStep = { id: number; userName: string }
type ApprovalChain = { id: number; name: string; steps: ApprovalStep[] }
type AssignmentTargetType = 'group' | 'user' | 'department'
type ApprovalChainAssignment = {
  approvalChainId: number
  requestId: string
  requestType: string
  setById: string
  setForId: string
  setForType: AssignmentTargetType
}

const requestOptions = [
  { value: 'LR-1042|leave', label: 'LR-1042', description: 'Leave request · Marcus Chen' },
  { value: 'WFH-208|wfh', label: 'WFH-208', description: 'Work from home request · Jasmine Okoro' },
  { value: 'PR-031|promotion', label: 'PR-031', description: 'Promotion request · Taehyun Park' },
  { value: 'LN-014|loan', label: 'LN-014', description: 'Loan request · Rosa Torres' },
  { value: 'SS-087|shift_swap', label: 'SS-087', description: 'Shift swap request · Lena Singh' },
]

const groupOptions = [
  { value: 'group-all-employees', label: 'All employees' },
  { value: 'group-managers', label: 'Managers' },
  { value: 'group-contractors', label: 'Contractors' },
]

function ChainsView() {
  const [chains, setChains] = useState<ApprovalChain[]>([
    {
      id: 0,
      name: 'Default approval chain',
      steps: [
        { id: 0, userName: 'Marcus Chen' },
        { id: 1, userName: 'Lena Singh' },
        { id: 2, userName: 'Alexandra Rossi' },
      ],
    },
  ])
  const [isAddingChain, setIsAddingChain] = useState(false)
  const [chainName, setChainName] = useState('')
  const [steps, setSteps] = useState<ApprovalStep[]>([{ id: 0, userName: '' }])
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null)
  const [assignments, setAssignments] = useState<ApprovalChainAssignment[]>([])
  const [isAssigning, setIsAssigning] = useState(false)
  const [requestId, setRequestId] = useState('')
  const [requestType, setRequestType] = useState('')
  const [setForType, setSetForType] = useState<AssignmentTargetType>('user')
  const [setForId, setSetForId] = useState('')
  const [assignmentSaved, setAssignmentSaved] = useState(false)

  const selectedChain = chains.find(chain => chain.id === selectedChainId) ?? null
  const userOptions = users.map((user, index) => ({
    value: `user-${index + 1}`,
    label: user.name,
    description: `${user.role} · ${user.dept}`,
  }))
  const departmentOptions = Array.from(new Set(users.map(user => user.dept))).map(department => ({
    value: `department-${department.toLowerCase().replaceAll(' ', '-')}`,
    label: department,
  }))
  const targetOptions = setForType === 'user'
    ? userOptions
    : setForType === 'department'
    ? departmentOptions
    : groupOptions

  const closeAddChain = () => {
    setIsAddingChain(false)
    setChainName('')
    setSteps([{ id: 0, userName: '' }])
  }

  const resetAssignmentForm = () => {
    setIsAssigning(false)
    setRequestId('')
    setRequestType('')
    setSetForType('user')
    setSetForId('')
    setAssignmentSaved(false)
  }

  const closeChainDetails = () => {
    setSelectedChainId(null)
    resetAssignmentForm()
  }

  useEffect(() => {
    if (!isAddingChain) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAddChain()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isAddingChain])

  useEffect(() => {
    if (selectedChainId === null) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeChainDetails()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [selectedChainId])

  const updateStep = (id: number, userName: string) => {
    setSteps(current => current.map(step => step.id === id ? { ...step, userName } : step))
  }

  const addStep = () => {
    setSteps(current => [
      ...current,
      { id: Math.max(-1, ...current.map(step => step.id)) + 1, userName: '' },
    ])
  }

  const removeStep = (id: number) => {
    setSteps(current => current.filter(step => step.id !== id))
  }

  const saveChain = () => {
    const name = chainName.trim()
    if (!name || steps.some(step => !step.userName)) return

    setChains(current => [
      ...current,
      {
        id: Math.max(-1, ...current.map(chain => chain.id)) + 1,
        name,
        steps,
      },
    ])
    closeAddChain()
  }

  const assignChain = () => {
    if (!selectedChain || !requestId.trim() || !requestType || !setForId) return

    setAssignments(current => [
      ...current,
      {
        approvalChainId: selectedChain.id,
        requestId: requestId.trim(),
        requestType,
        setById: 'user-1',
        setForId,
        setForType,
      },
    ])
    setIsAssigning(false)
    setRequestId('')
    setRequestType('')
    setSetForId('')
    setAssignmentSaved(true)
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display font-600 text-[16px] text-(--color-ink)">Approval chains</h3>
          <p className="mt-1 text-[13px] text-(--color-sage-dim)">Set the order in which users approve organization requests.</p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => setIsAddingChain(true)}
          className="shrink-0 cursor-pointer gap-2.5 whitespace-nowrap bg-(--color-coral) px-5 tracking-normal"
          aria-label="Add approval chain"
        >
          <span aria-hidden="true">+</span>
          <span>Add&nbsp;approval&nbsp;chain</span>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {chains.map(chain => {
          const assignmentCount = assignments.filter(assignment => assignment.approvalChainId === chain.id).length
          return (
            <button
              type="button"
              key={chain.id}
              onClick={() => {
                resetAssignmentForm()
                setSelectedChainId(chain.id)
              }}
              className="group min-h-36 cursor-pointer rounded-[12px] border border-(--color-line-light) bg-(--color-offwhite-raised) p-5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-(--color-coral) hover:shadow-[0_10px_24px_rgba(11,20,38,0.07)]"
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-display font-600 text-[15px] text-(--color-ink) transition-colors group-hover:text-(--color-coral)">
                  {chain.name}
                </h4>
                <svg className="shrink-0 text-(--color-sage-dim) transition-transform group-hover:translate-x-0.5 group-hover:text-(--color-coral)" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </div>
              <div className="mt-5 flex items-center gap-2">
                {chain.steps.slice(0, 4).map((step, index) => (
                  <div
                    key={step.id}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-(--color-offwhite-raised) font-mono text-[9px] text-(--color-sage)"
                    style={{ background: 'var(--color-navy)', marginLeft: index > 0 ? '-7px' : undefined }}
                    title={step.userName}
                  >
                    {step.userName.split(' ').map(part => part[0]).join('')}
                  </div>
                ))}
                <span className="ml-1 font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">
                  {chain.steps.length} {chain.steps.length === 1 ? 'step' : 'steps'}
                </span>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">
                {assignmentCount} {assignmentCount === 1 ? 'assignment' : 'assignments'}
              </p>
            </button>
          )
        })}
      </div>

      {selectedChain && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeChainDetails}
            aria-label="Close approval chain details"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chain-details-title"
            className="relative z-10 max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-[12px] border border-(--color-line-light) bg-(--color-offwhite-raised) shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-(--color-line-light) px-6 py-5">
              <div>
                <h2 id="chain-details-title" className="font-display font-700 text-xl text-(--color-ink)">{selectedChain.name}</h2>
                <p className="mt-1 text-[13px] text-(--color-sage-dim)">
                  {selectedChain.steps.length} {selectedChain.steps.length === 1 ? 'approval step' : 'approval steps'} ·{' '}
                  {assignments.filter(assignment => assignment.approvalChainId === selectedChain.id).length} assignments
                </p>
              </div>
              <button
                type="button"
                onClick={closeChainDetails}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded text-(--color-sage-dim) transition-colors hover:text-(--color-ink)"
                aria-label="Close dialog"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M12 4L4 12M4 4l8 8" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-6 px-6 py-6">
              <section>
                <h3 className="mb-4 font-display font-600 text-[15px] text-(--color-ink)">Approval steps</h3>
                <div className="flex flex-col gap-0">
                  {selectedChain.steps.map((step, index) => {
                    const user = users.find(item => item.name === step.userName)
                    return (
                      <div key={step.id}>
                        <div className="flex items-center gap-4 rounded-[8px] border border-(--color-line-light) bg-(--color-offwhite) p-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[12px]"
                            style={{ background: 'var(--color-navy)', color: 'var(--color-sage)' }}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-500 text-(--color-ink)">{step.userName}</p>
                            <p className="font-mono text-[11px] text-(--color-sage-dim)">
                              {user ? `${user.role} · ${user.dept}` : 'Approver'}
                            </p>
                          </div>
                        </div>
                        {index < selectedChain.steps.length - 1 && (
                          <div className="ml-4 flex items-center gap-4 py-2">
                            <div className="h-5 w-px" style={{ background: 'var(--color-line-light)', marginLeft: '15px' }} />
                            <span className="font-mono text-[10px] text-(--color-sage-dim)">then</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>

              {assignmentSaved && (
                <div role="status" className="rounded-[8px] border border-(--color-sage)/40 bg-(--color-sage)/15 px-4 py-3 text-[13px] text-(--color-ink)">
                  Approval chain assigned successfully.
                </div>
              )}

              {!isAssigning ? (
                <div className="flex justify-end border-t border-(--color-line-light) pt-5">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAssigning(true)
                      setAssignmentSaved(false)
                    }}
                    className="bg-(--color-coral) hover:bg-(--color-coral)"
                  >
                    Assign approval chain
                  </Button>
                </div>
              ) : (
                <form
                  className="flex flex-col gap-5 border-t border-(--color-line-light) pt-5"
                  onSubmit={event => {
                    event.preventDefault()
                    assignChain()
                  }}
                >
                  <div>
                    <h3 className="font-display font-600 text-[15px] text-(--color-ink)">Assign approval chain</h3>
                    <p className="mt-1 text-[13px] text-(--color-sage-dim)">Choose a request and who this approval chain should apply to.</p>
                  </div>
                  <div className="grid gap-4">
                    <Dropdown
                      label="Request"
                      value={requestId && requestType ? `${requestId}|${requestType}` : ''}
                      onChange={value => {
                        const [nextRequestId, nextRequestType] = (value as string).split('|')
                        setRequestId(nextRequestId)
                        setRequestType(nextRequestType)
                      }}
                      options={requestOptions}
                      placeholder="Select a request"
                      searchable
                    />
                    <Dropdown
                      label="Assign to"
                      value={setForType}
                      onChange={value => {
                        setSetForType(value as AssignmentTargetType)
                        setSetForId('')
                      }}
                      options={[
                        { value: 'user', label: 'User' },
                        { value: 'group', label: 'Group' },
                        { value: 'department', label: 'Department' },
                      ]}
                    />
                    <Dropdown
                      label={setForType === 'user' ? 'User' : setForType === 'group' ? 'Group' : 'Department'}
                      value={setForId}
                      onChange={value => setSetForId(value as string)}
                      options={targetOptions}
                      placeholder={`Select a ${setForType}`}
                      searchable
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAssigning(false)}
                      className="cursor-pointer rounded-[6px] px-5 py-3 font-display font-600 text-[14px] text-(--color-sage-dim) transition-colors hover:text-(--color-ink)"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      disabled={!requestId.trim() || !requestType || !setForId}
                      className="bg-(--color-coral) hover:bg-(--color-coral) disabled:opacity-100"
                    >
                      Assign chain
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {isAddingChain && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeAddChain}
            aria-label="Close add approval chain dialog"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-chain-title"
            className="relative z-10 max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-[12px] border border-(--color-line-light) bg-(--color-offwhite-raised) shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-(--color-line-light) px-6 py-5">
              <div>
                <h2 id="add-chain-title" className="font-display font-700 text-xl text-(--color-ink)">Add approval chain</h2>
                <p className="mt-1 text-[13px] text-(--color-sage-dim)">Name the chain and select an approver for each step.</p>
              </div>
              <button
                type="button"
                onClick={closeAddChain}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded text-(--color-sage-dim) transition-colors hover:text-(--color-ink)"
                aria-label="Close dialog"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M12 4L4 12M4 4l8 8" />
                </svg>
              </button>
            </div>
            <form
              className="flex flex-col gap-6 px-6 py-6"
              onSubmit={event => {
                event.preventDefault()
                saveChain()
              }}
            >
              <Input
                autoFocus
                label="Approval chain name"
                value={chainName}
                onChange={event => setChainName(event.target.value)}
                placeholder="e.g. Leave request approvals"
              />

              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="font-display font-600 text-[15px] text-(--color-ink)">Approval steps</h3>
                  <p className="mt-1 text-[13px] text-(--color-sage-dim)">Approvals will run from the first step to the last.</p>
                </div>
                {steps.map((step, index) => (
                  <div key={step.id} className="rounded-[8px] border border-(--color-line-light) bg-(--color-offwhite) p-4">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">
                        Step {index + 1}
                      </span>
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(step.id)}
                          className="cursor-pointer font-mono text-[10px] uppercase tracking-widest text-(--color-coral) hover:underline"
                        >
                          Remove step
                        </button>
                      )}
                    </div>
                    <Dropdown
                      value={step.userName}
                      onChange={value => updateStep(step.id, value as string)}
                      options={users.map(user => ({
                        value: user.name,
                        label: user.name,
                        description: `${user.role} · ${user.dept}`,
                      }))}
                      placeholder="Select a user"
                      searchPlaceholder="Search users..."
                      searchable
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStep}
                  className="cursor-pointer rounded-[8px] border border-dashed border-(--color-line-light) py-3 font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim) transition-colors hover:border-(--color-coral) hover:text-(--color-coral)"
                >
                  + Add step
                </button>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddChain}
                  className="cursor-pointer rounded-[6px] px-5 py-3 font-display font-600 text-[14px] text-(--color-sage-dim) transition-colors hover:text-(--color-ink)"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={!chainName.trim() || steps.some(step => !step.userName)}
                  className="bg-(--color-coral) hover:bg-(--color-coral) disabled:opacity-100"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
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
