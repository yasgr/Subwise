import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { SettingsModal } from './components/SettingsModal'
import { Metrics } from './components/Metrics'
import { UpcomingTimeline } from './components/UpcomingTimeline'
import { SubscriptionList } from './components/SubscriptionList'
import { AuditSection } from './components/AuditSection'
import { SubscriptionFormModal } from './components/SubscriptionFormModal'
import { type Subscription, type Settings, type ViewMode } from './types'
import { loadFromStorage, saveToStorage } from './utils/storage'
import { normalizeSub, normalizeSettings } from './utils/migrate'
import { DEFAULT_SETTINGS } from './utils/defaults'
import './App.css'

type FormModalState = { mode: 'add' } | { mode: 'edit'; sub: Subscription } | null

function loadInitialSubs(): Subscription[] {
  const savedSubs = loadFromStorage<unknown[]>('subwise-subs') ?? loadFromStorage<unknown[]>('subtrack-subs')
  return (savedSubs ?? []).map(normalizeSub)
}

function loadInitialSettings(): Settings {
  const savedSettings = loadFromStorage<unknown>('subwise-settings') ?? loadFromStorage<unknown>('subtrack-settings')
  return normalizeSettings(savedSettings, DEFAULT_SETTINGS)
}

export default function App() {
  const [subs, setSubs] = useState<Subscription[]>(loadInitialSubs)
  const [settings, setSettings] = useState<Settings>(loadInitialSettings)
  const [view, setView] = useState<ViewMode>('monthly')
  const [showSettings, setShowSettings] = useState(false)
  const [formModal, setFormModal] = useState<FormModalState>(null)
  const [nextId, setNextId] = useState(() => subs.reduce((m, s) => Math.max(m, s.id + 1), 1))

  useEffect(() => {
    const root = document.documentElement
    function apply() {
      const resolved = settings.theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : settings.theme
      root.dataset.theme = resolved
    }
    apply()
    if (settings.theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [settings.theme])

  function saveSubs(updated: Subscription[]) {
    setSubs(updated)
    saveToStorage('subwise-subs', updated)
  }

  function saveSettings(updated: Settings) {
    setSettings(updated)
    saveToStorage('subwise-settings', updated)
  }

  function handleFormSubmit(values: Omit<Subscription, 'id'>) {
    if (formModal?.mode === 'edit') {
      saveSubs(subs.map(s => s.id === formModal.sub.id ? { ...values, id: s.id } : s))
    } else {
      saveSubs([...subs, { ...values, id: nextId }])
      setNextId(nextId + 1)
    }
    setFormModal(null)
  }

  function deleteSub(id: number) {
    saveSubs(subs.filter(s => s.id !== id))
  }

  function loadSamples(samples: Subscription[]) {
    setNextId(samples.reduce((m, s) => Math.max(m, s.id + 1), 1))
    saveSubs(samples)
  }

  function importAll(data: { subs: Subscription[]; settings: Settings }) {
    setNextId(data.subs.reduce((m, s) => Math.max(m, s.id + 1), 1))
    saveSubs(data.subs)
    saveSettings(data.settings)
  }

  return (
    <div className="app">
      <Header
        view={view}
        onViewChange={setView}
        onToggleSettings={() => setShowSettings(true)}
        onAdd={() => setFormModal({ mode: 'add' })}
        theme={settings.theme}
        onThemeChange={t => saveSettings({ ...settings, theme: t })}
      />
      <Metrics subs={subs} settings={settings} view={view} />
      <UpcomingTimeline subs={subs} settings={settings} view={view} />
      <SubscriptionList
        subs={subs}
        settings={settings}
        view={view}
        onEdit={sub => setFormModal({ mode: 'edit', sub })}
        onDelete={deleteSub}
        onLoadSamples={loadSamples}
        onAddFirst={() => setFormModal({ mode: 'add' })}
      />
      <AuditSection subs={subs} settings={settings} />
      {showSettings && (
        <SettingsModal
          settings={settings}
          subs={subs}
          onSettingsChange={saveSettings}
          onImport={importAll}
          onClose={() => setShowSettings(false)}
        />
      )}
      {formModal && (
        <SubscriptionFormModal
          initial={formModal.mode === 'edit' ? formModal.sub : undefined}
          onSubmit={handleFormSubmit}
          onClose={() => setFormModal(null)}
        />
      )}
    </div>
  )
}
