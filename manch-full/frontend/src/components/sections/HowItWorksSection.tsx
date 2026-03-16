import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { openModal } from '@/store/slices/uiSlice'
export default function HowItWorksSection() {
  const dispatch = useDispatch<AppDispatch>()
  const sides = [
    { icon:'🎤', title:'For Artists', id:'artists', desc:"Build your profile, find open slots, apply with one click. Your show history grows with every performance — turning strangers into fans and venues into regulars.", steps:['Create your performer profile with bio, art form & clips','Browse gigs in your city — free open mics or paid events','Apply in one click with your profile','Perform, get reviewed, build your stage history'], modal:'artist-waitlist' as const },
    { icon:'🏛️', title:'For Venues & Orgs', id:'venues', desc:"Post your slot in minutes. Browse verified artists with real performance histories. No more WhatsApp chaos — just clean, structured discovery of the right talent.", steps:['Post a slot — open mic, fest, corporate show, cafe night','Browse applicants with profiles, clips & show history','Confirm your performer — details shared instantly','Rate & review after the show — build platform trust'], modal:'venue-waitlist' as const },
  ]
  return (
    <section className="px-6 md:px-24 py-24" id="how">
      <div className="reveal">
        <div className="section-label">How it works</div>
        <h2 className="section-title mb-4">Two sides.<br/>One stage.</h2>
        <p className="text-muted max-w-lg leading-relaxed font-light mb-14">Whether you're an artist looking for your first gig or a venue searching for fresh talent — Manch makes the connection effortless.</p>
      </div>
      <div className="reveal grid md:grid-cols-2 gap-px bg-gold border border-gold rounded-sm overflow-hidden">
        {sides.map(s => (
          <div key={s.id} id={s.id} className="bg-card p-12 hover:bg-[#FFF8ED] transition-colors">
            <span className="text-4xl block mb-5">{s.icon}</span>
            <h3 className="font-display text-2xl font-bold mb-3">{s.title}</h3>
            <p className="text-muted text-sm leading-relaxed font-light mb-6">{s.desc}</p>
            <ul className="space-y-3">
              {s.steps.map((step,i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-snug">
                  <span className="w-5 h-5 rounded-full bg-gold text-ink flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                  {step}
                </li>
              ))}
            </ul>
            <button onClick={() => dispatch(openModal({ id: s.modal }))} className="btn-primary mt-8">
              Join as {s.icon === '🎤' ? 'Artist' : 'Venue'} →
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
