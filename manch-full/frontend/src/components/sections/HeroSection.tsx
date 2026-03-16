import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { openModal } from '@/store/slices/uiSlice'
import { useCountUp } from '@/hooks/useCountUp'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'

function StatCard({ target, label, suffix = '' }: { target: number; label: string; suffix?: string }) {
  const { ref, count } = useCountUp(target)
  return (
    <div ref={ref}>
      <div className="font-display text-3xl font-bold leading-none">{count}{suffix}</div>
      <div className="text-xs text-muted uppercase tracking-widest mt-1">{label}</div>
    </div>
  )
}

interface ProfileData { name: string; type: string; city: string; status: string; icon: string; extra: string }

const PERFORMER_CARDS = [
  { cls: 'top-[12%] right-[8%]', icon: '🎤', name: 'Priya Sharma', type: 'Spoken Word · Pune', badge: 'New', badgeCls: 'badge-new', delay: '0s', profile: { name: 'Priya Sharma', type: 'Spoken Word', city: 'Pune', status: 'New', icon: '🎤', extra: '2 years performing · 8 open mics · ⭐ 4.9' } },
  { cls: 'top-[38%] left-[5%]', icon: '🎭', name: 'Cafe Bohemian', type: 'Open Mic · Tonight', badge: 'Live', badgeCls: 'badge-live', delay: '-1.3s', profile: { name: 'Cafe Bohemian', type: 'Open Mic Venue', city: 'Mumbai', status: 'Live Tonight', icon: '🏛️', extra: 'Weekly open mic · Seats 60 · Free entry' } },
  { cls: 'bottom-[20%] right-[12%]', icon: '✍️', name: 'Arjun Mehta', type: 'Stand-up · Mumbai', badge: 'Booked', badgeCls: 'badge-open', delay: '-2.6s', profile: { name: 'Arjun Mehta', type: 'Stand-up Comedy', city: 'Mumbai', status: 'Booked', icon: '✍️', extra: '5 years on stage · 40+ shows · ⭐ 4.7' } },
  { cls: 'bottom-[38%] left-[8%]', icon: '🎪', name: 'IIT Bombay Fest', type: '3 slots open · Paid', badge: 'Open', badgeCls: 'badge-open', delay: '-0.8s', profile: { name: 'IIT Bombay Fest', type: 'College Festival', city: 'Mumbai', status: 'Open', icon: '🎪', extra: 'Annual Mood Indigo · 3 slots open · ₹5,000/slot' } },
]

export default function HeroSection() {
  const dispatch = useDispatch<AppDispatch>()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-20 overflow-hidden">
      {/* Left */}
      <div className="flex flex-col justify-center px-6 md:px-16 py-16 relative z-10">
        <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-yellow-700 text-xs font-medium uppercase tracking-widest px-3.5 py-1.5 rounded-sm mb-8 w-fit hero-anim-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-blink" />
          Now live in India
        </div>

        <h1 className="font-display font-black leading-[1.05] tracking-tight mb-6 text-5xl md:text-6xl lg:text-7xl hero-anim-2">
          Every artist<br />deserves a <em className="text-gold not-italic">stage.</em>
        </h1>

        <p className="text-muted text-lg leading-relaxed font-light max-w-md mb-10 hero-anim-3">
          Manch connects emerging poets, comedians, storytellers and performers with open mics, cafes, colleges and events — so your talent gets the audience it deserves.
        </p>

        <div className="flex gap-4 flex-wrap hero-anim-4">
          <button onClick={() => dispatch(openModal({ id: 'artist-waitlist' }))} className="btn-primary">I'm an Artist →</button>
          <button onClick={() => dispatch(openModal({ id: 'venue-waitlist' }))} className="btn-outline">I'm a Venue</button>
        </div>

        <div className="flex gap-10 mt-14 pt-10 border-t border-black/10 hero-anim-5">
          <StatCard target={500} label="Artists waiting" suffix="+" />
          <StatCard target={80} label="Venues onboard" suffix="+" />
          <StatCard target={12} label="Cities" />
        </div>
      </div>

      {/* Right — Stage */}
      <div className="relative hidden md:flex items-center justify-center overflow-hidden min-h-[600px] hero-right-anim">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(201,168,76,0.18) 0%, transparent 70%), radial-gradient(ellipse at 30% 80%, rgba(196,84,42,0.08) 0%, transparent 60%)' }} />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-48 h-[120%] animate-spotlight" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.05) 60%, transparent 100%)', clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)' }} />

        {PERFORMER_CARDS.map(card => (
          <div key={card.name}
            className={`absolute ${card.cls} bg-card border border-gold/25 rounded-sm p-3.5 flex items-center gap-3 shadow-lg min-w-[190px] cursor-pointer hover:border-gold hover:shadow-gold/20 transition-all`}
            style={{ animation: `float 4s ease-in-out ${card.delay} infinite` }}
            onClick={() => setProfileData(card.profile)}
          >
            <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-lg flex-shrink-0">{card.icon}</div>
            <div className="flex-1">
              <div className="text-sm font-medium leading-tight">{card.name}</div>
              <div className="text-xs text-muted mt-0.5">{card.type}</div>
            </div>
            <span className={`badge ${card.badgeCls}`}>{card.badge}</span>
          </div>
        ))}

        <div className="relative z-10 text-center">
          <span className="text-8xl block animate-float" style={{ filter: 'drop-shadow(0 8px 24px rgba(201,168,76,0.4))' }}>🎤</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: 'linear-gradient(0deg, rgba(13,13,13,0.06) 0%, transparent 100%)' }} />
      </div>

      {/* Profile modal */}
      <Modal open={!!profileData} onClose={() => setProfileData(null)}>
        {profileData && (
          <div>
            <div className="text-center pb-5">
              <div className="text-6xl mb-3">{profileData.icon}</div>
              <h3 className="font-display text-2xl font-bold mb-1">{profileData.name}</h3>
              <p className="text-sm text-muted mb-2">{profileData.type} · {profileData.city}</p>
              <span className="badge badge-open">{profileData.status}</span>
            </div>
            <div className="bg-gold/8 border border-gold/20 rounded-sm p-4 text-sm text-muted mb-6">{profileData.extra}</div>
            <button className="btn-primary w-full justify-center" onClick={() => { setProfileData(null); dispatch(openModal({ id: 'artist-waitlist' })) }}>
              Connect on Manch →
            </button>
          </div>
        )}
      </Modal>
    </section>
  )
}
