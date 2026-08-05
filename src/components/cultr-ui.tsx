import {
  type ReactNode,
  type ButtonHTMLAttributes,
  type TextareaHTMLAttributes,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

// ── Button ────────────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'ghost' | 'text'
type BtnSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: BtnSize
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', ...rest }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-display font-600 tracking-tight transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2'

  const sizes: Record<BtnSize, string> = {
    sm: 'px-4 py-2 text-[13px] rounded-[6px]',
    md: 'px-6 py-3 text-[15px] rounded-[6px]',
    lg: 'px-8 py-4 text-[16px] rounded-[6px]',
  }

  const variants: Record<BtnVariant, string> = {
    primary: 'bg-(--color-coral) text-white hover:bg-(--color-coral-deep) active:scale-[0.98]',
    ghost: 'border border-(--color-line-dark) text-(--color-offwhite) hover:border-(--color-coral) hover:text-(--color-coral)',
    text: 'text-(--color-coral) underline-offset-4 hover:underline p-0',
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
      {children}
    </button>
  )
}

// ── Status Chip ───────────────────────────────────────────────────────────────

type ChipVariant = 'success' | 'pending' | 'alert' | 'neutral' | 'info'

export function StatusChip({ variant = 'neutral', children }: { variant?: ChipVariant; children: ReactNode }) {
  const styles: Record<ChipVariant, string> = {
    success: 'bg-(--color-sage)/20 text-[#526650] border border-(--color-sage)/45',
    pending: 'bg-(--color-navy)/5 text-(--color-navy)/70 border border-(--color-navy)/15',
    alert: 'bg-(--color-coral)/15 text-(--color-coral) border border-(--color-coral)/30',
    neutral: 'bg-(--color-navy)/8 text-(--color-navy)/70 border border-(--color-navy)/15',
    info: 'bg-(--color-navy)/10 text-(--color-navy) border border-(--color-line-light)',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] uppercase tracking-widest ${styles[variant]}`}>
      {children}
    </span>
  )
}

export function StatusDot({ variant = 'neutral' }: { variant?: ChipVariant }) {
  const colors: Record<ChipVariant, string> = {
    success: 'bg-(--color-sage)',
    pending: 'bg-(--color-navy)/35',
    alert: 'bg-(--color-coral)',
    neutral: 'bg-(--color-sage-dim)',
    info: 'bg-(--color-navy)',
  }
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[variant]}`} />
}

// ── Toggle ────────────────────────────────────────────────────────────────────

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--color-coral) ${checked ? 'bg-(--color-coral)' : 'bg-(--color-line-dark)'}`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-4' : ''}`}
        />
      </button>
      {label && <span className="text-sm text-(--color-ink)">{label}</span>}
    </label>
  )
}

// ── Slide-Over Panel ──────────────────────────────────────────────────────────

export function SlideOver({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex" aria-modal="true" role="dialog" aria-label={title}>
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-[480px] bg-(--color-offwhite-raised) h-full overflow-y-auto shadow-2xl animate-slide-right">
        <div className="flex items-center justify-between px-8 py-6 border-b border-(--color-line-light)">
          <h2 className="font-display font-700 text-xl text-(--color-ink)">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded text-(--color-sage-dim) hover:text-(--color-ink) transition-colors"
            aria-label="Close panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </div>
        <div className="px-8 py-6">{children}</div>
      </div>
    </div>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className = '', ...rest }: InputProps) {
  const id = rest.id || rest.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 bg-transparent border border-(--color-line-light) rounded-[6px] text-[15px] text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral) transition-colors duration-150 ${error ? 'border-(--color-coral)' : ''} ${className}`}
        {...rest}
      />
      {error && <p className="text-[13px] text-(--color-coral)" role="alert" id={`${id}-error`}>{error}</p>}
      {hint && !error && <p className="text-[13px] text-(--color-sage-dim)">{hint}</p>}
    </div>
  )
}

// -- Form controls -------------------------------------------------------------

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className = '', ...rest }: TextareaProps) {
  const generatedId = useId()
  const id = rest.id || rest.name || generatedId
  const supportId = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">{label}</label>}
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={supportId}
        className={`w-full min-h-24 px-4 py-3 bg-transparent border border-(--color-line-light) rounded-[6px] text-[15px] leading-6 text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral) transition-colors duration-150 resize-y ${error ? 'border-(--color-coral)' : ''} ${className}`}
        {...rest}
      />
      {error && <p id={`${id}-error`} className="text-[13px] text-(--color-coral)" role="alert">{error}</p>}
      {hint && !error && <p id={`${id}-hint`} className="text-[13px] text-(--color-sage-dim)">{hint}</p>}
    </div>
  )
}

export function Checkbox({
  label,
  description,
  error,
  className = '',
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; description?: string; error?: string }) {
  const generatedId = useId()
  const id = rest.id || generatedId
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
        <span className="relative mt-0.5 shrink-0">
          <input id={id} type="checkbox" className="peer sr-only" aria-invalid={Boolean(error)} {...rest} />
          <span className="flex w-4.5 h-4.5 items-center justify-center rounded-[4px] border border-(--color-line-light) bg-transparent transition-colors peer-checked:bg-(--color-coral) peer-checked:border-(--color-coral) peer-focus-visible:outline-2 peer-focus-visible:outline-(--color-coral) peer-focus-visible:outline-offset-2">
            <svg className="opacity-0 peer-checked:opacity-100 text-white" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l2.5 2.5L10 3" /></svg>
          </span>
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] text-(--color-ink)">{label}</span>
          {description && <span className="block mt-0.5 text-[13px] leading-5 text-(--color-sage-dim)">{description}</span>}
        </span>
      </label>
      {error && <p className="mt-1.5 ml-7.5 text-[13px] text-(--color-coral)" role="alert">{error}</p>}
    </div>
  )
}

export interface RadioOption { value: string; label: string; description?: string; disabled?: boolean }

export function RadioGroup({ label, options, value, onChange, name }: {
  label?: string
  options: RadioOption[]
  value?: string
  onChange: (value: string) => void
  name?: string
}) {
  const generatedName = useId()
  return (
    <fieldset className="flex flex-col gap-3">
      {label && <legend className="mb-1 font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">{label}</legend>}
      {options.map(option => (
        <label key={option.value} className={`flex items-start gap-3 ${option.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
          <input
            type="radio"
            name={name || generatedName}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
            className="mt-0.5 w-4 h-4 accent-(--color-coral)"
          />
          <span>
            <span className="block text-[14px] text-(--color-ink)">{option.label}</span>
            {option.description && <span className="block mt-0.5 text-[13px] text-(--color-sage-dim)">{option.description}</span>}
          </span>
        </label>
      ))}
    </fieldset>
  )
}

// -- Chips ---------------------------------------------------------------------

export function Chip({ children, selected = false, onRemove, onClick, disabled = false }: {
  children: ReactNode
  selected?: boolean
  onRemove?: () => void
  onClick?: () => void
  disabled?: boolean
}) {
  const interactive = Boolean(onClick)
  const classes = `inline-flex items-center gap-1.5 min-h-7 px-2.5 rounded-full border text-[12px] font-500 transition-colors ${selected ? 'bg-(--color-navy) text-(--color-offwhite) border-(--color-navy)' : 'bg-(--color-offwhite-raised) text-(--color-ink) border-(--color-line-light)'} ${disabled ? 'opacity-40 cursor-not-allowed' : interactive ? 'cursor-pointer hover:border-(--color-coral)' : ''}`
  const content = <>
    <span>{children}</span>
    {onRemove && (
      <button type="button" onClick={e => { e.stopPropagation(); onRemove() }} className="-mr-1 w-4 h-4 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-black/10" aria-label={`Remove ${typeof children === 'string' ? children : 'item'}`}>
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1.5 1.5l6 6m0-6l-6 6" /></svg>
      </button>
    )}
  </>
  if (interactive) return <button type="button" className={classes} disabled={disabled} aria-pressed={selected} onClick={onClick}>{content}</button>
  return <span className={classes}>{content}</span>
}

// -- Dropdown ------------------------------------------------------------------

export interface DropdownOption { value: string; label: string; description?: string; disabled?: boolean }

export function Dropdown({
  options,
  value,
  onChange,
  multiple = false,
  searchable = false,
  label,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search options...',
  hint,
  error,
  disabled = false,
  className = '',
}: {
  options: DropdownOption[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  searchable?: boolean
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const selected = Array.isArray(value) ? value : value ? [value] : []
  const chosen = options.filter(option => selected.includes(option.value))
  const filtered = options.filter(option => option.label.toLowerCase().includes(query.trim().toLowerCase()))

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  useEffect(() => {
    if (open && searchable) requestAnimationFrame(() => searchRef.current?.focus())
    if (!open) setQuery('')
  }, [open, searchable])

  const select = (option: DropdownOption) => {
    if (option.disabled) return
    if (multiple) {
      const next = selected.includes(option.value) ? selected.filter(item => item !== option.value) : [...selected, option.value]
      onChange(next)
    } else {
      onChange(option.value)
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className={`relative flex flex-col gap-1.5 ${className}`} onKeyDown={e => { if (e.key === 'Escape') setOpen(false) }}>
      {label && <label id={`${id}-label`} className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">{label}</label>}
      <button
        type="button"
        disabled={disabled}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={Boolean(error)}
        onClick={() => setOpen(current => !current)}
        className={`min-h-12 w-full flex items-center gap-2 px-4 py-2.5 text-left bg-transparent border rounded-[6px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${open ? 'border-(--color-coral)' : error ? 'border-(--color-coral)' : 'border-(--color-line-light)'}`}
      >
        <span className="flex-1 min-w-0 flex flex-wrap gap-1.5">
          {chosen.length === 0 && <span className="text-[15px] text-(--color-ink)/30">{placeholder}</span>}
          {multiple ? chosen.map(option => <span key={option.value} className="inline-flex items-center px-2 py-0.5 rounded-full bg-(--color-navy)/6 text-[12px] text-(--color-ink)">{option.label}</span>) : chosen[0] && <span className="text-[15px] text-(--color-ink) truncate">{chosen[0].label}</span>}
        </span>
        <svg className={`shrink-0 text-(--color-sage-dim) transition-transform ${open ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 5l4 4 4-4" /></svg>
      </button>
      {error && <p className="text-[13px] text-(--color-coral)" role="alert">{error}</p>}
      {hint && !error && <p className="text-[13px] text-(--color-sage-dim)">{hint}</p>}

      {open && (
        <div className="absolute z-40 top-full left-0 right-0 mt-1.5 overflow-hidden rounded-[8px] border border-(--color-line-light) bg-(--color-offwhite-raised) shadow-[0_16px_40px_rgba(11,20,38,0.14)] animate-dropdown-in">
          {searchable && (
            <div className="p-2 border-b border-(--color-line-light)">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-sage-dim)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
                <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder={searchPlaceholder} className="w-full pl-9 pr-3 py-2.5 rounded-[5px] bg-(--color-offwhite) border border-transparent text-[13px] text-(--color-ink) placeholder:text-(--color-ink)/30 focus:outline-none focus:border-(--color-coral)" />
              </div>
            </div>
          )}
          <div role="listbox" aria-multiselectable={multiple || undefined} className="max-h-64 overflow-y-auto p-1.5">
            {filtered.length === 0 && <div className="px-3 py-6 text-center text-[13px] text-(--color-sage-dim)">No options found</div>}
            {filtered.map(option => {
              const active = selected.includes(option.value)
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={option.disabled}
                  key={option.value}
                  onClick={() => select(option)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[5px] text-left transition-colors disabled:opacity-35 disabled:cursor-not-allowed ${active ? 'bg-(--color-coral)/8' : 'hover:bg-(--color-offwhite)'}`}
                >
                  {multiple && <span className={`flex items-center justify-center w-4 h-4 rounded-[4px] border ${active ? 'bg-(--color-coral) border-(--color-coral) text-white' : 'border-(--color-line-light)'}`}>{active && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1.5 5l2.2 2.2L8.5 2.5" /></svg>}</span>}
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] text-(--color-ink)">{option.label}</span>
                    {option.description && <span className="block mt-0.5 text-[12px] text-(--color-sage-dim)">{option.description}</span>}
                  </span>
                  {!multiple && active && <svg className="text-(--color-coral)" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 7l3 3 7-7" /></svg>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// -- Banner --------------------------------------------------------------------

type FeedbackVariant = 'info' | 'success' | 'warning' | 'error'

const feedbackStyles: Record<FeedbackVariant, { color: string; bg: string; icon: ReactNode }> = {
  info: { color: 'var(--color-navy)', bg: 'rgba(11,20,38,0.06)', icon: <path d="M12 8h.01M11 12h1v4h1" /> },
  success: { color: '#647762', bg: 'rgba(158,173,156,0.17)', icon: <path d="M7 12l3 3 7-7" /> },
  warning: { color: '#9B682A', bg: 'rgba(196,139,67,0.12)', icon: <><path d="M12 8v5" /><path d="M12 16h.01" /></> },
  error: { color: 'var(--color-coral-deep)', bg: 'rgba(239,120,104,0.12)', icon: <><path d="M8 8l8 8M16 8l-8 8" /></> },
}

export function Banner({ variant = 'info', title, children, action, onDismiss }: {
  variant?: FeedbackVariant
  title: string
  children?: ReactNode
  action?: { label: string; onClick: () => void }
  onDismiss?: () => void
}) {
  const style = feedbackStyles[variant]
  return (
    <div className="flex items-start gap-3 rounded-[8px] px-4 py-3.5 border" style={{ color: style.color, background: style.bg, borderColor: `color-mix(in srgb, ${style.color} 22%, transparent)` }} role={variant === 'error' ? 'alert' : 'status'}>
      <span className="mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center rounded-full border border-current/30">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{style.icon}<circle cx="12" cy="12" r="10" /></svg>
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-display font-600 text-[14px] leading-5">{title}</p>
        {children && <div className="mt-0.5 text-[13px] leading-5 opacity-75">{children}</div>}
      </div>
      {action && <button type="button" onClick={action.onClick} className="shrink-0 font-display font-600 text-[13px] underline underline-offset-4">{action.label}</button>}
      {onDismiss && <button type="button" onClick={onDismiss} className="shrink-0 w-5 h-5 flex items-center justify-center opacity-55 hover:opacity-100" aria-label="Dismiss banner"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1.5 1.5l9 9m0-9l-9 9" /></svg></button>}
    </div>
  )
}

// -- Toasts --------------------------------------------------------------------

interface ToastItem { id: number; title: string; description?: string; variant: FeedbackVariant; duration?: number }
type ToastInput = Omit<ToastItem, 'id'>
const ToastContext = createContext<{ toast: (item: ToastInput) => number; dismiss: (id: number) => void } | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)
  const dismiss = useCallback((id: number) => setToasts(items => items.filter(item => item.id !== id)), [])
  const toast = useCallback((item: ToastInput) => {
    const id = ++idRef.current
    setToasts(items => [...items, { ...item, id }])
    window.setTimeout(() => dismiss(id), item.duration ?? 4500)
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed right-4 md:right-6 bottom-4 md:bottom-6 z-[80] w-[calc(100%-2rem)] max-w-sm flex flex-col gap-2 pointer-events-none" aria-live="polite" aria-relevant="additions">
        {toasts.map(item => {
          const style = feedbackStyles[item.variant]
          return (
            <div key={item.id} className="pointer-events-auto flex items-start gap-3 p-4 rounded-[10px] bg-(--color-navy) text-(--color-offwhite) border border-(--color-line-dark) shadow-[0_18px_45px_rgba(11,20,38,0.28)] animate-toast-in" role={item.variant === 'error' ? 'alert' : 'status'}>
              <span className="mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center rounded-full" style={{ color: style.color, background: style.bg }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{style.icon}</svg>
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-600 text-[14px] leading-5">{item.title}</p>
                {item.description && <p className="mt-0.5 text-[12px] leading-5 text-(--color-offwhite)/60">{item.description}</p>}
              </div>
              <button type="button" onClick={() => dismiss(item.id)} className="w-6 h-6 flex items-center justify-center text-(--color-offwhite)/45 hover:text-(--color-offwhite)" aria-label="Dismiss notification"><svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l9 9m0-9l-9 9" /></svg></button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}

// -- Tooltips ------------------------------------------------------------------

export function Tooltip({ content, children, side = 'top' }: { content: ReactNode; children: ReactNode; side?: 'top' | 'right' | 'bottom' | 'left' }) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  }
  return (
    <span className="relative inline-flex group/tooltip">
      {children}
      <span role="tooltip" className={`pointer-events-none absolute z-50 w-max max-w-56 px-2.5 py-1.5 rounded-[5px] bg-(--color-navy) text-(--color-offwhite) font-body text-[11px] leading-4 shadow-lg opacity-0 invisible scale-95 transition-all duration-150 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:scale-100 ${positions[side]}`}>{content}</span>
    </span>
  )
}

// -- Loaders -------------------------------------------------------------------

export function Loader({ size = 'md', label = 'Loading', variant = 'spinner', className = '' }: {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  variant?: 'spinner' | 'dots' | 'pulse'
  className?: string
}) {
  const dimensions = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-11 h-11' }
  if (variant === 'dots') return (
    <span className={`inline-flex items-center gap-1 ${className}`} role="status" aria-label={label}>
      {[0, 1, 2].map(index => <span key={index} className="w-1.5 h-1.5 rounded-full bg-(--color-coral) animate-loader-dot" style={{ animationDelay: `${index * 130}ms` }} />)}
    </span>
  )
  if (variant === 'pulse') return <span className={`inline-block rounded-full bg-(--color-coral)/18 relative ${dimensions[size]} ${className}`} role="status" aria-label={label}><span className="absolute inset-[22%] rounded-full bg-(--color-coral) animate-loader-pulse" /></span>
  return <span className={`inline-block rounded-full border-2 border-(--color-line-light) border-t-(--color-coral) animate-spin ${dimensions[size]} ${className}`} role="status" aria-label={label} />
}

// ── Divider ───────────────────────────────────────────────────────────────────

export function Divider({ label }: { label?: string }) {
  if (!label) return <hr className="border-(--color-line-light)" />
  return (
    <div className="flex items-center gap-4">
      <hr className="flex-1 border-(--color-line-light)" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">{label}</span>
      <hr className="flex-1 border-(--color-line-light)" />
    </div>
  )
}

// ── Metric Card ───────────────────────────────────────────────────────────────

export function MetricCard({
  label,
  value,
  delta,
  deltaUp,
  sub,
}: {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  sub?: string
}) {
  return (
    <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6 flex flex-col gap-3">
      <span className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">{label}</span>
      <div className="flex items-end gap-3">
        <span className="font-display font-700 text-[32px] leading-none text-(--color-ink)">{value}</span>
        {delta && (
          <span className={`font-mono text-[12px] mb-1 ${deltaUp ? 'text-(--color-sage)' : 'text-(--color-coral)'}`}>
            {deltaUp ? '▲' : '▼'} {delta}
          </span>
        )}
      </div>
      {sub && <span className="text-[13px] text-(--color-sage-dim)">{sub}</span>}
    </div>
  )
}

// ── Section Reveal Hook ───────────────────────────────────────────────────────

export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return ref
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(12px)',
        transition: `opacity 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
      className={className}
    >
      {children}
    </div>
  )
}
