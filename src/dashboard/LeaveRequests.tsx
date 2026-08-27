import { useState } from 'react'
import { Button, Dropdown, Input, SlideOver, Reveal, StatusChip, Textarea, useToast } from '../components/cultre-ui'
import { UserProfileBubble } from '../components/UserProfileBubble'

export type RequestTab = 'all' | 'leave' | 'wfh' | 'promotion' | 'loan' | 'shift'
type TabType = RequestTab
type ReviewerStatus = 'approved' | 'in_review' | 'waiting' | 'declined'

type Reviewer = {
  name: string
  role: string
  status: ReviewerStatus
}

const allRequests = [
  {
    id: 0,
    name: 'M. Chen',
    type: 'leave' as TabType,
    label: 'Annual leave · 3 days',
    date: 'Aug 12–14',
    status: 'pending',
    reviewers: [
      { name: 'Marcus Chen', role: 'Design manager', status: 'approved' },
      { name: 'Alexandra Rossi', role: 'People administrator', status: 'in_review' },
      { name: 'Jordan Okoro', role: 'Operations lead', status: 'waiting' },
    ] as Reviewer[],
    swap: null,
  },
  {
    id: 1,
    name: 'T. Park',
    type: 'wfh' as TabType,
    label: 'Work from home · Fri',
    date: 'Aug 9',
    status: 'approved',
    reviewers: [
      { name: 'Marcus Chen', role: 'Design manager', status: 'approved' },
      { name: 'Alexandra Rossi', role: 'People administrator', status: 'approved' },
    ] as Reviewer[],
    swap: null,
  },
  {
    id: 2,
    name: 'A. Rossi',
    type: 'promotion' as TabType,
    label: 'Promotion · L4 → L5',
    date: 'Aug 2',
    status: 'pending',
    reviewers: [
      { name: 'Marcus Chen', role: 'Department manager', status: 'approved' },
      { name: 'Jordan Okoro', role: 'Operations lead', status: 'in_review' },
      { name: 'Leena Singh', role: 'Finance manager', status: 'waiting' },
    ] as Reviewer[],
    swap: null,
  },
  {
    id: 3,
    name: 'L. Singh',
    type: 'loan' as TabType,
    label: 'Salary advance · $2,000',
    date: 'Jul 30',
    status: 'in_review',
    reviewers: [
      { name: 'Marcus Chen', role: 'Department manager', status: 'approved' },
      { name: 'Leena Singh', role: 'Finance manager', status: 'in_review' },
      { name: 'Jordan Okoro', role: 'Operations lead', status: 'waiting' },
    ] as Reviewer[],
    swap: null,
  },
  {
    id: 4,
    name: 'J. Okoro',
    type: 'leave' as TabType,
    label: 'Sick leave · 1 day',
    date: 'Aug 7',
    status: 'approved',
    reviewers: [
      { name: 'Marcus Chen', role: 'Department manager', status: 'approved' },
      { name: 'Alexandra Rossi', role: 'People administrator', status: 'approved' },
    ] as Reviewer[],
    swap: null,
  },
  {
    id: 5,
    name: 'R. Torres',
    type: 'shift' as TabType,
    label: 'Shift swap · Mon → Wed',
    date: 'Aug 5',
    status: 'pending',
    reviewers: [
      { name: 'T. Park', role: 'Swap partner', status: 'approved' },
      { name: 'Jordan Okoro', role: 'Operations lead', status: 'in_review' },
      { name: 'Alexandra Rossi', role: 'People administrator', status: 'waiting' },
    ] as Reviewer[],
    swap: { from: 'Mon Aug 5, 09–18', to: 'Wed Aug 7, 09–18', with: 'T. Park' },
  },
]

type RequestItem = (typeof allRequests)[number]

const requestTypeMeta: Record<RequestTab, { label: string; color: string; background: string; icon: string }> = {
  all: { label: 'Request', color: 'var(--color-sage-dim)', background: 'rgba(124,138,121,0.12)', icon: 'M5 3h6v10H5zM7 6h2M7 9h2' },
  leave: { label: 'Leave', color: '#8B6CB0', background: 'rgba(139,108,176,0.12)', icon: 'M4 2.5v2M12 2.5v2M3 6.5h10M4 4h8a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z' },
  wfh: { label: 'Work from home', color: '#4F7FA3', background: 'rgba(79,127,163,0.12)', icon: 'M2.5 7.5L8 3l5.5 4.5M4 6.5V13h8V6.5M6.5 13V9h3v4' },
  promotion: { label: 'Promotion', color: 'var(--color-coral-deep)', background: 'rgba(239,120,104,0.12)', icon: 'M3 12l3.5-4 2.5 2 4-6M10 4h3v3' },
  loan: { label: 'Salary advance', color: '#9B7A35', background: 'rgba(155,122,53,0.12)', icon: 'M3 5h10v7H3zM5.5 8.5h5M8 7v3' },
  shift: { label: 'Shift swap', color: '#4F8779', background: 'rgba(79,135,121,0.12)', icon: 'M3 5h8l-2-2M13 11H5l2 2' },
}

function requestStatusMeta(status: string) {
  if (status === 'approved') return { label: 'Approved', color: 'var(--color-sage-dim)' }
  if (status === 'declined') return { label: 'Declined', color: 'var(--color-coral-deep)' }
  if (status === 'in_review') return { label: 'In review', color: '#9B7A35' }
  return { label: 'Needs review', color: 'var(--color-coral)' }
}

const reviewerStatusMeta: Record<ReviewerStatus, { label: string; variant: 'success' | 'pending' | 'alert' | 'neutral' }> = {
  approved: { label: 'Approved', variant: 'success' },
  in_review: { label: 'In review', variant: 'pending' },
  waiting: { label: 'Waiting', variant: 'neutral' },
  declined: { label: 'Declined', variant: 'alert' },
}

function initials(name: string) {
  return name.split(' ').map(part => part[0]).join('').slice(0, 2)
}

function reviewersForStatus(reviewers: Reviewer[], requestStatus: string) {
  if (requestStatus === 'approved') return reviewers.map(reviewer => ({ ...reviewer, status: 'approved' as const }))
  if (requestStatus !== 'declined') return reviewers

  let declinedAssigned = false
  return reviewers.map(reviewer => {
    if (!declinedAssigned && reviewer.status === 'in_review') {
      declinedAssigned = true
      return { ...reviewer, status: 'declined' as const }
    }
    return reviewer
  })
}

function ReviewProgress({ reviewers, requestStatus, compact = false }: { reviewers: Reviewer[]; requestStatus: string; compact?: boolean }) {
  const visibleReviewers = reviewersForStatus(reviewers, requestStatus)
  const approved = visibleReviewers.filter(reviewer => reviewer.status === 'approved').length

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 border-t border-(--color-line-light) py-3">
        <div className="flex -space-x-1.5">
          {visibleReviewers.map((reviewer, index) => (
            <UserProfileBubble
              key={reviewer.name}
              profile={{ name: reviewer.name, role: reviewer.role }}
              className="h-6 w-6 border-2 border-(--color-offwhite-raised) bg-(--color-navy) font-mono text-[7px] text-(--color-sage)"
              style={{ zIndex: visibleReviewers.length - index }}
              status={`Review status: ${reviewerStatusMeta[reviewer.status].label}`}
            >
              {initials(reviewer.name)}
            </UserProfileBubble>
          ))}
        </div>
        <span className="text-[10px] font-500 text-(--color-sage-dim)">
          {approved} of {visibleReviewers.length} approved
        </span>
      </div>
    )
  }

  return (
    <section aria-labelledby="review-progress-title">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h3 id="review-progress-title" className="font-display text-[14px] font-700 text-(--color-ink)">Review progress</h3>
          <p className="mt-1 text-[11px] text-(--color-sage-dim)">Reviewers are shown in approval order.</p>
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-(--color-sage-dim)">
          {approved}/{visibleReviewers.length} approved
        </span>
      </div>
      <ol className="overflow-hidden rounded-[10px] border border-(--color-line-light) bg-(--color-offwhite-raised)">
        {visibleReviewers.map((reviewer, index) => {
          const meta = reviewerStatusMeta[reviewer.status]
          return (
            <li key={reviewer.name} className="relative flex items-center gap-3 px-4 py-3.5 not-first:border-t not-first:border-(--color-line-light)">
              <UserProfileBubble
                profile={{ name: reviewer.name, role: reviewer.role }}
                className="h-8 w-8 bg-(--color-navy) font-mono text-[9px] text-(--color-sage)"
                status={`Review status: ${meta.label}`}
              >
                {initials(reviewer.name)}
              </UserProfileBubble>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-600 text-(--color-ink)">{reviewer.name}</p>
                <p className="mt-0.5 truncate text-[10px] text-(--color-sage-dim)">Stage {index + 1} · {reviewer.role}</p>
              </div>
              <StatusChip variant={meta.variant}>{meta.label}</StatusChip>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function AllRequestCard({ request, status, onOpen }: { request: RequestItem; status: string; onOpen: () => void }) {
  const type = requestTypeMeta[request.type]
  const statusMeta = requestStatusMeta(status)

  return (
    <article className="group rounded-[12px] border border-(--color-line-light) bg-(--color-offwhite-raised) p-4 shadow-[0_5px_16px_rgba(11,20,38,0.035)] transition-all duration-150 hover:-translate-y-0.5 hover:border-(--color-navy)/20 hover:shadow-[0_10px_24px_rgba(11,20,38,0.07)]">
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]"
          style={{ color: type.color, background: type.background }}
          aria-hidden="true"
        >
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d={type.icon} />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[14px] font-600 text-(--color-ink)">{request.label}</p>
          <p className="mt-0.5 text-[11px] text-(--color-sage-dim)">{type.label}</p>
        </div>
        <span className="shrink-0 pt-0.5 font-mono text-[10px] text-(--color-sage-dim)">{request.date}</span>
      </div>

      <div className="my-3.5 flex items-center gap-2.5 rounded-[8px] bg-(--color-offwhite) px-3 py-2.5">
        <UserProfileBubble
          profile={{ name: request.name }}
          className="h-7 w-7 bg-(--color-navy) font-mono text-[9px] text-(--color-sage)"
          status="Requester profile"
        >
          {request.name.split(' ').map(part => part[0]).join('')}
        </UserProfileBubble>
        <div className="min-w-0">
          <p className="text-[12px] font-500 text-(--color-ink)">{request.name}</p>
          <p className="font-mono text-[9px] uppercase tracking-wider text-(--color-sage-dim)">Requester</p>
        </div>
      </div>

      <ReviewProgress reviewers={request.reviewers} requestStatus={status} compact />

      <div className="flex items-center justify-between pt-3">
        <span className="flex items-center gap-2 text-[11px] font-500 text-(--color-sage-dim)">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusMeta.color }} aria-hidden="true" />
          {statusMeta.label}
        </span>
        <button
          type="button"
          onClick={onOpen}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-(--color-line-light) bg-(--color-offwhite-raised) px-3 py-1.5 text-[11px] font-600 text-(--color-ink) transition-colors hover:border-(--color-coral)/45 hover:text-(--color-coral)"
        >
          {status === 'pending' ? 'Review' : 'Open'}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 6h7M7 3.5L9.5 6 7 8.5" />
          </svg>
        </button>
      </div>
    </article>
  )
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'leave', label: 'Leave' },
  { id: 'wfh', label: 'WFH' },
  { id: 'promotion', label: 'Promotion' },
  { id: 'loan', label: 'Loan' },
  { id: 'shift', label: 'Shift Swaps' },
]

export default function LeaveRequests({ activeTab, availableTabs = tabs.map(tab => tab.id), onTabChange }: { activeTab?: RequestTab; availableTabs?: RequestTab[]; onTabChange?: (tab: RequestTab) => void }) {
  const { toast } = useToast()
  const [internalTab, setInternalTab] = useState<RequestTab>('all')
  const tab = activeTab ?? internalTab
  const [statuses, setStatuses] = useState<Record<number, string>>(
    Object.fromEntries(allRequests.map(r => [r.id, r.status]))
  )
  const [newOpen, setNewOpen] = useState(false)
  const [newType, setNewType] = useState('leave')
  const [reviewers, setReviewers] = useState<string[]>([])
  const [requestOpen, setRequestOpen] = useState<number | null>(null)
  const [swapOpen, setSwapOpen] = useState<number | null>(null)

  const filtered = tab === 'all' ? allRequests : allRequests.filter(r => r.type === tab)

  const approve = (id: number) => setStatuses(s => ({ ...s, [id]: 'approved' }))
  const decline = (id: number) => setStatuses(s => ({ ...s, [id]: 'declined' }))
  const submitRequest = () => {
    setNewOpen(false)
    toast({ variant: 'success', title: 'Request submitted', description: 'The selected reviewers have been notified.' })
  }
  const selectTab = (next: RequestTab) => {
    setInternalTab(next)
    onTabChange?.(next)
  }
  const openRequest = (request: RequestItem) => {
    if (request.swap) setSwapOpen(request.id)
    else setRequestOpen(request.id)
  }

  const selectedRequest = requestOpen === null ? null : allRequests.find(request => request.id === requestOpen)

  return (
    <div className="relative flex flex-col gap-4.5">
      {/* Tab strip */}
      <div className="flex gap-1 overflow-x-auto pb-1" style={{ borderBottom: '1px solid var(--color-line-light)' }}>
        {tabs.filter(({ id }) => availableTabs.includes(id)).map(({ id, label }) => (
          <button key={id} onClick={() => selectTab(id)}
            className="px-4 py-2.5 font-display font-500 text-[14px] whitespace-nowrap transition-colors relative shrink-0 cursor-pointer rounded-t-[5px] hover:bg-(--color-navy)/5"
            style={{ color: tab === id ? 'var(--color-ink)' : 'var(--color-sage-dim)' }}>
            {label}
            {tab === id && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: 'var(--color-coral)' }} />}
          </button>
        ))}
      </div>

      {/* Request cards */}
      <Reveal>
        <div>
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-[17px] font-700 text-(--color-ink)">
                {tab === 'all' ? 'All requests' : `${requestTypeMeta[tab].label} requests`}
              </h2>
              <p className="mt-1 text-[12px] text-(--color-sage-dim)">
                {filtered.length} {filtered.length === 1 ? 'request' : 'requests'} · {filtered.filter(request => statuses[request.id] === 'pending').length} need review
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-[6px] px-5 py-2.5 font-display text-[14px] font-600 transition-colors"
              style={{ background: 'var(--color-coral)', color: 'white' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 1v12M1 7h12" />
              </svg>
              New Request
            </button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {filtered.map(request => (
              <AllRequestCard
                key={request.id}
                request={request}
                status={statuses[request.id]}
                onOpen={() => openRequest(request)}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* New request slide-over */}
      <SlideOver open={newOpen} onClose={() => setNewOpen(false)} title="New Request">
        <div className="flex flex-col gap-5">
          <Dropdown
            label="Request type"
            value={newType}
            onChange={value => setNewType(value as string)}
            options={['leave', 'wfh', 'promotion', 'loan', 'shift'].map(type => ({
              value: type,
              label: type === 'wfh' ? 'Work from home' : type.charAt(0).toUpperCase() + type.slice(1),
            }))}
          />
          <Input type="date" label="Date(s)" />
          <Dropdown
            label="Reviewers"
            multiple
            searchable
            value={reviewers}
            onChange={value => setReviewers(value as string[])}
            placeholder="Add reviewers"
            hint="Choose one or more people to review this request."
            options={[
              { value: 'alexandra', label: 'Alexandra Rossi', description: 'People administrator' },
              { value: 'marcus', label: 'Marcus Chen', description: 'Design manager' },
              { value: 'jordan', label: 'Jordan Okoro', description: 'Operations lead' },
              { value: 'leena', label: 'Leena Singh', description: 'Finance manager' },
            ]}
          />
          <Textarea label="Notes" rows={3} placeholder="Add context..." />
          <Button onClick={submitRequest} className="w-full">Submit request</Button>
        </div>
      </SlideOver>

      {/* Request detail slide-over */}
      {selectedRequest && (
        <SlideOver open={true} onClose={() => setRequestOpen(null)} title="Request Details">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-3.5">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px]"
                style={{
                  color: requestTypeMeta[selectedRequest.type].color,
                  background: requestTypeMeta[selectedRequest.type].background,
                }}
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d={requestTypeMeta[selectedRequest.type].icon} />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[17px] font-700 text-(--color-ink)">{selectedRequest.label}</h3>
                <p className="mt-1 text-[12px] text-(--color-sage-dim)">{requestTypeMeta[selectedRequest.type].label}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[10px] border border-(--color-line-light) bg-(--color-offwhite-raised)">
              {[
                ['Requester', selectedRequest.name],
                ['Date', selectedRequest.date],
              ].map(([label, value], index) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-3.5" style={{ borderTop: index ? '1px solid var(--color-line-light)' : undefined }}>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">{label}</span>
                  <span className="text-right text-[13px] font-500 text-(--color-ink)">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 border-t border-(--color-line-light) px-4 py-3.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">Status</span>
                <span className="flex items-center gap-2 text-[13px] font-500 text-(--color-ink)">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: requestStatusMeta(statuses[selectedRequest.id]).color }} aria-hidden="true" />
                  {requestStatusMeta(statuses[selectedRequest.id]).label}
                </span>
              </div>
            </div>

            <ReviewProgress reviewers={selectedRequest.reviewers} requestStatus={statuses[selectedRequest.id]} />

            {statuses[selectedRequest.id] === 'pending' && (
              <div className="flex gap-3 border-t border-(--color-line-light) pt-5">
                <button
                  type="button"
                  onClick={() => { approve(selectedRequest.id); setRequestOpen(null) }}
                  className="flex-1 cursor-pointer rounded-[6px] bg-(--color-sage) py-3 font-display text-[14px] font-600 text-(--color-navy) transition-opacity hover:opacity-90"
                >
                  Approve request
                </button>
                <button
                  type="button"
                  onClick={() => { decline(selectedRequest.id); setRequestOpen(null) }}
                  className="flex-1 cursor-pointer rounded-[6px] border border-(--color-line-light) py-3 font-display text-[14px] font-600 text-(--color-sage-dim) transition-colors hover:border-(--color-coral)/45 hover:text-(--color-coral)"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        </SlideOver>
      )}

      {/* Shift swap slide-over */}
      {swapOpen !== null && (
        <SlideOver open={true} onClose={() => setSwapOpen(null)} title="Shift Swap Proposal">
          <div className="flex flex-col gap-6">
            <p className="text-[14px] text-(--color-sage-dim)">
              <strong className="text-(--color-ink)">R. Torres</strong> is proposing a shift swap with <strong className="text-(--color-ink)">T. Park</strong>.
            </p>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <div className="p-4 rounded-[8px] text-center" style={{ border: '1px solid var(--color-line-light)', background: 'var(--color-offwhite)' }}>
                <span className="font-mono text-[10px] text-(--color-sage-dim) uppercase block mb-2">Their shift</span>
                <span className="font-mono text-[12px] text-(--color-ink)">Mon Aug 5<br />09:00–18:00</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-coral)" strokeWidth="1.5" aria-hidden="true">
                  <path d="M7 16l-4-4 4-4" /><path d="M17 8l4 4-4 4" /><path d="M3 12h18" />
                </svg>
              </div>
              <div className="p-4 rounded-[8px] text-center" style={{ border: '1px solid var(--color-line-light)', background: 'var(--color-offwhite)' }}>
                <span className="font-mono text-[10px] text-(--color-sage-dim) uppercase block mb-2">T. Park's shift</span>
                <span className="font-mono text-[12px] text-(--color-ink)">Wed Aug 7<br />09:00–18:00</span>
              </div>
            </div>
            <ReviewProgress reviewers={allRequests[5].reviewers} requestStatus={statuses[5]} />
            <div className="flex gap-3 pt-2">
              <button onClick={() => { approve(5); setSwapOpen(null) }}
                className="flex-1 py-3 rounded-[6px] font-display font-600 text-[14px]"
                style={{ background: 'var(--color-sage)', color: 'var(--color-navy)' }}>
                Approve swap
              </button>
              <button onClick={() => { decline(5); setSwapOpen(null) }}
                className="flex-1 py-3 rounded-[6px] font-display font-600 text-[14px] border"
                style={{ border: '1px solid var(--color-line-light)', color: 'var(--color-sage-dim)' }}>
                Decline
              </button>
            </div>
          </div>
        </SlideOver>
      )}
    </div>
  )
}
