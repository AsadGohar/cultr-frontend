import { useState } from 'react'
import { MetricCard, StatusChip, Reveal } from '../components/cultre-ui'
import italyFlag from 'flag-icons/flags/1x1/it.svg'
import singaporeFlag from 'flag-icons/flags/1x1/sg.svg'
import nigeriaFlag from 'flag-icons/flags/1x1/ng.svg'
import indiaFlag from 'flag-icons/flags/1x1/in.svg'
import southKoreaFlag from 'flag-icons/flags/1x1/kr.svg'

const employees = [
  { name: 'A. Rossi', fullName: 'Alexandra Rossi', avatar: 'AR', time: '09:02', clockOutTime: '18:02', role: 'Senior Software Engineer', location: 'Italy', countryFlag: italyFlag, dept: 'Engineering', startDate: 'July 13, 2025' },
  { name: 'M. Chen', fullName: 'Mei Chen', avatar: 'MC', time: '08:51', clockOutTime: '17:51', role: 'Product Designer', location: 'Singapore', countryFlag: singaporeFlag, dept: 'Design', startDate: 'February 3, 2024' },
  { name: 'J. Okoro', fullName: 'Jide Okoro', avatar: 'JO', time: '09:14', clockOutTime: '17:14', role: 'Operations Lead', location: 'Nigeria', countryFlag: nigeriaFlag, dept: 'Operations', startDate: 'November 18, 2023' },
  { name: 'L. Singh', fullName: 'Leena Singh', avatar: 'LS', time: '08:39', clockOutTime: '16:39', role: 'Finance Analyst', location: 'India', countryFlag: indiaFlag, dept: 'Finance', startDate: 'April 8, 2024' },
  { name: 'T. Park', fullName: 'Taehyun Park', avatar: 'TP', time: '09:27', clockOutTime: '19:27', role: 'Frontend Engineer', location: 'South Korea', countryFlag: southKoreaFlag, dept: 'Engineering', startDate: 'January 20, 2025' },
]

type Employee = (typeof employees)[number]

function EmployeeHoverCard({ employee, id, activity = 'in' }: { employee: Employee; id: string; activity?: 'in' | 'out' }) {
  const activityTime = activity === 'in' ? employee.time : employee.clockOutTime
  const activityLabel = activity === 'in' ? 'Clocked in' : 'Clocked out'

  return (
    <div
      id={id}
      role="tooltip"
      className="invisible absolute left-1/2 top-[calc(100%+8px)] z-50 w-[min(320px,calc(100vw-64px))] -translate-x-[24%] translate-y-1 cursor-default rounded-[14px] border border-(--color-line-light) bg-(--color-offwhite-raised) text-left opacity-0 shadow-[0_20px_50px_rgba(11,20,38,0.2)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
    >
      <span className="absolute -top-2 left-0 h-2 w-full" aria-hidden="true" />

      <div className="flex items-center gap-3.5 p-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-700 text-white shadow-sm"
          style={{ background: 'linear-gradient(145deg, var(--color-coral), var(--color-coral-deep))' }}
          aria-hidden="true"
        >
          {employee.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[16px] font-700 text-(--color-ink)">{employee.fullName}</p>
          <p className="mt-0.5 truncate text-[12px] text-(--color-sage-dim)">{employee.role}</p>
        </div>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-sage)/20 text-(--color-sage-dim)"
          aria-label={activityLabel}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-(--color-line-light) px-4 py-3.5">
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-wider text-(--color-sage-dim)">Location</p>
          <div className="mt-1 flex items-center gap-1.5">
            <img
              src={employee.countryFlag}
              alt=""
              className="h-[18px] w-[18px] shrink-0 rounded-full object-cover shadow-[0_0_0_1px_rgba(11,20,38,0.12)]"
            />
            <p className="truncate text-[11px] font-600 leading-4 text-(--color-ink)">{employee.location}</p>
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-wider text-(--color-sage-dim)">Team</p>
          <p className="mt-1 text-[11px] font-600 leading-4 text-(--color-ink)">{employee.dept}</p>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-wider text-(--color-sage-dim)">Start date</p>
          <p className="mt-1 text-[11px] font-600 leading-4 text-(--color-ink)">{employee.startDate}</p>
        </div>
      </div>

      <div className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-[8px] bg-(--color-sage)/20 px-3 py-2.5 text-[12px] font-600 text-[#526650]">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8.5l3 3 7-7" />
        </svg>
        {activityLabel} today at {activityTime}
      </div>
    </div>
  )
}

const pending = [
  { name: 'M. Chen', type: 'Leave', label: 'Annual leave · 3 days', date: 'Aug 12–14' },
  { name: 'J. Okoro', type: 'WFH', label: 'Work from home · Thursday', date: 'Aug 7' },
  { name: 'T. Park', type: 'Promotion', label: 'Promotion request · L4→L5', date: 'Submitted Aug 2' },
]

const feed = [
  { time: '09:41', label: 'A. Rossi completed onboarding', type: 'success' },
  { time: '09:28', label: 'MFA enforced for Engineering team', type: 'info' },
  { time: '08:55', label: 'Leave request approved — L. Singh', type: 'success' },
  { time: '08:30', label: 'Overtime alert triggered — T. Park', type: 'alert' },
  { time: '08:12', label: 'New hire provisioned — R. Torres', type: 'info' },
]

export default function Overview() {
  const [approved, setApproved] = useState<number[]>([])
  const [declined, setDeclined] = useState<number[]>([])

  return (
    <div className="flex flex-col gap-8">
      {/* Metric row */}
      <Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Active employees" value="128" delta="4.2%" deltaUp />
          <MetricCard label="Pending approvals" value="3" delta="2" />
          <MetricCard label="Onboarding in progress" value="4" sub="SLA: 5 business days" />
          <MetricCard label="Overtime alerts this week" value="2" delta="1" />
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Main column */}
        <div className="flex flex-col gap-6">
          {/* Clock-in timeline */}
          <Reveal delay={60} className="relative z-10">
            <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-600 text-[16px] text-(--color-ink)">Today's clock-in activity</h3>
                <span className="font-mono text-[11px] text-(--color-sage-dim) uppercase tracking-widest">
                  {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
              {/* Timeline */}
              <div className="relative">
                <div className="flex justify-between font-mono text-[10px] text-(--color-sage-dim) mb-3">
                  {['08:00', '09:00', '10:00', '11:00', '12:00'].map(t => <span key={t}>{t}</span>)}
                </div>
                <div className="relative h-12 rounded-[4px] mb-4" style={{ background: 'rgba(11,20,38,0.04)' }}>
                  {employees.map((e, i) => {
                    const [h, m] = e.time.split(':').map(Number)
                    const pct = ((h - 8) * 60 + m) / 240 * 100
                    return (
                      <div
                        key={e.name}
                        className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 hover:z-40 focus-within:z-40"
                        style={{ left: `${pct}%` }}
                      >
                        <button
                          type="button"
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full font-mono text-[10px] font-500 transition-transform duration-150 hover:scale-110 focus-visible:scale-110"
                          style={{ background: 'var(--color-navy)', color: 'var(--color-sage)', border: '1px solid var(--color-line-dark)' }}
                          aria-label={`${e.fullName} clocked in at ${e.time}. Show employee details.`}
                          aria-describedby={`employee-card-${i}`}
                        >
                          {e.avatar}
                        </button>
                        <EmployeeHoverCard employee={e} id={`employee-card-${i}`} />
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3">
                  {employees.map(e => (
                    <div key={e.name} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono"
                        style={{ background: 'var(--color-navy)', color: 'var(--color-sage)' }}>
                        {e.avatar}
                      </div>
                      <span className="font-mono text-[11px] text-(--color-sage-dim)">{e.name} <span className="text-(--color-ink)">{e.time}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Clock-out timeline */}
          <Reveal delay={100} className="relative z-10">
            <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-600 text-[16px] text-(--color-ink)">Today's clock-out activity</h3>
                <span className="font-mono text-[11px] text-(--color-sage-dim) uppercase tracking-widest">
                  {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
              {/* Timeline */}
              <div className="relative">
                <div className="flex justify-between font-mono text-[10px] text-(--color-sage-dim) mb-3">
                  {['16:00', '17:00', '18:00', '19:00', '20:00'].map(t => <span key={t}>{t}</span>)}
                </div>
                <div className="relative h-12 rounded-[4px] mb-4" style={{ background: 'rgba(11,20,38,0.04)' }}>
                  {employees.map((e, i) => {
                    const [h, m] = e.clockOutTime.split(':').map(Number)
                    const pct = ((h - 16) * 60 + m) / 240 * 100
                    return (
                      <div
                        key={e.name}
                        className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 hover:z-40 focus-within:z-40"
                        style={{ left: `${pct}%` }}
                      >
                        <button
                          type="button"
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full font-mono text-[10px] font-500 transition-transform duration-150 hover:scale-110 focus-visible:scale-110"
                          style={{ background: 'var(--color-navy)', color: 'var(--color-sage)', border: '1px solid var(--color-line-dark)' }}
                          aria-label={`${e.fullName} clocked out at ${e.clockOutTime}. Show employee details.`}
                          aria-describedby={`clock-out-employee-card-${i}`}
                        >
                          {e.avatar}
                        </button>
                        <EmployeeHoverCard employee={e} id={`clock-out-employee-card-${i}`} activity="out" />
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3">
                  {employees.map(e => (
                    <div key={e.name} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono"
                        style={{ background: 'var(--color-navy)', color: 'var(--color-sage)' }}>
                        {e.avatar}
                      </div>
                      <span className="font-mono text-[11px] text-(--color-sage-dim)">{e.name} <span className="text-(--color-ink)">{e.clockOutTime}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Activity feed */}
          <Reveal delay={120}>
            <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
              <h3 className="font-display font-600 text-[16px] text-(--color-ink) mb-5">Recent activity</h3>
              <div className="flex flex-col">
                {feed.map(({ time, label, type }, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 py-3"
                    style={{ borderTop: i > 0 ? '1px solid var(--color-line-light)' : undefined }}
                  >
                    <span className="font-mono text-[11px] text-(--color-sage-dim) mt-0.5 w-12 shrink-0">{time}</span>
                    <div className="flex items-center gap-2.5 flex-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5"
                        style={{
                          background: type === 'success' ? 'var(--color-sage)' :
                            type === 'alert' ? 'var(--color-coral)' :
                            'var(--color-sage-dim)',
                        }}
                        aria-hidden="true"
                      />
                      <span className="text-[14px] text-(--color-ink)">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Needs attention */}
        <Reveal delay={80}>
          <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6 h-fit">
            <h3 className="font-display font-600 text-[16px] text-(--color-ink) mb-5">Needs your attention</h3>
            <div className="flex flex-col gap-4">
              {pending.map(({ name, type, label, date }, i) => {
                const done = approved.includes(i) || declined.includes(i)
                return (
                  <div
                    key={i}
                    className="rounded-[8px] p-4 transition-opacity"
                    style={{
                      background: 'var(--color-offwhite)',
                      border: '1px solid var(--color-line-light)',
                      opacity: done ? 0.4 : 1,
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-[11px] text-(--color-sage-dim)">{name}</span>
                      <StatusChip variant={type === 'Leave' ? 'info' : type === 'WFH' ? 'neutral' : 'pending'}>
                        {type}
                      </StatusChip>
                    </div>
                    <p className="text-[13px] text-(--color-ink) mb-1">{label}</p>
                    <p className="font-mono text-[11px] text-(--color-sage-dim) mb-3">{date}</p>
                    {!done && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setApproved(a => [...a, i])}
                          className="flex-1 py-1.5 rounded-[5px] text-[13px] font-display font-600 transition-colors"
                          style={{ background: 'var(--color-sage)', color: 'var(--color-navy)' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setDeclined(d => [...d, i])}
                          className="flex-1 py-1.5 rounded-[5px] text-[13px] font-display font-600 border transition-colors"
                          style={{ border: '1px solid var(--color-line-light)', color: 'var(--color-sage-dim)' }}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {approved.includes(i) && (
                      <span className="font-mono text-[11px] text-(--color-sage)">Approved</span>
                    )}
                    {declined.includes(i) && (
                      <span className="font-mono text-[11px] text-(--color-coral)">Declined</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
