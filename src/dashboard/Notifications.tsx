import { useState } from 'react'
import { StatusChip, Toggle, Reveal } from '../components/cultr-ui'

export type NotificationTab = 'inapp' | 'email' | 'rules'
type Tab = NotificationTab

const inAppNotifs = [
  { id: 0, unread: true, text: 'Leave request from M. Chen requires your approval.', time: 'Just now', type: 'action' },
  { id: 1, unread: true, text: 'Overtime alert: T. Park exceeded 9h threshold.', time: '14m ago', type: 'alert' },
  { id: 2, unread: false, text: 'A. Rossi completed onboarding checklist.', time: '1h ago', type: 'success' },
  { id: 3, unread: false, text: 'MFA enforcement activated for Engineering team.', time: '3h ago', type: 'info' },
  { id: 4, unread: false, text: 'Shift swap proposal from R. Torres is pending review.', time: 'Yesterday', type: 'action' },
]

const emailLog = [
  { recipient: 'M. Chen', subject: 'Your leave request was received', sent: 'Aug 6, 09:42', status: 'delivered' },
  { recipient: 'T. Park', subject: 'Overtime threshold alert', sent: 'Aug 6, 08:32', status: 'delivered' },
  { recipient: 'A. Rossi', subject: 'Onboarding checklist complete', sent: 'Aug 6, 07:58', status: 'delivered' },
  { recipient: 'L. Singh', subject: 'Salary advance request update', sent: 'Aug 5, 16:12', status: 'bounced' },
]

type Rule = { id: number; event: string; role: string; channel: string; active: boolean }
const initialRules: Rule[] = [
  { id: 0, event: 'Leave request submitted', role: 'Manager', channel: 'In-App + Email', active: true },
  { id: 1, event: 'Overtime threshold breached', role: 'HR Lead', channel: 'Email', active: true },
  { id: 2, event: 'Onboarding stage completed', role: 'HR Lead', channel: 'In-App', active: false },
  { id: 3, event: 'MFA disabled for a user', role: 'Admin', channel: 'Email', active: true },
]

function InAppTab() {
  const [notifs, setNotifs] = useState(inAppNotifs)

  const markRead = (id: number) => setNotifs(n => n.map(x => x.id === id ? { ...x, unread: false } : x))

  const byDay: Record<string, typeof inAppNotifs> = {}
  notifs.forEach(n => {
    const key = n.time === 'Just now' || n.time.endsWith('ago') ? 'Today' : n.time
    ;(byDay[key] = byDay[key] || []).push(n)
  })

  return (
    <Reveal>
      <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] overflow-hidden">
        {Object.entries(byDay).map(([day, items]) => (
          <div key={day}>
            <div className="px-6 py-3" style={{ background: 'var(--color-offwhite)', borderBottom: '1px solid var(--color-line-light)' }}>
              <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">{day}</span>
            </div>
            {items.map((n, i) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className="w-full flex items-start gap-4 px-6 py-4 text-left transition-colors"
                style={{
                  borderTop: i > 0 ? '1px solid var(--color-line-light)' : undefined,
                  background: n.unread ? 'rgba(239,120,104,0.04)' : '',
                }}
                onMouseEnter={e => { if (!n.unread) e.currentTarget.style.background = 'var(--color-offwhite)' }}
                onMouseLeave={e => { e.currentTarget.style.background = n.unread ? 'rgba(239,120,104,0.04)' : '' }}
              >
                <div className="mt-1.5 shrink-0">
                  {n.unread
                    ? <span className="w-2 h-2 rounded-full block" style={{ background: 'var(--color-coral)' }} aria-label="Unread" />
                    : <span className="w-2 h-2 rounded-full block" style={{ background: 'var(--color-line-light)' }} aria-hidden="true" />}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] text-(--color-ink)">{n.text}</p>
                  <span className="font-mono text-[11px] text-(--color-sage-dim) mt-1 block">{n.time}</span>
                </div>
                <StatusChip variant={n.type === 'alert' ? 'alert' : n.type === 'success' ? 'success' : 'neutral'}>
                  {n.type}
                </StatusChip>
              </button>
            ))}
          </div>
        ))}
      </div>
    </Reveal>
  )
}

function EmailTab() {
  return (
    <Reveal>
      <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-line-light)' }}>
              {['Recipient', 'Subject', 'Sent', 'Delivery'].map(h => (
                <th key={h} className="px-6 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {emailLog.map((e, i) => (
              <tr key={i} style={{ borderTop: '1px solid var(--color-line-light)' }}
                className="transition-colors"
                onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--color-offwhite)')}
                onMouseLeave={ev => (ev.currentTarget.style.background = '')}>
                <td className="px-6 py-4 font-mono text-[12px] text-(--color-ink)">{e.recipient}</td>
                <td className="px-6 py-4 text-[14px] text-(--color-ink)">{e.subject}</td>
                <td className="px-6 py-4 font-mono text-[12px] text-(--color-sage-dim)">{e.sent}</td>
                <td className="px-6 py-4">
                  <StatusChip variant={e.status === 'delivered' ? 'success' : 'alert'}>
                    {e.status}
                  </StatusChip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  )
}

function RulesTab() {
  const [rules, setRules] = useState(initialRules)

  const toggle = (id: number) => setRules(r => r.map(x => x.id === id ? { ...x, active: !x.active } : x))
  const remove = (id: number) => setRules(r => r.filter(x => x.id !== id))

  return (
    <div className="flex flex-col gap-4">
      <Reveal>
        <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--color-line-light)' }}>
            <p className="text-[13px] text-(--color-sage-dim)">
              Rules fire automatically when conditions are met. Toggle to enable or disable.
            </p>
          </div>
          {rules.map((rule, i) => (
            <div key={rule.id} className="flex items-center gap-5 px-6 py-4"
              style={{ borderTop: i > 0 ? '1px solid var(--color-line-light)' : undefined }}>
              <Toggle checked={rule.active} onChange={() => toggle(rule.id)} />
              <div className="flex-1">
                <p className="text-[14px] text-(--color-ink)">
                  When <strong>{rule.event}</strong> occurs →{' '}
                  notify <strong>{rule.role}</strong> via{' '}
                  <strong>{rule.channel}</strong>
                </p>
              </div>
              <div className="flex gap-2">
                <button className="font-mono text-[11px] text-(--color-sage-dim) hover:text-(--color-ink) transition-colors uppercase tracking-widest">
                  Edit
                </button>
                <button onClick={() => remove(rule.id)}
                  className="font-mono text-[11px] text-(--color-coral) hover:underline uppercase tracking-widest">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="px-6 py-4" style={{ borderTop: '1px solid var(--color-line-light)' }}>
            <button className="font-mono text-[12px] text-(--color-coral) uppercase tracking-widest hover:underline flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 1v10M1 6h10" />
              </svg>
              Add rule
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  )
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'inapp', label: 'In-App' },
  { id: 'email', label: 'Email' },
  { id: 'rules', label: 'Automated Rules' },
]

export default function Notifications({ activeTab, onTabChange }: { activeTab?: NotificationTab; onTabChange?: (tab: NotificationTab) => void }) {
  const [internalActive, setInternalActive] = useState<NotificationTab>('inapp')
  const active = activeTab ?? internalActive

  const selectTab = (next: NotificationTab) => {
    setInternalActive(next)
    onTabChange?.(next)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 overflow-x-auto pb-1" style={{ borderBottom: '1px solid var(--color-line-light)' }}>
        {tabs.map(({ id, label }) => (
          <button key={id} onClick={() => selectTab(id)}
            className="px-4 py-2.5 font-display font-500 text-[14px] whitespace-nowrap transition-colors relative shrink-0 cursor-pointer rounded-t-[5px] hover:bg-(--color-navy)/5"
            style={{ color: active === id ? 'var(--color-ink)' : 'var(--color-sage-dim)' }}>
            {label}
            {active === id && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: 'var(--color-coral)' }} />}
          </button>
        ))}
      </div>
      {active === 'inapp' && <InAppTab />}
      {active === 'email' && <EmailTab />}
      {active === 'rules' && <RulesTab />}
    </div>
  )
}
