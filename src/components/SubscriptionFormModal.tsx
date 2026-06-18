import { useId, useState } from 'react'
import { Modal } from './Modal'
import { CATEGORIES, BILLING_CYCLES, STATUSES, CAT_COLORS, type Subscription, type Category, type BillingCycle, type SubStatus } from '../types'
import { POPULAR_SERVICES, type PopularService } from '../utils/popularServices'

interface Props {
  initial?: Subscription
  onSubmit: (values: Omit<Subscription, 'id'>) => void
  onClose: () => void
}

interface FormErrors {
  name?: string
  price?: string
}

const CYCLE_LABELS: Record<BillingCycle, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
  custom: 'Custom interval',
}

const STATUS_LABELS: Record<SubStatus, string> = {
  active: 'Active',
  trial: 'Trial',
  paused: 'Paused',
}

function defaultDate(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().split('T')[0]
}

export function SubscriptionFormModal({ initial, onSubmit, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [cat, setCat] = useState<Category>(initial?.cat ?? 'Entertainment')
  const [catTouched, setCatTouched] = useState(!!initial)
  const [priceInput, setPriceInput] = useState(initial ? String(initial.price) : '')
  const [cycle, setCycle] = useState<BillingCycle>(initial?.cycle ?? 'monthly')
  const [customDays, setCustomDays] = useState(initial?.customDays ?? 30)
  const [date, setDate] = useState(initial?.date ?? defaultDate())
  const [status, setStatus] = useState<SubStatus>(initial?.status ?? 'active')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [errors, setErrors] = useState<FormErrors>({})
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const nameErrorId = useId()
  const priceErrorId = useId()
  const priceHintId = useId()
  const suggestionsListId = useId()

  const suggestions = name.trim()
    ? POPULAR_SERVICES.filter(s => s.name.toLowerCase().includes(name.trim().toLowerCase())).slice(0, 6)
    : []

  function optionId(index: number): string {
    return `${suggestionsListId}-option-${index}`
  }

  function handleNameChange(value: string) {
    setName(value)
    setActiveIndex(-1)
    if (errors.name) setErrors(e => ({ ...e, name: undefined }))
  }

  function selectSuggestion(s: PopularService) {
    setName(s.name)
    if (!catTouched) setCat(s.cat)
    if (errors.name) setErrors(e => ({ ...e, name: undefined }))
    setShowSuggestions(false)
    setActiveIndex(-1)
  }

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      return
    }
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      selectSuggestion(suggestions[activeIndex])
    }
  }

  function handlePriceChange(value: string) {
    setPriceInput(value)
    if (errors.price) setErrors(e => ({ ...e, price: undefined }))
  }

  function isEmptyTrialPrice(): boolean {
    return status === 'trial' && priceInput.trim() === ''
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Service name is required.'
    if (!isEmptyTrialPrice()) {
      const price = parseFloat(priceInput)
      if (priceInput.trim() === '' || Number.isNaN(price) || price < 0) {
        next.price = 'Enter a valid price (0 or more).'
      }
    }
    return next
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit({
      name: name.trim(),
      cat,
      price: isEmptyTrialPrice() ? 0 : parseFloat(priceInput),
      cycle,
      customDays: cycle === 'custom' ? customDays : undefined,
      date,
      status,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <Modal title={initial ? 'Edit subscription' : 'Add subscription'} onClose={onClose} width={440}>
      <form className="sub-form" onSubmit={handleSubmit} noValidate>
        <label className="form-field">
          <span>Service name</span>
          <div className="autocomplete">
            <input
              type="text"
              value={name}
              placeholder="e.g. Netflix"
              autoComplete="off"
              role="combobox"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls={suggestionsListId}
              aria-autocomplete="list"
              aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? nameErrorId : undefined}
              onChange={e => handleNameChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => { setShowSuggestions(false); setActiveIndex(-1) }}
              onKeyDown={handleNameKeyDown}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="autocomplete-list" id={suggestionsListId} role="listbox">
                {suggestions.map((s, i) => (
                  <button
                    type="button"
                    role="option"
                    id={optionId(i)}
                    aria-selected={i === activeIndex}
                    key={s.name}
                    className={`autocomplete-item${i === activeIndex ? ' active' : ''}`}
                    onMouseDown={e => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => selectSuggestion(s)}
                  >
                    <span className="autocomplete-dot" aria-hidden="true" style={{ background: CAT_COLORS[s.cat] }} />
                    <span className="autocomplete-name">{s.name}</span>
                    <span className="autocomplete-cat">{s.cat}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.name && <span className="field-error" id={nameErrorId}>{errors.name}</span>}
        </label>

        <div className="form-row">
          <label className="form-field">
            <span>Category</span>
            <select value={cat} onChange={e => { setCat(e.target.value as Category); setCatTouched(true) }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span>Status</span>
            <select value={status} onChange={e => setStatus(e.target.value as SubStatus)}>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label className="form-field">
            <span>Price</span>
            <input
              type="number"
              value={priceInput}
              min={0}
              step={0.01}
              placeholder={status === 'trial' ? '0.00 (optional)' : '9.99'}
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? priceErrorId : status === 'trial' ? priceHintId : undefined}
              onChange={e => handlePriceChange(e.target.value)}
            />
            {errors.price && <span className="field-error" id={priceErrorId}>{errors.price}</span>}
            {status === 'trial' && !errors.price && (
              <span className="field-hint" id={priceHintId}>Leave blank for a free trial.</span>
            )}
          </label>
          <label className="form-field">
            <span>Billing cycle</span>
            <select value={cycle} onChange={e => setCycle(e.target.value as BillingCycle)}>
              {BILLING_CYCLES.map(c => <option key={c} value={c}>{CYCLE_LABELS[c]}</option>)}
            </select>
          </label>
        </div>

        {cycle === 'custom' && (
          <label className="form-field">
            <span>Repeats every (days)</span>
            <input
              type="number"
              value={customDays}
              min={1}
              onChange={e => setCustomDays(parseInt(e.target.value) || 1)}
            />
          </label>
        )}

        <label className="form-field">
          <span>Next billing date</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>

        <label className="form-field">
          <span>Notes (optional)</span>
          <input type="text" value={notes} placeholder="e.g. shared with family" onChange={e => setNotes(e.target.value)} />
        </label>

        <div className="confirm-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{initial ? 'Save changes' : 'Add subscription'}</button>
        </div>
      </form>
    </Modal>
  )
}
