import { useEffect, useState } from 'react'
import { Button, Reveal, Textarea } from '../components/cultre-ui'

type Policy = { id: number; text: string }

const initialPolicies: Policy[] = [
  { id: 0, text: 'Employees must treat colleagues, customers, and partners with respect and maintain a workplace free from harassment or discrimination.' },
  { id: 1, text: 'Company and customer information may only be accessed for authorized business purposes and must not be shared with unauthorized parties.' },
  { id: 2, text: 'Employees must follow their assigned work schedules and notify their manager promptly of absences or delays.' },
  { id: 3, text: 'Remote work arrangements require manager approval and employees must remain available during their agreed working hours.' },
]

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies)
  const [isAddingPolicy, setIsAddingPolicy] = useState(false)
  const [policyText, setPolicyText] = useState('')

  const closeAddPolicy = () => {
    setIsAddingPolicy(false)
    setPolicyText('')
  }

  useEffect(() => {
    if (!isAddingPolicy) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAddPolicy()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isAddingPolicy])

  const addPolicy = () => {
    const text = policyText.trim()
    if (!text) return

    setPolicies(current => [
      ...current,
      {
        id: Math.max(-1, ...current.map(policy => policy.id)) + 1,
        text,
      },
    ])
    closeAddPolicy()
  }

  const removePolicy = (id: number) => {
    setPolicies(current => current.filter(policy => policy.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div className="overflow-hidden rounded-[12px] border border-(--color-line-light) bg-(--color-offwhite-raised)">
          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between" style={{ borderBottom: '1px solid var(--color-line-light)' }}>
            <div>
              <h3 className="font-display font-600 text-[16px] text-(--color-ink)">Organization Policies</h3>
              <p className="mt-1 text-[13px] text-(--color-sage-dim)">Policies that apply to everyone in the organization.</p>
            </div>
            <Button type="button" size="sm" onClick={() => setIsAddingPolicy(true)} className="min-w-max shrink-0 cursor-pointer gap-3 bg-(--color-coral) px-6 tracking-normal">
              <svg className="shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 1v10M1 6h10" />
              </svg>
              <span className="whitespace-nowrap" style={{ wordSpacing: '0.2em' }}>Add&nbsp;Policy</span>
            </Button>
          </div>
          <ol>
            {policies.map((policy, index) => (
              <li
                key={policy.id}
                className="flex items-start gap-4 px-6 py-5"
                style={{ borderTop: index > 0 ? '1px solid var(--color-line-light)' : undefined }}
              >
                <span className="mt-0.5 shrink-0 font-mono text-[11px] tracking-widest text-(--color-coral)">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="flex-1 text-[14px] leading-6 text-(--color-ink)">{policy.text}</p>
                <button
                  type="button"
                  onClick={() => removePolicy(policy.id)}
                  className="shrink-0 cursor-pointer font-mono text-[11px] uppercase tracking-widest text-(--color-coral) hover:underline"
                  aria-label={`Remove policy ${index + 1}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {isAddingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeAddPolicy}
            aria-label="Close add policy dialog"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-policy-title"
            className="relative z-10 w-full max-w-[520px] rounded-[12px] border border-(--color-line-light) bg-(--color-offwhite-raised) shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-(--color-line-light) px-6 py-5">
              <div>
                <h2 id="add-policy-title" className="font-display font-700 text-xl text-(--color-ink)">Add policy</h2>
                <p className="mt-1 text-[13px] text-(--color-sage-dim)">Write the policy that should be added for the organization.</p>
              </div>
              <button
                type="button"
                onClick={closeAddPolicy}
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
                addPolicy()
              }}
            >
              <Textarea
                autoFocus
                label="Policy"
                value={policyText}
                onChange={event => setPolicyText(event.target.value)}
                placeholder="Enter the organization policy"
                hint="Use clear language so the policy is easy for employees to understand."
                rows={5}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddPolicy}
                  className="cursor-pointer rounded-[6px] px-5 py-3 font-display font-600 text-[14px] text-(--color-sage-dim) transition-colors hover:text-(--color-ink)"
                >
                  Cancel
                </button>
                <Button type="submit" disabled={!policyText.trim()} className="bg-(--color-coral) hover:bg-(--color-coral) disabled:opacity-100">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
