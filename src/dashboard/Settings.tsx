import { useState } from 'react'
import { Banner, Button, Dropdown, Input, Reveal, Toggle, useToast } from '../components/cultre-ui'

export type SettingSection = 'org' | 'billing'

function OrgSettings() {
  const { toast } = useToast()
  const [form, setForm] = useState({
    name: 'Acme Inc.',
    domain: 'acme.com',
    timezone: 'Europe/London',
    language: 'en',
    primaryColor: '#EF7868',
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = () => toast({
    variant: 'success',
    title: 'Organization settings saved',
    description: 'Your changes are now visible across Cultre.',
  })

  return (
    <div className="flex flex-col gap-6">
      <Reveal className="relative z-20">
        <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
          <h3 className="font-display font-600 text-[16px] text-(--color-ink) mb-6">Organization profile</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Organization name" value={form.name} onChange={set('name')} />
            <Input label="Primary domain" value={form.domain} onChange={set('domain')} />
            <Dropdown
              label="Timezone"
              searchable
              value={form.timezone}
              onChange={value => setForm(current => ({ ...current, timezone: value as string }))}
              options={[
                { value: 'Europe/London', label: 'Europe/London (UTC+1)' },
                { value: 'America/New_York', label: 'America/New York (UTC-4)' },
                { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' },
                { value: 'Australia/Sydney', label: 'Australia/Sydney (UTC+10)' },
              ]}
            />
            <Dropdown
              label="Language"
              value={form.language}
              onChange={value => setForm(current => ({ ...current, language: value as string }))}
              options={[
                { value: 'en', label: 'English' },
                { value: 'fr', label: 'Français' },
                { value: 'de', label: 'Deutsch' },
                { value: 'ja', label: '日本語' },
              ]}
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={40}>
        <Banner variant="info" title="Domain verification is active">
          Anyone joining with an @acme.com address can be matched to this organization automatically.
        </Banner>
      </Reveal>

      <Reveal delay={60}>
        <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
          <h3 className="font-display font-600 text-[16px] text-(--color-ink) mb-2">Branding</h3>
          <p className="text-[13px] text-(--color-sage-dim) mb-5">Customize how Cultre looks for your team.</p>
          <div className="flex items-center gap-4">
            <label className="font-mono text-[11px] uppercase tracking-widest text-(--color-sage-dim)">Accent color</label>
            <input type="color" value={form.primaryColor} onChange={set('primaryColor')}
              className="w-10 h-10 rounded-[4px] border-none cursor-pointer"
              aria-label="Accent color" />
            <span className="font-mono text-[13px] text-(--color-ink)">{form.primaryColor}</span>
          </div>
        </div>
      </Reveal>

      <div className="flex items-center gap-4">
        <Button variant="primary" onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </div>
  )
}

function BillingSettings() {
  const [annual, setAnnual] = useState(true)

  const plans = [
    { name: 'Starter', price: annual ? 29 : 39, features: ['Up to 25 members', 'Core HR modules', 'Email support'] },
    { name: 'Growth', price: annual ? 79 : 99, features: ['Up to 100 members', 'All modules', 'Priority support', 'Custom approval chains'], recommended: true },
    { name: 'Enterprise', price: null, features: ['Unlimited members', 'Custom integrations', 'Dedicated CSM', 'SLA guarantee'] },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display font-600 text-[16px] text-(--color-ink)">Current plan</h3>
              <p className="text-[13px] text-(--color-sage-dim) mt-1">Growth · Billed annually · Renews Aug 1, 2027</p>
            </div>
            <Toggle checked={annual} onChange={setAnnual} label={annual ? 'Annual (save 20%)' : 'Monthly'} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div key={plan.name}
                className="rounded-[12px] p-5 flex flex-col gap-4 relative"
                style={{
                  border: `1px solid ${plan.recommended ? 'var(--color-coral)' : 'var(--color-line-light)'}`,
                  background: plan.recommended ? 'rgba(239,120,104,0.04)' : 'var(--color-offwhite)',
                }}>
                {plan.recommended && (
                  <span className="absolute -top-3 left-4 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--color-coral)', color: 'white' }}>
                    Current
                  </span>
                )}
                <div>
                  <h4 className="font-display font-700 text-[18px] text-(--color-ink)">{plan.name}</h4>
                  {plan.price
                    ? <p className="font-display font-700 text-[28px] text-(--color-ink) mt-1">${plan.price}<span className="text-[14px] font-400 text-(--color-sage-dim)">/mo</span></p>
                    : <p className="font-display font-500 text-[16px] text-(--color-sage-dim) mt-1">Custom pricing</p>}
                </div>
                <ul className="flex flex-col gap-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-(--color-sage-dim)">
                      <span className="w-1.5 h-1.5 rounded-full bg-(--color-sage) shrink-0" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-2.5 rounded-[6px] font-display font-600 text-[14px] mt-auto transition-colors"
                  style={{
                    background: plan.recommended ? 'var(--color-coral)' : 'transparent',
                    color: plan.recommended ? 'white' : 'var(--color-coral)',
                    border: plan.recommended ? 'none' : '1px solid var(--color-coral)',
                  }}
                >
                  {plan.recommended ? 'Current plan' : plan.price ? 'Switch plan' : 'Contact sales'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] p-6">
          <h3 className="font-display font-600 text-[16px] text-(--color-ink) mb-4">Payment method</h3>
          <div className="flex items-center gap-4 p-4 rounded-[8px]" style={{ border: '1px solid var(--color-line-light)', background: 'var(--color-offwhite)' }}>
            <div className="w-10 h-7 rounded-[4px] flex items-center justify-center font-mono text-[10px] text-white"
              style={{ background: 'var(--color-ink)' }}>
              VISA
            </div>
            <div>
              <p className="text-[14px] text-(--color-ink) font-500">•••• •••• •••• 4242</p>
              <p className="font-mono text-[11px] text-(--color-sage-dim)">Expires 09/28</p>
            </div>
            <button className="ml-auto font-mono text-[11px] text-(--color-coral) hover:underline uppercase tracking-widest">
              Update
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  )
}

const sections: { id: SettingSection; label: string }[] = [
  { id: 'org', label: 'Organization' },
  { id: 'billing', label: 'Billing' },
]

export default function Settings({ activeSection, onSectionChange }: { activeSection?: SettingSection; onSectionChange?: (section: SettingSection) => void }) {
  const [internalActive, setInternalActive] = useState<SettingSection>('org')
  const active = activeSection ?? internalActive

  const selectSection = (next: SettingSection) => {
    setInternalActive(next)
    onSectionChange?.(next)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tab navigation */}
      <nav
        className="flex gap-1 overflow-x-auto pb-1"
        style={{ borderBottom: '1px solid var(--color-line-light)' }}
        aria-label="Settings sections"
      >
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => selectSection(id)}
            className="relative shrink-0 px-4 py-2.5 font-display font-500 text-[14px] whitespace-nowrap transition-colors cursor-pointer rounded-t-[5px] hover:bg-(--color-navy)/5"
            style={{ color: active === id ? 'var(--color-ink)' : 'var(--color-sage-dim)' }}
            aria-current={active === id ? 'page' : undefined}
          >
            {label}
            {active === id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: 'var(--color-coral)' }} />
            )}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="min-w-0">
        {active === 'org' && <OrgSettings />}
        {active === 'billing' && <BillingSettings />}
      </div>
    </div>
  )
}
