import { useState } from 'react'
import { Reveal, StatusChip } from '../components/cultr-ui'

export type TimeAttendanceView = 'clock' | 'overtime' | 'reports'
type SubView = TimeAttendanceView

const DAY_START = 7   // 07:00
const DAY_END   = 21  // 21:00
const SPAN      = DAY_END - DAY_START
const teams = ['Engineering', 'Design', 'Operations']

// Rich people data: shifts per day (0=Monâ€¦4=Fri), clockIn=actual time today
const people = [
  {
    name: 'Alexandra Rossi', initials: 'AR', team: 'Engineering', teamColor: '#9EAD9C',
    clockedIn: true, clockInTime: '09:02',
    shifts: [
      { day: 0, start: 9,  end: 18, break: { start: 12.5, end: 13.5 } },
      { day: 1, start: 9,  end: 18, break: { start: 12,   end: 13 } },
      { day: 2, start: 9,  end: 17, break: { start: 12.5, end: 13 } },
      { day: 3, start: 9,  end: 18, break: { start: 12,   end: 13 } },
      { day: 4, start: 9,  end: 17, break: { start: 12,   end: 13 } },
    ],
  },
  {
    name: 'Marcus Chen', initials: 'MC', team: 'Design', teamColor: '#8B9CC8',
    clockedIn: true, clockInTime: '10:08',
    shifts: [
      { day: 0, start: 10, end: 19, break: { start: 13, end: 14 } },
      { day: 1, start: 10, end: 19, break: { start: 13, end: 14 } },
      { day: 2, start: 10, end: 18, break: { start: 13, end: 14 } },
      { day: 3, start: 10, end: 19, break: { start: 13, end: 14 } },
    ],
  },
  {
    name: 'Jasmine Okoro', initials: 'JO', team: 'Operations', teamColor: '#C4A882',
    clockedIn: true, clockInTime: '08:51',
    shifts: [
      { day: 0, start: 8,  end: 17, break: { start: 12, end: 12.75 } },
      { day: 1, start: 8,  end: 17, break: { start: 12, end: 12.75 } },
      { day: 2, start: 8,  end: 17, break: { start: 12, end: 12.75 } },
      { day: 3, start: 8,  end: 17, break: { start: 12, end: 12.75 } },
      { day: 4, start: 8,  end: 16, break: { start: 12, end: 12.75 } },
    ],
  },
  {
    name: 'Taehyun Park', initials: 'TP', team: 'Engineering', teamColor: '#9EAD9C',
    clockedIn: false, clockInTime: null,
    shifts: [
      { day: 0, start: 9,  end: 20, break: { start: 13, end: 14 } },  // overtime day
      { day: 1, start: 9,  end: 20, break: { start: 13, end: 14 } },
      { day: 3, start: 9,  end: 18, break: { start: 12.5, end: 13.5 } },
      { day: 4, start: 9,  end: 18, break: { start: 12.5, end: 13.5 } },
    ],
  },
  {
    name: 'Lena Singh', initials: 'LS', team: 'Operations', teamColor: '#C4A882',
    clockedIn: true, clockInTime: '08:39',
    shifts: [
      { day: 1, start: 8,  end: 16, break: { start: 12, end: 13 } },
      { day: 2, start: 8,  end: 16, break: { start: 12, end: 13 } },
      { day: 3, start: 8,  end: 16, break: { start: 12, end: 13 } },
      { day: 4, start: 8,  end: 16, break: { start: 12, end: 13 } },
    ],
  },
  {
    name: 'Rosa Torres', initials: 'RT', team: 'Design', teamColor: '#8B9CC8',
    clockedIn: false, clockInTime: null,
    shifts: [
      { day: 0, start: 11, end: 19, break: { start: 14, end: 15 } },
      { day: 2, start: 11, end: 19, break: { start: 14, end: 15 } },
      { day: 3, start: 11, end: 19, break: { start: 14, end: 15 } },
      { day: 4, start: 11, end: 19, break: { start: 14, end: 15 } },
    ],
  },
]

const WEEK_DAYS = [
  { short: 'Mon', date: 'Aug 4' },
  { short: 'Tue', date: 'Aug 5' },
  { short: 'Wed', date: 'Aug 6' },
  { short: 'Thu', date: 'Aug 7' },
  { short: 'Fri', date: 'Aug 8' },
]

const HOUR_LABELS = Array.from({ length: SPAN + 1 }, (_, i) => {
  const h = DAY_START + i
  return h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`
})

const overtimeAlerts = [
  { name: 'T. Park', dept: 'Engineering', hours: 11, threshold: 9, date: 'Aug 6' },
  { name: 'J. Okoro', dept: 'Operations', hours: 10.5, threshold: 9, date: 'Aug 5' },
]

// px position helpers for the time axis
const toPct = (h: number) => ((h - DAY_START) / SPAN) * 100

// Simulated "now" = Mon 9:41am (day index 0, hour 9.68)
const NOW_DAY = 0
const NOW_HOUR = 9 + 41 / 60

function ShiftBar({ shift, teamColor, isToday }: {
  shift: { day: number; start: number; end: number; break: { start: number; end: number } }
  teamColor: string
  isToday: boolean
}) {
  const left   = toPct(shift.start)
  const width  = toPct(shift.end) - toPct(shift.start)
  const bLeft  = toPct(shift.break.start) - toPct(shift.start)
  const bWidth = toPct(shift.break.end) - toPct(shift.break.start)
  const overtime = shift.end > 18

  return (
    <div className="absolute inset-y-[6px] rounded-[4px] overflow-hidden"
      style={{
        left: `${left}%`,
        width: `${width}%`,
        background: isToday
          ? `${teamColor}28`
          : 'rgba(20,24,31,0.06)',
        border: `1px solid ${isToday ? teamColor + '50' : 'rgba(20,24,31,0.08)'}`,
      }}>
      {/* Break notch */}
      <div className="absolute top-0 bottom-0"
        style={{
          left: `${bLeft / width * 100}%`,
          width: `${bWidth / width * 100}%`,
          background: isToday ? 'rgba(243,239,230,0.6)' : 'rgba(243,239,230,0.8)',
        }} />
      {/* Overtime tint */}
      {overtime && (
        <div className="absolute top-0 bottom-0 right-0"
          style={{
            width: `${(toPct(shift.end) - toPct(18)) / width * 100}%`,
            background: 'rgba(239,120,104,0.25)',
            borderLeft: '1px solid rgba(239,120,104,0.4)',
          }} />
      )}
    </div>
  )
}

function ClockView() {
  const [teamFilter, setTeamFilter] = useState('All')
  const [activeDay, setActiveDay] = useState(0)

  const filtered = teamFilter === 'All'
    ? people
    : people.filter(p => p.team === teamFilter)

  const teams = ['Engineering', 'Design', 'Operations']

  // Count clocked in today
  const clockedInCount = people.filter(p => p.clockedIn).length

  return (
    <div className="flex flex-col gap-6">

      {/* Top strip: live summary + filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Live status summary */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse-status" style={{ background: 'var(--color-sage)' }} />
            <span className="font-mono text-[11px] text-(--color-sage) uppercase tracking-widest">
              {clockedInCount} clocked in now
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-line-light)' }} />
            <span className="font-mono text-[11px] text-(--color-sage-dim) uppercase tracking-widest">
              {people.length - clockedInCount} not started
            </span>
          </div>
        </div>

        {/* Team filter pills */}
        <div className="flex gap-1.5">
          {['All', ...teams].map(t => (
            <button key={t} onClick={() => setTeamFilter(t)}
              className="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all"
              style={{
                background: teamFilter === t ? 'var(--color-ink)' : 'transparent',
                color: teamFilter === t ? 'var(--color-offwhite)' : 'var(--color-sage-dim)',
                border: `1px solid ${teamFilter === t ? 'var(--color-ink)' : 'var(--color-line-light)'}`,
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Day selector */}
      <div className="flex gap-1.5">
        {WEEK_DAYS.map((d, i) => (
          <button key={i} onClick={() => setActiveDay(i)}
            className="flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-[8px] transition-all min-w-[72px]"
            style={{
              background: activeDay === i ? 'var(--color-navy)' : 'var(--color-offwhite-raised)',
              border: `1px solid ${activeDay === i ? 'var(--color-navy)' : 'var(--color-line-light)'}`,
            }}>
            <span className="font-mono text-[9px] uppercase tracking-widest"
              style={{ color: activeDay === i ? 'var(--color-sage)' : 'var(--color-sage-dim)' }}>
              {d.short}
            </span>
            <span className="font-display font-600 text-[15px]"
              style={{ color: activeDay === i ? 'var(--color-offwhite)' : 'var(--color-ink)' }}>
              {d.date.split(' ')[1]}
            </span>
            {i === NOW_DAY && (
              <span className="w-1 h-1 rounded-full" style={{ background: 'var(--color-coral)' }} aria-label="Today" />
            )}
          </button>
        ))}
      </div>

      {/* Main timeline panel */}
      <Reveal>
        <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] overflow-hidden">

          {/* Time axis header */}
          <div className="flex" style={{ borderBottom: '1px solid var(--color-line-light)' }}>
            {/* Person col */}
            <div className="w-[200px] shrink-0 px-5 py-3 font-mono text-[10px] text-(--color-sage-dim) uppercase tracking-widest">
              Member
            </div>
            {/* Hours */}
            <div className="flex-1 relative py-3 pr-4">
              <div className="flex justify-between">
                {HOUR_LABELS.filter((_, i) => i % 2 === 0).map(h => (
                  <span key={h} className="font-mono text-[10px] text-(--color-sage-dim)">{h}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Grid: vertical hour guides */}
          <div className="relative">
            {/* Hour guide lines â€” rendered behind rows */}
            <div className="absolute inset-0 pointer-events-none flex" aria-hidden="true">
              <div className="w-[200px] shrink-0" />
              <div className="flex-1 relative">
                {HOUR_LABELS.map((_, i) => (
                  <div key={i} className="absolute top-0 bottom-0 w-px"
                    style={{
                      left: `${(i / SPAN) * 100}%`,
                      background: 'var(--color-line-light)',
                    }} />
                ))}
                {/* Current time line â€” only shown when activeDay === NOW_DAY */}
                {activeDay === NOW_DAY && (
                  <div className="absolute top-0 bottom-0 w-px z-10"
                    style={{
                      left: `${toPct(NOW_HOUR)}%`,
                      background: 'var(--color-coral)',
                    }}>
                    <div className="absolute -top-0 -left-[3px] w-[7px] h-[7px] rounded-full"
                      style={{ background: 'var(--color-coral)' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Person rows */}
            {filtered.map((person, pi) => {
              const dayShift = person.shifts.find(s => s.day === activeDay)
              return (
                <div key={person.name}
                  className="flex items-center group"
                  style={{
                    borderTop: pi > 0 ? '1px solid var(--color-line-light)' : undefined,
                    minHeight: '64px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(20,24,31,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  {/* Person info */}
                  <div className="w-[200px] shrink-0 flex items-center gap-3 px-5 py-3">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-500"
                        style={{ background: person.teamColor + '22', color: person.teamColor, border: `1px solid ${person.teamColor}40` }}>
                        {person.initials}
                      </div>
                      {/* Live dot */}
                      {person.clockedIn && activeDay === NOW_DAY && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                          style={{ background: 'var(--color-sage)', borderColor: 'var(--color-offwhite-raised)' }}
                          aria-label="Clocked in" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-500 text-(--color-ink) truncate leading-tight">
                        {person.name.split(' ')[0]}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: person.teamColor }} aria-hidden="true" />
                        <span className="font-mono text-[10px] text-(--color-sage-dim) truncate">{person.team}</span>
                      </div>
                      {person.clockedIn && activeDay === NOW_DAY && (
                        <span className="font-mono text-[10px] text-(--color-sage) block mt-0.5">
                          In {person.clockInTime}
                        </span>
                      )}
                      {!person.clockedIn && activeDay === NOW_DAY && dayShift && (
                        <span className="font-mono text-[10px] text-(--color-sage-dim) block mt-0.5">
                          Not started
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timeline track */}
                  <div className="flex-1 relative h-full pr-4" style={{ minHeight: '64px' }}>
                    {dayShift ? (
                      <>
                        <ShiftBar
                          shift={dayShift}
                          teamColor={person.teamColor}
                          isToday={activeDay === NOW_DAY}
                        />
                        {/* Time label inside or near block */}
                        <div
                          className="absolute top-[10px] font-mono text-[9px] pointer-events-none"
                          style={{
                            left: `calc(${toPct(dayShift.start)}% + 6px)`,
                            color: activeDay === NOW_DAY ? person.teamColor : 'var(--color-sage-dim)',
                          }}
                        >
                          {dayShift.start}:00 â€“ {dayShift.end}:00
                          {dayShift.end > 18 && (
                            <span className="ml-1.5 font-mono text-[9px]" style={{ color: 'var(--color-coral)' }}>OT</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-y-[22px] left-0 right-4 flex items-center">
                        <span className="font-mono text-[10px] text-(--color-sage-dim)/40 uppercase tracking-widest">Off</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer legend */}
          <div className="flex items-center gap-6 px-5 py-3" style={{ borderTop: '1px solid var(--color-line-light)' }}>
            {[
              { label: 'Working hours', swatch: 'rgba(158,173,156,0.3)', border: 'rgba(158,173,156,0.5)' },
              { label: 'Break',         swatch: 'rgba(243,239,230,0.8)', border: 'rgba(20,24,31,0.1)' },
              { label: 'Overtime',      swatch: 'rgba(239,120,104,0.25)', border: 'rgba(239,120,104,0.4)' },
              { label: 'Now',           swatch: 'var(--color-coral)', border: '' },
            ].map(({ label, swatch, border }) => (
              <div key={label} className="flex items-center gap-2">
                {label === 'Now'
                  ? <div className="w-px h-3 rounded-full" style={{ background: swatch }} aria-hidden="true" />
                  : <div className="w-5 h-2.5 rounded-[2px]" style={{ background: swatch, border: `1px solid ${border}` }} aria-hidden="true" />
                }
                <span className="font-mono text-[10px] text-(--color-sage-dim) uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Clocked-in avatars row */}
      {activeDay === NOW_DAY && (
        <Reveal delay={80}>
          <div className="flex items-center gap-4 p-5 rounded-[10px]"
            style={{ background: 'var(--color-offwhite-raised)', border: '1px solid var(--color-line-light)' }}>
            <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim) shrink-0">Live now</span>
            <div className="flex items-center gap-0" style={{ marginLeft: '-2px' }}>
              {people.filter(p => p.clockedIn).map((p, i) => (
                <div
                  key={p.name}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[9px] font-500 border-2"
                  style={{
                    background: p.teamColor + '22',
                    color: p.teamColor,
                    borderColor: 'var(--color-offwhite-raised)',
                    marginLeft: i > 0 ? '-8px' : '0',
                    zIndex: 10 - i,
                    position: 'relative',
                  }}
                  title={p.name}
                  aria-label={`${p.name} â€” clocked in at ${p.clockInTime}`}
                >
                  {p.initials}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 ml-3">
              {people.filter(p => p.clockedIn).map(p => (
                <span key={p.name} className="font-mono text-[11px]" style={{ color: 'var(--color-sage-dim)' }}>
                  {p.name.split(' ')[0]}
                  <span className="text-[10px] ml-1" style={{ color: p.teamColor }}>{p.clockInTime}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </div>
  )
}

function OvertimeView() {
  const [threshold, setThreshold] = useState(9)

  return (
    <div className="flex flex-col gap-6">
      {/* Alert rules */}
      <Reveal>
        <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
          <h3 className="font-display font-600 text-[16px] text-(--color-ink) mb-4">Alert thresholds</h3>
          <div className="flex items-center gap-6">
            <label className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">
              Daily hour limit
            </label>
            <input
              type="range" min={7} max={12} value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="flex-1 accent-(--color-coral) max-w-xs"
              aria-label="Daily hour limit"
            />
            <span className="font-mono text-[15px] text-(--color-ink) font-500 w-10">{threshold}h</span>
          </div>
        </div>
      </Reveal>

      {/* Alerts */}
      <Reveal delay={60}>
        <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--color-line-light)' }}>
            <h3 className="font-display font-600 text-[16px] text-(--color-ink)">Recent overtime events</h3>
          </div>
          {overtimeAlerts.map((alert, i) => (
            <div key={alert.name} className="flex items-center justify-between px-6 py-4"
              style={{ borderTop: i > 0 ? '1px solid var(--color-line-light)' : undefined }}>
              <div className="flex items-center gap-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px]"
                  style={{ background: 'var(--color-navy)', color: 'var(--color-sage)' }}>
                  {alert.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-[14px] font-500 text-(--color-ink)">{alert.name}</p>
                  <p className="font-mono text-[11px] text-(--color-sage-dim)">{alert.dept}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[13px] text-(--color-coral)">{alert.hours}h worked</span>
                <StatusChip variant="alert">Overtime</StatusChip>
                <span className="font-mono text-[11px] text-(--color-sage-dim)">{alert.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}

function ReportsView() {
  const [dateRange, setDateRange] = useState('last30')
  const [teamFilter, setTeamFilter] = useState('All')
  const [generated, setGenerated] = useState(false)

  const metrics = [
    { label: 'Total hours logged', value: '2,847h' },
    { label: 'Avg daily hours', value: '8.3h' },
    { label: 'Overtime incidents', value: '12' },
    { label: 'Leave days taken', value: '47' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
          <h3 className="font-display font-600 text-[16px] text-(--color-ink) mb-6">Build a report</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">Date range</label>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="px-4 py-2.5 border rounded-[6px] text-[14px] text-(--color-ink) bg-transparent focus:outline-none focus:border-(--color-coral) appearance-none cursor-pointer"
                style={{ border: '1px solid var(--color-line-light)' }}
              >
                <option value="last7">Last 7 days</option>
                <option value="last30">Last 30 days</option>
                <option value="last90">Last 90 days</option>
                <option value="ytd">Year to date</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">Team</label>
              <select
                value={teamFilter}
                onChange={e => setTeamFilter(e.target.value)}
                className="px-4 py-2.5 border rounded-[6px] text-[14px] text-(--color-ink) bg-transparent focus:outline-none focus:border-(--color-coral) appearance-none cursor-pointer"
                style={{ border: '1px solid var(--color-line-light)' }}
              >
                {['All', ...teams].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">Metric</label>
              <select
                className="px-4 py-2.5 border rounded-[6px] text-[14px] text-(--color-ink) bg-transparent focus:outline-none focus:border-(--color-coral) appearance-none cursor-pointer"
                style={{ border: '1px solid var(--color-line-light)' }}
              >
                <option>Hours & attendance</option>
                <option>Overtime analysis</option>
                <option>Leave utilization</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setGenerated(true)}
            className="px-6 py-3 rounded-[6px] font-display font-600 text-[15px] transition-colors"
            style={{ background: 'var(--color-coral)', color: 'white' }}
          >
            Generate report
          </button>
        </div>
      </Reveal>

      {generated && (
        <Reveal>
          <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display font-600 text-[16px] text-(--color-ink)">Report preview</h3>
                <span className="font-mono text-[11px] text-(--color-sage-dim)">{teamFilter === 'All' ? 'All teams' : teamFilter} Â· {dateRange}</span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-[6px] font-mono text-[12px] uppercase tracking-widest border transition-colors hover:border-(--color-coral)"
                  style={{ border: '1px solid var(--color-line-light)', color: 'var(--color-sage-dim)' }}>
                  Export CSV
                </button>
                <button className="px-4 py-2 rounded-[6px] font-mono text-[12px] uppercase tracking-widest border transition-colors hover:border-(--color-coral)"
                  style={{ border: '1px solid var(--color-line-light)', color: 'var(--color-sage-dim)' }}>
                  Export PDF
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {metrics.map(({ label, value }) => (
                <div key={label} className="p-4 rounded-[8px]" style={{ background: 'var(--color-offwhite)', border: '1px solid var(--color-line-light)' }}>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim) block mb-2">{label}</span>
                  <span className="font-display font-700 text-[22px] text-(--color-ink)">{value}</span>
                </div>
              ))}
            </div>
            {/* Chart placeholder */}
            <div className="rounded-[8px] overflow-hidden" style={{ background: 'var(--color-offwhite)', border: '1px solid var(--color-line-light)', padding: '20px' }}>
              <svg viewBox="0 0 500 120" className="w-full" aria-label="Hours chart">
                <defs>
                  <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-sage)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--color-sage)" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                {[80, 65, 90, 75, 88, 72, 95, 68, 82, 77, 91, 85, 69, 93, 78, 84, 71, 89, 76, 92, 67, 83, 87, 74, 96, 79, 88, 73, 85, 91].map((h, i) => (
                  <rect key={i} x={i * 16 + 2} y={100 - h} width={12} height={h} rx="2" fill="url(#barGrad)" />
                ))}
                <line x1="0" y1="100" x2="500" y2="100" stroke="var(--color-line-light)" strokeWidth="1" />
              </svg>
              <div className="flex justify-between font-mono text-[10px] text-(--color-sage-dim) mt-2">
                <span>Jul 1</span><span>Jul 15</span><span>Aug 1</span>
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  )
}

const subViews: { id: SubView; label: string }[] = [
  { id: 'clock', label: 'Clock & Schedule' },
  { id: 'overtime', label: 'Overtime & Breaks' },
  { id: 'reports', label: 'Reports' },
]

export default function TimeAttendance({ sub, onSubChange }: { sub?: TimeAttendanceView; onSubChange?: (sub: TimeAttendanceView) => void }) {
  const [internalActive, setInternalActive] = useState<TimeAttendanceView>('clock')
  const active = sub ?? internalActive

  const selectView = (next: TimeAttendanceView) => {
    setInternalActive(next)
    onSubChange?.(next)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 overflow-x-auto pb-1" style={{ borderBottom: '1px solid var(--color-line-light)' }}>
        {subViews.map(({ id, label }) => (
          <button key={id} onClick={() => selectView(id)}
            className="px-4 py-2.5 font-display font-500 text-[14px] whitespace-nowrap transition-colors relative shrink-0 cursor-pointer rounded-t-[5px] hover:bg-(--color-navy)/5"
            style={{ color: active === id ? 'var(--color-ink)' : 'var(--color-sage-dim)' }}>
            {label}
            {active === id && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: 'var(--color-coral)' }} />}
          </button>
        ))}
      </div>
      {active === 'clock' && <ClockView />}
      {active === 'overtime' && <OvertimeView />}
      {active === 'reports' && <ReportsView />}
    </div>
  )
}
