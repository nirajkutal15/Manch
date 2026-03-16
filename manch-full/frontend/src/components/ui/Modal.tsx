import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  children: ReactNode
  maxWidth?: string
}

export default function Modal({ open, onClose, children, maxWidth = 'max-w-md' }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-ink/75 backdrop-blur-sm" />
          <motion.div
            className={`relative bg-card border border-gold/30 rounded-sm p-10 w-[90%] ${maxWidth} shadow-2xl max-h-[90vh] overflow-y-auto`}
            initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-5 text-muted hover:text-ink transition-colors z-10">
              <X size={20} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
