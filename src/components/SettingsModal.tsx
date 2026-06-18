import { useRef } from 'react'
import { Modal } from './Modal'
import type { Settings, Subscription } from '../types'
import { exportData, importData } from '../utils/exportImport'

interface Props {
  settings: Settings
  subs: Subscription[]
  onSettingsChange: (s: Settings) => void
  onImport: (data: { subs: Subscription[]; settings: Settings }) => void
  onClose: () => void
}

export function SettingsModal({ settings, subs, onSettingsChange, onImport, onClose }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)

  function update(field: keyof Settings, value: string | number) {
    onSettingsChange({ ...settings, [field]: value })
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    importData(file)
      .then(data => { onImport(data); onClose() })
      .catch(() => alert('Could not read that file — make sure it’s a Subwise backup JSON.'))
    e.target.value = ''
  }

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="settings-row">
        <div>
          <div className="settings-lbl">Currency</div>
          <div className="settings-sub">Symbol shown across the app</div>
        </div>
        <select aria-label="Currency" value={settings.currency} onChange={e => update('currency', e.target.value)}>
          <option value="€">€ Euro</option>
          <option value="$">$ Dollar</option>
          <option value="£">£ Pound</option>
          <option value="¥">¥ Yen</option>
          <option value="₹">₹ Rupee</option>
          <option value="CHF">CHF Franc</option>
        </select>
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-lbl">Upcoming window</div>
          <div className="settings-sub">Days ahead shown in timeline</div>
        </div>
        <select aria-label="Upcoming window" value={settings.window} onChange={e => update('window', parseInt(e.target.value))}>
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
          <option value={60}>60 days</option>
        </select>
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-lbl">Theme</div>
          <div className="settings-sub">Light, dark, or match your system</div>
        </div>
        <select aria-label="Theme" value={settings.theme} onChange={e => update('theme', e.target.value)}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-lbl">Backup</div>
          <div className="settings-sub">Export or restore your data as JSON</div>
        </div>
        <div className="settings-backup-actions">
          <button className="btn-secondary" onClick={() => exportData(subs, settings)}>Export</button>
          <button className="btn-secondary" onClick={() => fileInput.current?.click()}>Import</button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>
      </div>
    </Modal>
  )
}
