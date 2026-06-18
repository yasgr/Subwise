import { Modal } from './Modal'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onClose }: Props) {
  return (
    <Modal title={title} onClose={onClose} width={360}>
      <p className="confirm-msg">{message}</p>
      <div className="confirm-actions">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-danger" onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}
