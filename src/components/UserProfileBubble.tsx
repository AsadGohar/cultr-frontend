import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import indiaFlag from 'flag-icons/flags/1x1/in.svg'
import italyFlag from 'flag-icons/flags/1x1/it.svg'
import nigeriaFlag from 'flag-icons/flags/1x1/ng.svg'
import singaporeFlag from 'flag-icons/flags/1x1/sg.svg'
import southKoreaFlag from 'flag-icons/flags/1x1/kr.svg'
import spainFlag from 'flag-icons/flags/1x1/es.svg'

export type UserProfile = {
  name: string
  initials?: string
  role?: string
  team?: string
  location?: string
  countryFlag?: string
  startDate?: string
}

type DirectoryProfile = Required<UserProfile> & { aliases: string[] }

const peopleDirectory: DirectoryProfile[] = [
  {
    name: 'Alexandra Rossi',
    initials: 'AR',
    role: 'Senior Software Engineer',
    team: 'Engineering',
    location: 'Italy',
    countryFlag: italyFlag,
    startDate: 'July 13, 2025',
    aliases: ['A. Rossi'],
  },
  {
    name: 'Marcus Chen',
    initials: 'MC',
    role: 'Product Designer',
    team: 'Design',
    location: 'Singapore',
    countryFlag: singaporeFlag,
    startDate: 'February 3, 2024',
    aliases: ['M. Chen', 'Mei Chen'],
  },
  {
    name: 'Jasmine Okoro',
    initials: 'JO',
    role: 'Operations Lead',
    team: 'Operations',
    location: 'Nigeria',
    countryFlag: nigeriaFlag,
    startDate: 'November 18, 2023',
    aliases: ['J. Okoro', 'Jide Okoro', 'Jordan Okoro'],
  },
  {
    name: 'Lena Singh',
    initials: 'LS',
    role: 'Finance Analyst',
    team: 'Finance',
    location: 'India',
    countryFlag: indiaFlag,
    startDate: 'April 8, 2024',
    aliases: ['L. Singh', 'Leena Singh'],
  },
  {
    name: 'Taehyun Park',
    initials: 'TP',
    role: 'Frontend Engineer',
    team: 'Engineering',
    location: 'South Korea',
    countryFlag: southKoreaFlag,
    startDate: 'January 20, 2025',
    aliases: ['T. Park'],
  },
  {
    name: 'Rosa Torres',
    initials: 'RT',
    role: 'People Specialist',
    team: 'People',
    location: 'Spain',
    countryFlag: spainFlag,
    startDate: 'March 11, 2024',
    aliases: ['R. Torres'],
  },
]

function makeInitials(name: string) {
  return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
}

export function resolveUserProfile(profile: UserProfile): UserProfile {
  const normalizedName = profile.name.trim().toLowerCase()
  const directoryProfile = peopleDirectory.find(person =>
    [person.name, ...person.aliases].some(alias => alias.toLowerCase() === normalizedName)
  )

  return {
    ...directoryProfile,
    ...profile,
    name: directoryProfile?.name ?? profile.name,
    initials: profile.initials ?? directoryProfile?.initials ?? makeInitials(profile.name),
  }
}

function ProfileCard({
  profile,
  status,
  footer,
  cardRef,
  onPointerEnter,
  onPointerLeave,
  position,
  id,
}: {
  profile: UserProfile
  status?: ReactNode
  footer?: ReactNode
  cardRef: React.RefObject<HTMLDivElement | null>
  onPointerEnter: () => void
  onPointerLeave: () => void
  position: { left: number; top: number }
  id: string
}) {
  return createPortal(
    <div
      ref={cardRef}
      id={id}
      role="dialog"
      aria-label={`${profile.name} profile`}
      className="fixed z-[80] w-[min(320px,calc(100vw-24px))] cursor-default overflow-hidden rounded-[14px] border border-(--color-line-light) bg-(--color-offwhite-raised) text-left shadow-[0_20px_50px_rgba(11,20,38,0.2)] animate-dropdown-in"
      style={{ left: position.left, top: position.top }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={event => event.stopPropagation()}
    >
      <div className="flex items-center gap-3.5 p-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-700 text-white shadow-sm"
          style={{ background: 'linear-gradient(145deg, var(--color-coral), var(--color-coral-deep))' }}
          aria-hidden="true"
        >
          {profile.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[16px] font-700 text-(--color-ink)">{profile.name}</p>
          <p className="mt-0.5 truncate text-[12px] text-(--color-sage-dim)">{profile.role ?? 'Team member'}</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-sage)/20 text-(--color-sage-dim)" aria-label="Employee profile">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0116 0" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-(--color-line-light) px-4 py-3.5">
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-wider text-(--color-sage-dim)">Location</p>
          <div className="mt-1 flex items-center gap-1.5">
            {profile.countryFlag && <img src={profile.countryFlag} alt="" className="h-[18px] w-[18px] shrink-0 rounded-full object-cover shadow-[0_0_0_1px_rgba(11,20,38,0.12)]" />}
            <p className="truncate text-[11px] font-600 leading-4 text-(--color-ink)">{profile.location ?? 'Not set'}</p>
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-wider text-(--color-sage-dim)">Team</p>
          <p className="mt-1 truncate text-[11px] font-600 leading-4 text-(--color-ink)">{profile.team ?? 'Not set'}</p>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-wider text-(--color-sage-dim)">Start date</p>
          <p className="mt-1 text-[11px] font-600 leading-4 text-(--color-ink)">{profile.startDate ?? 'Not set'}</p>
        </div>
      </div>

      {status && (
        <div className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-[8px] bg-(--color-sage)/20 px-3 py-2.5 text-[12px] font-600 text-[#526650]">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8.5l3 3 7-7" />
          </svg>
          {status}
        </div>
      )}
      {footer && <div className="border-t border-(--color-line-light) p-2">{footer}</div>}
    </div>,
    document.body
  )
}

export function UserProfileBubble({
  profile,
  children,
  className = '',
  style,
  status = 'Active employee',
  footer,
  indicator,
  ariaLabel,
}: {
  profile: UserProfile
  children?: ReactNode
  className?: string
  style?: CSSProperties
  status?: ReactNode | null
  footer?: ReactNode
  indicator?: ReactNode
  ariaLabel?: string
}) {
  const resolvedProfile = resolveUserProfile(profile)
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [position, setPosition] = useState({ left: 12, top: 12 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cardId = useRef(`user-profile-${Math.random().toString(36).slice(2)}`).current
  const open = hovered || pinned

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = setTimeout(() => setHovered(false), 120)
  }, [cancelClose])

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const cardWidth = Math.min(320, window.innerWidth - 24)
    const estimatedHeight = footer ? 250 : status ? 220 : 175
    const left = Math.min(Math.max(12, rect.left + rect.width / 2 - cardWidth / 2), window.innerWidth - cardWidth - 12)
    const top = window.innerHeight - rect.bottom >= estimatedHeight + 12
      ? rect.bottom + 8
      : Math.max(12, rect.top - estimatedHeight - 8)
    setPosition({ left, top })
  }, [footer, status])

  useLayoutEffect(() => {
    if (open) updatePosition()
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    const reposition = () => updatePosition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!pinned) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node
      if (!triggerRef.current?.contains(target) && !cardRef.current?.contains(target)) setPinned(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPinned(false)
        setHovered(false)
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [pinned])

  useEffect(() => () => cancelClose(), [cancelClose])

  const togglePinned = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setPinned(value => !value)
  }

  return (
    <span className="relative inline-flex shrink-0 align-middle">
      <button
        ref={triggerRef}
        type="button"
        className={`flex cursor-pointer items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-(--color-coral) focus-visible:outline-offset-2 ${className}`}
        style={style}
        onPointerEnter={() => { cancelClose(); setHovered(true) }}
        onPointerLeave={scheduleClose}
        onClick={togglePinned}
        aria-label={ariaLabel ?? `Show ${resolvedProfile.name} profile`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? cardId : undefined}
      >
        {children ?? resolvedProfile.initials}
      </button>
      {indicator}
      {open && (
        <ProfileCard
          profile={resolvedProfile}
          status={status ?? undefined}
          footer={footer}
          cardRef={cardRef}
          onPointerEnter={() => { cancelClose(); setHovered(true) }}
          onPointerLeave={scheduleClose}
          position={position}
          id={cardId}
        />
      )}
    </span>
  )
}
