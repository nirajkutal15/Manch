import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { gigService } from '@/services'
import { useAuth } from '@/hooks/useAuth'
import { GIG_TYPE_LABELS, type GigResponse } from '@/types'
import Modal from '@/components/ui/Modal'
import { useScrollReveal } from '@/hooks/useScrollReveal'

function GigCard({ gig, onApply }: { gig: GigResponse; onApply: (gig: GigResponse) => void }) {
  const slotsLeft = gig.slotsAvailable - gig.slotsFilled
  return (
    <div className="card p-6 hover:-translate-y-1 hover:border-gold hover:shadow-lg transition-all duration-200 relative overflow-hidden group cursor-pointer" onClick={() => onApply(gig)}>
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      <span className="inline-block bg-gold/15 text-yellow-700 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm mb-3">{GIG_TYPE_LABELS[gig.gigType]}</span>
      <h3 className="font-display font-bold text-lg mb-1">{gig.title}</h3>
      <p className="text-muted text-xs mb-3">📍 {gig.venue ?? gig.city}, {gig.city}</p>
      {gig.description && <p className="text-sm text-muted font-light leading-relaxed mb-3 line-clamp-2">{gig.description}</p>}
      <div className="flex gap-4 text-xs text-muted mb-3">
        <span>📅 {new Date(gig.eventDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        {gig.eventTime && <span>🕐 {gig.eventTime.substring(0, 5)}</span>}
        <span>👥 {slotsLeft} slot{slotsLeft !== 1 ? 's' : ''} open</span>
      </div>
      {gig.preferredArtForms && gig.preferredArtForms.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {gig.preferredArtForms.slice(0, 3).map(af => (
            <span key={af} className="text-[10px] bg-gold/10 text-yellow-700 px-2 py-0.5 rounded-sm">{af.replace(/_/g, ' ')}</span>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-medium text-sage">
          {gig.payType === 'FREE' ? '🆓 Free' : gig.payAmount ? `💰 ₹${gig.payAmount.toLocaleString('en-IN')}` : '🤝 Negotiable'}
        </span>
        <button className="bg-ink text-cream text-xs font-medium px-4 py-1.5 rounded-sm hover:bg-gold hover:text-ink transition-all" onClick={e => { e.stopPropagation(); onApply(gig) }}>
          Apply Now →
        </button>
      </div>
    </div>
  )
}

export default function GigsPage() {
  useScrollReveal()
  const { isLoggedIn, isArtist } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [gigType, setGigType] = useState('')
  const [payType, setPayType] = useState('')
  const [page, setPage] = useState(0)
  const [selectedGig, setSelectedGig] = useState<GigResponse | null>(null)
  const [applyNote, setApplyNote] = useState('')
  const [applySuccess, setApplySuccess] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['gigs', city, gigType, payType, page],
    queryFn: () => gigService.list({ city: city || undefined, gigType: gigType || undefined, payType: payType || undefined, page, size: 12 }),
  })

  const applyMutation = useMutation({
    mutationFn: () => gigService.apply(selectedGig!.id, applyNote),
    onSuccess: () => { setApplySuccess(true); queryClient.invalidateQueries({ queryKey: ['my-applications'] }) },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Failed to apply'),
  })

  const filtered = data?.content.filter(g =>
    !search || g.title.toLowerCase().includes(search.toLowerCase()) || (g.venue ?? '').toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const handleApply = (gig: GigResponse) => {
    if (!isLoggedIn) { navigate('/login'); return }
    if (!isArtist) { toast.error('Only artists can apply to gigs'); return }
    setSelectedGig(gig); setApplyNote(''); setApplySuccess(false)
  }

  return (
    <div className="min-h-screen px-6 md:px-24 py-12">
      <div className="mb-10 reveal">
        <div className="section-label">Live gig feed</div>
        <h1 className="section-title mb-2">Open slots near you.</h1>
        <p className="text-muted font-light">Browse gigs, find your stage, apply in one click.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gigs or venues..." className="form-input flex-1 min-w-[200px]" />
        <select value={city} onChange={e => { setCity(e.target.value); setPage(0) }} className="form-input min-w-[130px]">
          <option value="">All Cities</option>
          {['Pune','Mumbai','Bangalore','Delhi','Hyderabad','Chennai'].map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={gigType} onChange={e => { setGigType(e.target.value); setPage(0) }} className="form-input min-w-[150px]">
          <option value="">All Types</option>
          {Object.entries(GIG_TYPE_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={payType} onChange={e => { setPayType(e.target.value); setPage(0) }} className="form-input min-w-[120px]">
          <option value="">Any Pay</option>
          <option value="FREE">Free</option>
          <option value="PAID">Paid</option>
          <option value="NEGOTIABLE">Negotiable</option>
        </select>
        {(search || city || gigType || payType) && (
          <button onClick={() => { setSearch(''); setCity(''); setGigType(''); setPayType(''); setPage(0) }} className="btn-outline py-2.5">Clear</button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-5">
          {[...Array(9)].map((_, i) => <div key={i} className="card p-6 animate-pulse h-52" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-4">🎭</p>
          <p className="text-lg font-display font-bold mb-2">No gigs found</p>
          <p className="text-sm">Try different filters or check back soon.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {filtered.map(g => <GigCard key={g.id} gig={g} onApply={handleApply} />)}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-10">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-outline py-2 px-5 disabled:opacity-40">← Prev</button>
          <span className="flex items-center text-sm text-muted">Page {page + 1} of {data.totalPages}</span>
          <button disabled={data.last} onClick={() => setPage(p => p + 1)} className="btn-primary py-2 px-5">Next →</button>
        </div>
      )}

      {/* Apply modal */}
      <Modal open={!!selectedGig} onClose={() => setSelectedGig(null)}>
        {selectedGig && (
          applySuccess ? (
            <div className="text-center py-4">
              <span className="text-5xl block mb-4 animate-pop">🎉</span>
              <h3 className="font-display text-xl font-bold mb-2">Application Sent!</h3>
              <p className="text-muted text-sm leading-relaxed">Your application for <strong>{selectedGig.title}</strong> has been submitted. The organiser will review your profile and get back to you within 48 hours.</p>
              <button className="btn-primary w-full justify-center mt-6" onClick={() => setSelectedGig(null)}>Got it!</button>
            </div>
          ) : (
            <div>
              <div className="text-3xl mb-4">🎤</div>
              <h3 className="font-display text-xl font-bold mb-1">Apply to: {selectedGig.title}</h3>
              <p className="text-muted text-sm mb-1">📍 {selectedGig.venue ?? selectedGig.city}</p>
              <p className="text-muted text-sm mb-6">📅 {new Date(selectedGig.eventDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <div className="mb-4">
                <label className="form-label">Add a note <span className="normal-case font-normal">(optional)</span></label>
                <textarea value={applyNote} onChange={e => setApplyNote(e.target.value)} rows={3} placeholder="Tell the venue a bit about yourself and why you'd be great for this..." className="form-input resize-none" />
              </div>
              <button onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending} className="btn-primary w-full justify-center">
                {applyMutation.isPending ? 'Submitting...' : 'Submit Application →'}
              </button>
            </div>
          )
        )}
      </Modal>
    </div>
  )
}