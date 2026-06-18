import { useEffect, useId, useRef } from 'react'
import { IconX } from '@tabler/icons-react'

interface Props {
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: number
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({ title, onClose, children, width = 420 }: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    // Prefer the first focusable element inside the body (the actual form/content)
    // over header chrome like the Close button, which is first in DOM order.
    const body = panel?.querySelector<HTMLElement>('.modal-body')
    const initialFocusable = (body ?? panel)?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ;(initialFocusable?.[0] ?? panel)?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        className="modal-panel"
        style={{ maxWidth: width }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="modal-hdr">
          <h2 id={titleId} className="modal-title">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <IconX size={16} stroke={1.5} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
