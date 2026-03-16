import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { gigService } from '@/services'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { openModal } from '@/store/slices/uiSlice'
import { GIG_TYPE_LABELS, type GigResponse } from '@/types'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

function GigCard({ gig, onApply }: { gig: GigResponse; onApply: (gig: GigResponse) => void }) {
  return (
    <div className="bg-card border border-gold/20 rounded-sm p-5 hover:-translate-y-1 hover:border-gold hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      <span className="inline-block bg-gold/15 text-yellow-700 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm mb-3">{GIG_TYPE_LABELS[gig.gigType]}</span>
      <h4 className="font-display font-bold text-base mb-1">{gig.title}</h4>
      <p className="text-muted text-xs mb-3">📍 {gig.venue ?? gig.city} · {gig.city}</p>
      <div className="flex gap-3 text-xs text-muted mb-3">
        <span>📅 {new Date(gig.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        <span>👥 {gig.slotsAvailable - gig.slotsFilled} slot{gig.slotsAvailable - gig.slotsFilled !== 1 ? 's' : ''} open</span>
      </div>
      <div className="text-sm font-medium text-sage mb-4">
        💰 {gig.payType === 'FREE' ? 'Free' : gig.payAmount ? `₹${gig.payAmount.toLocaleString('en-IN')}` : 'Negotiable'}
      </div>
      <button onClick={() => onApply(gig)} className="w-full bg-ink text-cream text-xs font-medium py-2 rounded-sm hover:bg-gold hover:text-ink transition-all">Apply Now →</button>
    </div>
  )
}

export default function FeaturesSection() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoggedIn, isArtist } = useAuth()
  const [showGigs, setShowGigs] = useState(false)
  const [gigSearch, setGigSearch] = useState('')
  const [gigCity, setGigCity] = useState('')
  const [gigArtForm, setGigArtForm] = useState('')

  const { data: gigsData, isLoading } = useQuery({
    queryKey: ['gigs-featured', gigCity, gigArtForm],
    queryFn: () => gigService.list({ city: gigCity || undefined, size: 9 }),
    enabled: showGigs,
  })

  const filtered = gigsData?.content.filter(g =>
    !gigSearch || g.title.toLowerCase().includes(gigSearch.toLowerCase()) || (g.venue ?? '').toLowerCase().includes(gigSearch.toLowerCase())
  ) ?? []

  const handleApply = (gig: GigResponse) => {
    if (!isLoggedIn) { dispatch(openModal({ id: 'artist-waitlist' })); return }
    if (!isArtist) { toast.error('Only artists can apply to gigs'); return }
    navigate(`/artist/gigs`)
  }

  const features = [
    { icon: '📋', title: 'Performer Profiles', desc: 'Bio, art form tags, city, experience level and video or audio samples — your digital stage card.', onClick: () => toast('📋 Performer Profiles — coming in beta launch!') },
    { icon: '🔍', title: 'Smart Gig Feed', desc: `Filter by city, art form, and pay type. Find free open mics or paid corporate gigs in seconds. ${!showGigs ? 'Click to browse →' : 'Click to hide ↑'}`, onClick: () => setShowGigs(!showGigs), gold: true },
    { icon: '⚡', title: 'One-click Apply', desc: 'Apply to any gig with your existing profile. Add a short note. Done in under 30 seconds.', onClick: () => toast('⚡ One-click apply — live for registered artists!') },
    { icon: '🏅', title: 'Show History', desc: 'Every confirmed performance is logged. Your track record becomes your credibility over time.', onClick: () => toast('🏅 Show history — tracks every confirmed performance!') },
    { icon: '⭐', title: 'Reviews & Ratings', desc: 'Venues rate artists. Artists rate venues. Trust is built transparently on both sides.', onClick: () => toast('⭐ Two-way reviews after every confirmed show!') },
    { icon: '📅', title: 'Event Calendar', desc: 'Public city-wise calendar of open mics and events — so you never miss a show in your area.', onClick: () => navigate('/gigs') },
  ]

  return (
    <section className="px-6 md:px-24 py-24 bg-[#F0EBE0]" id="features">
      <div className="reveal">
        <div className="section-label">Platform features</div>
        <h2 className="section-title mb-4">Everything you need,<br/>nothing you don't.</h2>
        <p className="text-muted max-w-lg leading-relaxed font-light mb-14">Built lean and purposeful for India's indie performance scene.</p>
      </div>

      <div className="reveal grid md:grid-cols-3 gap-px bg-black/8 border border-black/8 rounded-sm overflow-hidden">
        {features.map(f => (
          <div key={f.title} onClick={f.onClick} className="bg-card p-8 hover:bg-[#FFF8ED] transition-all cursor-pointer hover:scale-[1.01]">
            <span className="text-3xl block mb-4">{f.icon}</span>
            <div className="font-display font-bold text-lg mb-2">{f.title}</div>
            <p className="text-muted text-sm leading-relaxed font-light">
              {f.desc.replace(' Click to browse →','').replace(' Click to hide ↑','')}
              {f.gold && <strong className="text-gold ml-1">{showGigs ? 'Click to hide ↑' : 'Click to browse →'}</strong>}
            </p>
          </div>
        ))}
      </div>

      {/* Gig Feed */}
      {showGigs && (
        <div className="mt-10 reveal visible">
          <div className="flex flex-wrap gap-3 mb-6">
            <input value={gigSearch} onChange={e => setGigSearch(e.target.value)} placeholder="Search gigs..." className="form-input flex-1 min-w-[180px]" />
            <select value={gigCity} onChange={e => setGigCity(e.target.value)} className="form-input min-w-[130px] flex-none">
              <option value="">All Cities</option>
              {['Pune','Mumbai','Bangalore','Delhi','Hyderabad'].map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => navigate('/gigs')} className="btn-primary">View All →</button>
          </div>
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(6)].map((_,i) => <div key={i} className="card p-5 animate-pulse h-40" />)}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted py-10">No gigs found. Try different filters.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {filtered.map(g => <GigCard key={g.id} gig={g} onApply={handleApply} />)}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
