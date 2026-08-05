import { useState } from 'react'
import { SlideOver, Reveal } from '../components/cultr-ui'

const roles = ['Admin', 'Manager', 'Employee', 'Contractor']
const scopes = ['Payroll', 'Records', 'Approvals', 'Reports', 'Settings', 'Audit']
type State = 'granted' | 'restricted' | 'custom'

const initialMatrix: State[][] = [
  ['granted', 'granted', 'granted', 'granted', 'granted', 'granted'],
  ['restricted', 'granted', 'granted', 'granted', 'restricted', 'restricted'],
  ['restricted', 'restricted', 'restricted', 'restricted', 'restricted', 'restricted'],
  ['restricted', 'restricted', 'restricted', 'restricted', 'restricted', 'restricted'],
]

function CellDot({ state, onClick }: { state: State; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-4 h-4 rounded-full transition-all duration-150 hover:scale-110 focus-visible:outline-2"
      style={{
        background: state === 'granted'
          ? 'var(--color-sage)'
          : state === 'custom'
          ? 'transparent'
          : 'rgba(158,173,156,0.15)',
        border: state === 'custom' ? '1px solid var(--color-coral)' : 'none',
      }}
      aria-label={`${state} — click to cycle`}
      title={state.charAt(0).toUpperCase() + state.slice(1)}
    />
  )
}

export default function Permissions() {
  const [matrix, setMatrix] = useState<State[][]>(initialMatrix)
  const [selectedRole, setSelectedRole] = useState<number | null>(null)

  const cycleState = (ri: number, ci: number) => {
    setMatrix(m => {
      const next = m.map(row => [...row])
      const cur = next[ri][ci]
      next[ri][ci] = cur === 'restricted' ? 'granted' : cur === 'granted' ? 'custom' : 'restricted'
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div className="bg-(--color-offwhite-raised) border border-(--color-line-light) rounded-[12px] overflow-hidden">
          <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--color-line-light)' }}>
            <h3 className="font-display font-600 text-[16px] text-(--color-ink)">Roles & Scopes</h3>
            <p className="text-[13px] text-(--color-sage-dim) mt-1">Click any cell to cycle: restricted → granted → custom scope. Click a role row to view details.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-line-light)' }}>
                  <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim) w-36">Role</th>
                  {scopes.map(s => (
                    <th key={s} className="px-4 py-4 text-center font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role, ri) => (
                  <tr key={role} style={{ borderTop: '1px solid var(--color-line-light)' }}
                    className="transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-offwhite)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedRole(ri)}
                        className="font-mono text-[13px] text-(--color-ink) hover:text-(--color-coral) transition-colors"
                      >
                        {role}
                      </button>
                    </td>
                    {matrix[ri].map((state, ci) => (
                      <td key={ci} className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <CellDot state={state} onClick={() => cycleState(ri, ci)} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="px-6 py-4 flex items-center gap-6" style={{ borderTop: '1px solid var(--color-line-light)' }}>
            {[
              { label: 'Granted', color: 'var(--color-sage)', border: 'none' },
              { label: 'Restricted', color: 'rgba(158,173,156,0.15)', border: 'none' },
              { label: 'Custom scope', color: 'transparent', border: '1px solid var(--color-coral)' },
            ].map(({ label, color, border }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: color, border }} aria-hidden="true" />
                <span className="font-mono text-[10px] text-(--color-sage-dim) uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <SlideOver open={selectedRole !== null} onClose={() => setSelectedRole(null)}
        title={selectedRole !== null ? `${roles[selectedRole]} — Role detail` : ''}>
        {selectedRole !== null && (
          <div className="flex flex-col gap-5">
            <p className="text-[14px] text-(--color-sage-dim)">
              Configure scope overrides and member assignments for the <strong className="text-(--color-ink)">{roles[selectedRole]}</strong> role.
            </p>
            {scopes.map((scope, ci) => {
              const state = matrix[selectedRole][ci]
              return (
                <div key={scope} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--color-line-light)' }}>
                  <span className="font-mono text-[12px] uppercase tracking-widest text-(--color-ink)">{scope}</span>
                  <button
                    onClick={() => cycleState(selectedRole, ci)}
                    className="font-mono text-[11px] uppercase tracking-widest px-3 py-1 rounded-full transition-colors"
                    style={{
                      color: state === 'granted' ? 'var(--color-sage)' : state === 'custom' ? 'var(--color-coral)' : 'var(--color-sage-dim)',
                      border: `1px solid ${state === 'granted' ? 'rgba(158,173,156,0.4)' : state === 'custom' ? 'rgba(239,120,104,0.4)' : 'var(--color-line-light)'}`,
                    }}
                  >
                    {state}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </SlideOver>
    </div>
  )
}
