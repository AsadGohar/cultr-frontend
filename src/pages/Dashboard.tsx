import { useEffect, useRef, useState, type ReactNode } from 'react'
import Overview from '../dashboard/Overview'
import IdentityAccess, { type IdentityAccessView } from '../dashboard/IdentityAccess'
import Permissions from '../dashboard/Permissions'
import TimeAttendance, { type TimeAttendanceView } from '../dashboard/TimeAttendance'
import LeaveRequests, { type RequestTab } from '../dashboard/LeaveRequests'
import Notifications, { type NotificationTab } from '../dashboard/Notifications'
import Settings, { type SettingSection } from '../dashboard/Settings'
import { Tooltip } from '../components/cultr-ui'

// ── Types ─────────────────────────────────────────────────────────────────────

type View =
  | 'overview'
  | 'users' | 'mfa' | 'onboarding' | 'offboarding' | 'chains'
  | 'roles'
  | 'clock' | 'overtime' | 'reports'
  | 'requests-all' | 'leave' | 'wfh' | 'promotion' | 'loan' | 'shifts'
  | 'notif-inapp' | 'notif-email' | 'notif-rules'
  | 'settings-org' | 'settings-billing'

interface NavItem {
  view: View
  label: string
  icon: ReactNode
}

interface NavGroup {
  section: string
  items: NavItem[]
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const Icon = ({ d, ...rest }: { d: string; [k: string]: unknown }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    <path d={d} />
  </svg>
)

const icons = {
  home: <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
  users: <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />,
  shield: <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  userPlus: <Icon d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6" />,
  userMinus: <Icon d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM23 11h-6" />,
  link: <Icon d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />,
  lock: <Icon d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM17 11V7a5 5 0 00-10 0v4" />,
  clock: <Icon d="M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2" />,
  alert: <Icon d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />,
  bar: <Icon d="M18 20V10M12 20V4M6 20v-6" />,
  calendar: <Icon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />,
  briefcase: <Icon d="M20 7H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />,
  bell: <Icon d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />,
  mail: <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />,
  zap: <Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  settings: <Icon d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />,
  creditCard: <Icon d="M1 4h22v16H1zM1 10h22" />,
}

// ── Nav groups ────────────────────────────────────────────────────────────────

const navGroups: NavGroup[] = [
  {
    section: 'Overview',
    items: [{ view: 'overview', label: 'Home', icon: icons.home }],
  },
  {
    section: 'Identity & Access',
    items: [
      { view: 'users', label: 'Users', icon: icons.users },
      { view: 'mfa', label: 'MFA & Security', icon: icons.shield },
      { view: 'onboarding', label: 'Onboarding', icon: icons.userPlus },
      { view: 'offboarding', label: 'Offboarding', icon: icons.userMinus },
      { view: 'chains', label: 'Approval Chains', icon: icons.link },
    ],
  },
  {
    section: 'Permissions',
    items: [{ view: 'roles', label: 'Roles & Scopes', icon: icons.lock }],
  },
  {
    section: 'Time & Attendance',
    items: [
      { view: 'clock', label: 'Clock & Schedule', icon: icons.clock },
      { view: 'overtime', label: 'Overtime & Breaks', icon: icons.alert },
      { view: 'reports', label: 'Reports', icon: icons.bar },
    ],
  },
  {
    section: 'Requests',
    items: [
      { view: 'leave', label: 'Leave & WFH', icon: icons.calendar },
      { view: 'shifts', label: 'Shift Swaps', icon: icons.briefcase },
    ],
  },
  {
    section: 'Notifications',
    items: [
      { view: 'notif-inapp', label: 'In-App', icon: icons.bell },
      { view: 'notif-email', label: 'Email', icon: icons.mail },
      { view: 'notif-rules', label: 'Automated Rules', icon: icons.zap },
    ],
  },
  {
    section: 'Settings',
    items: [
      { view: 'settings-org', label: 'Organization', icon: icons.settings },
      { view: 'settings-billing', label: 'Billing', icon: icons.creditCard },
    ],
  },
]

// ── Breadcrumb map ────────────────────────────────────────────────────────────

const breadcrumbs: Record<View, [{ label: string; view: View }, { label: string; view: View }]> = {
  overview: [{ label: 'Overview', view: 'overview' }, { label: 'Home', view: 'overview' }],
  users: [{ label: 'Identity & Access', view: 'users' }, { label: 'Users', view: 'users' }],
  mfa: [{ label: 'Identity & Access', view: 'users' }, { label: 'MFA & Security', view: 'mfa' }],
  onboarding: [{ label: 'Identity & Access', view: 'users' }, { label: 'Onboarding', view: 'onboarding' }],
  offboarding: [{ label: 'Identity & Access', view: 'users' }, { label: 'Offboarding', view: 'offboarding' }],
  chains: [{ label: 'Identity & Access', view: 'users' }, { label: 'Approval Chains', view: 'chains' }],
  roles: [{ label: 'Permissions', view: 'roles' }, { label: 'Roles & Scopes', view: 'roles' }],
  clock: [{ label: 'Time & Attendance', view: 'clock' }, { label: 'Clock & Schedule', view: 'clock' }],
  overtime: [{ label: 'Time & Attendance', view: 'clock' }, { label: 'Overtime & Breaks', view: 'overtime' }],
  reports: [{ label: 'Time & Attendance', view: 'clock' }, { label: 'Reports', view: 'reports' }],
  'requests-all': [{ label: 'Requests', view: 'requests-all' }, { label: 'All', view: 'requests-all' }],
  leave: [{ label: 'Requests', view: 'requests-all' }, { label: 'Leave & WFH', view: 'leave' }],
  wfh: [{ label: 'Requests', view: 'requests-all' }, { label: 'WFH', view: 'wfh' }],
  promotion: [{ label: 'Requests', view: 'requests-all' }, { label: 'Promotion', view: 'promotion' }],
  loan: [{ label: 'Requests', view: 'requests-all' }, { label: 'Loan', view: 'loan' }],
  shifts: [{ label: 'Requests', view: 'requests-all' }, { label: 'Shift Swaps', view: 'shifts' }],
  'notif-inapp': [{ label: 'Notifications', view: 'notif-inapp' }, { label: 'In-App', view: 'notif-inapp' }],
  'notif-email': [{ label: 'Notifications', view: 'notif-inapp' }, { label: 'Email', view: 'notif-email' }],
  'notif-rules': [{ label: 'Notifications', view: 'notif-inapp' }, { label: 'Automated Rules', view: 'notif-rules' }],
  'settings-org': [{ label: 'Settings', view: 'settings-org' }, { label: 'Organization', view: 'settings-org' }],
  'settings-billing': [{ label: 'Settings', view: 'settings-org' }, { label: 'Billing', view: 'settings-billing' }],
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({
  collapsed,
  onToggle,
  view,
  onView,
}: {
  collapsed: boolean
  onToggle: () => void
  view: View
  onView: (v: View) => void
}) {
  const w = collapsed ? '72px' : '248px'

  return (
    <aside
      className="relative flex flex-col h-full overflow-visible flex-shrink-0"
      style={{
        width: w,
        minWidth: w,
        background: 'var(--color-navy)',
        borderRight: '1px solid var(--color-line-dark)',
        transition: 'width 250ms cubic-bezier(0.22,1,0.36,1), min-width 250ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Wordmark */}
      <div className="flex items-center gap-3 px-4 h-16 flex-shrink-0" style={{ borderBottom: '1px solid var(--color-line-dark)' }}>
        <div className="w-8 h-8 rounded-[6px] flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-coral)' }}>
          <img src="/cultr-favicon-white.png" alt="" className="w-5 h-5 object-contain" />
        </div>
        {!collapsed && (
          <span className="font-display font-700 text-[15px] text-(--color-offwhite) truncate tracking-tight">
            Cultr HR
          </span>
        )}
      </div>

      {/* Compact collapse control */}
      <button
        onClick={onToggle}
        className="absolute top-5 -right-3 z-20 w-6 h-6 flex items-center justify-center rounded-full border border-(--color-line-dark) bg-(--color-navy-raised) text-(--color-sage) shadow-[0_3px_10px_rgba(0,0,0,0.25)] transition-colors hover:text-(--color-coral) hover:border-(--color-coral) cursor-pointer"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 250ms cubic-bezier(0.22,1,0.36,1)' }}
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4" aria-label="Main navigation">
        {navGroups.map(({ section, items }) => (
          <div key={section} className="mb-1">
            {!collapsed && (
              <div className="px-4 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-(--color-white)">
                {section}
              </div>
            )}
            {items.map(({ view: v, label, icon }) => {
              const active = view === v || (
                v === 'leave' && ['requests-all', 'wfh', 'promotion', 'loan'].includes(view)
              )
              return (
                <button
                  key={v}
                  onClick={() => onView(v)}
                  title={collapsed ? label : undefined}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors relative text-left cursor-pointer"
                  style={{
                    color: active ? 'var(--color-coral)' : 'var(--color-sage-dim)',
                    background: active ? 'rgba(239,120,104,0.08)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(158,173,156,0.05)', e.currentTarget.style.color = 'var(--color-white)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = active ? 'rgba(239,120,104,0.08)' : 'transparent', e.currentTarget.style.color = active ? 'var(--color-coral)' : 'var(--color-sage-dim)' }}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
                      style={{ background: 'var(--color-coral)' }}
                    />
                  )}
                  <span className="flex-shrink-0">{icon}</span>
                  {!collapsed && (
                    <span className="text-[13px] font-display font-500 truncate">{label}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

    </aside>
  )
}

// ── Top bar ───────────────────────────────────────────────────────────────────

function TopBar({ view, unread, onView, onNotif, onSignOut }: { view: View; unread: number; onView: (view: View) => void; onNotif: () => void; onSignOut: () => void }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) setUserMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <header className="h-16 flex items-center justify-between gap-3 pl-14 pr-4 md:px-6 flex-shrink-0"
      style={{ background: 'var(--color-offwhite-raised)', borderBottom: '1px solid var(--color-line-light)' }}>
      <nav className="flex min-w-0 items-center gap-2 truncate font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)" aria-label="Breadcrumb">
        {breadcrumbs[view].map((item, index) => (
          <span key={`${item.view}-${item.label}`} className="flex min-w-0 items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            <button
              type="button"
              onClick={() => onView(item.view)}
              className="truncate transition-colors hover:text-(--color-coral) hover:underline hover:underline-offset-4"
              aria-current={index === breadcrumbs[view].length - 1 ? 'page' : undefined}
            >
              {item.label}
            </button>
          </span>
        ))}
      </nav>
      <div className="flex shrink-0 items-center gap-3 md:gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-sage-dim)" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 w-52 bg-transparent border border-(--color-line-light) rounded-[6px] text-[13px] text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral) transition-colors"
          />
        </div>

        {/* Notification bell */}
        <Tooltip content={`${unread} unread notifications`} side="bottom">
          <button
            onClick={onNotif}
            className="relative w-9 h-9 flex items-center justify-center rounded-[6px] transition-colors"
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-offwhite)')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}
            aria-label={`Notifications (${unread} unread)`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage-dim)" strokeWidth="1.5" aria-hidden="true">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: 'var(--color-coral)' }}
                aria-hidden="true" />
            )}
          </button>
        </Tooltip>

        {/* User menu */}
        <div ref={userMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(open => !open)}
            className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] text-white transition-all hover:ring-2 hover:ring-(--color-coral)/25 focus-visible:ring-2 focus-visible:ring-(--color-coral)/30"
            style={{ background: 'var(--color-coral)' }}
            aria-label="Open user menu"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
          >
            AR
          </button>

          {userMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 z-50 w-56 overflow-hidden rounded-[8px] border border-(--color-line-light) bg-(--color-offwhite-raised) shadow-[0_16px_40px_rgba(11,20,38,0.16)] animate-dropdown-in"
            >
              <div className="px-4 py-3.5 border-b border-(--color-line-light)">
                <p className="font-display font-600 text-[14px] text-(--color-ink)">Alexandra Rossi</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">Administrator</p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={onSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-[13px] text-(--color-coral) transition-colors hover:bg-(--color-coral)/6"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// ── Content router ────────────────────────────────────────────────────────────

function ViewContent({ view, onView }: { view: View; onView: (view: View) => void }) {
  if (view === 'overview') return <Overview />
  if (view === 'users' || view === 'mfa' || view === 'onboarding' || view === 'offboarding' || view === 'chains') {
    return <IdentityAccess sub={view as IdentityAccessView} onSubChange={onView} />
  }
  if (view === 'roles') return <Permissions />
  if (view === 'clock' || view === 'overtime' || view === 'reports') {
    return <TimeAttendance sub={view as TimeAttendanceView} onSubChange={onView} />
  }
  if (view === 'requests-all' || view === 'leave' || view === 'wfh' || view === 'promotion' || view === 'loan' || view === 'shifts') {
    const activeTab: RequestTab = view === 'requests-all' ? 'all' : view === 'shifts' ? 'shift' : view
    const handleTabChange = (tab: RequestTab) => {
      const nextView: View = tab === 'all' ? 'requests-all' : tab === 'shift' ? 'shifts' : tab
      onView(nextView)
    }
    return <LeaveRequests activeTab={activeTab} onTabChange={handleTabChange} />
  }
  if (view === 'notif-inapp' || view === 'notif-email' || view === 'notif-rules') {
    const activeTab: NotificationTab = view === 'notif-inapp' ? 'inapp' : view === 'notif-email' ? 'email' : 'rules'
    return <Notifications activeTab={activeTab} onTabChange={tab => onView(`notif-${tab}` as View)} />
  }
  if (view === 'settings-org' || view === 'settings-billing') {
    const activeSection: SettingSection = view === 'settings-org' ? 'org' : 'billing'
    return <Settings activeSection={activeSection} onSectionChange={section => onView(`settings-${section}` as View)} />
  }
  return <Overview />
}

// ── Dashboard shell ───────────────────────────────────────────────────────────

export default function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [view, setView] = useState<View>('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const handleView = (v: View) => {
    setView(v)
    setMobileNavOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-offwhite)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          view={view}
          onView={handleView}
        />
      </div>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div style={{ width: '248px', background: 'var(--color-navy)' }} className="h-full">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileNavOpen(false)}
              view={view}
              onView={handleView}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="relative">
          {/* Mobile hamburger */}
          <button
            className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage-dim)" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <TopBar view={view} unread={2} onView={handleView} onNotif={() => handleView('notif-inapp')} onSignOut={onSignOut} />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <ViewContent view={view} onView={handleView} />
        </main>
      </div>
    </div>
  )
}
