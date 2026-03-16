import { useState } from 'react'
import { ART_FORM_LABELS, type ArtForm } from '@/types'
import toast from 'react-hot-toast'
export default function ArtFormsSection() {
  const [active, setActive] = useState<ArtForm|null>(null)
  return (
    <section className="bg-ink px-6 md:px-24 py-20" id="artforms">
      <div className="reveal">
        <div className="section-label text-gold">Art forms we support</div>
        <h2 className="font-display text-4xl font-bold text-cream mb-4">Your craft,<br/>your <em className="text-gold not-italic">spotlight.</em></h2>
        <p className="text-cream/55 max-w-lg leading-relaxed font-light mb-12">Manch is for every kind of performing artist — not just the famous ones.</p>
      </div>
      <div className="reveal flex flex-wrap gap-3">
        {(Object.entries(ART_FORM_LABELS) as [ArtForm, string][]).map(([key, label]) => (
          <button key={key} onClick={() => { setActive(key); toast(`${label} selected — gigs coming soon!`) }}
            className={`px-5 py-2.5 border rounded-sm text-sm font-light transition-all duration-200 hover:-translate-y-0.5 ${active===key ? 'bg-gold border-gold text-ink font-medium' : 'border-gold/30 text-cream/80 hover:bg-gold hover:border-gold hover:text-ink hover:font-medium'}`}>
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
