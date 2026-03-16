import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { openModal } from '@/store/slices/uiSlice'
export default function CtaSection() {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <section className="bg-ink px-6 md:px-24 py-32 text-center relative overflow-hidden" id="join">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{background:'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)'}} />
      <h2 className="font-display font-black text-cream leading-tight tracking-tight mb-4 relative text-4xl md:text-5xl lg:text-6xl">
        Ready to find<br/>your <em className="text-gold not-italic">stage?</em>
      </h2>
      <p className="text-cream/55 font-light max-w-md mx-auto leading-relaxed mb-10">Join the waitlist. We're rolling out city by city, starting with Pune and Mumbai.</p>
      <div className="flex gap-4 justify-center flex-wrap">
        <button onClick={() => dispatch(openModal({ id: 'artist-waitlist' }))} className="btn-gold">Join as Artist</button>
        <button onClick={() => dispatch(openModal({ id: 'venue-waitlist' }))} className="btn-ghost">Join as Venue</button>
      </div>
    </section>
  )
}
