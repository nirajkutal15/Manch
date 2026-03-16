const testimonials = [
  { text: "I've been writing poetry for two years but had no idea where to perform. Manch is exactly what I needed — a simple way to find where I can get on stage.", name: 'Sneha R.', role: 'Poet · Pune', icon: '✍️' },
  { text: "We run a weekly open mic at our cafe and spend hours on Instagram trying to find performers. A dedicated platform will save us so much time.", name: 'Rohan K.', role: 'Cafe Owner · Mumbai', icon: '☕' },
  { text: "As a stand-up just starting out, getting stage time is everything. I love that Manch is built for beginners, not just established names.", name: 'Aditya M.', role: 'Stand-up · Bangalore', icon: '🎤' },
]
export default function TestimonialsSection() {
  return (
    <section className="px-6 md:px-24 py-24 bg-cream">
      <div className="reveal">
        <div className="section-label">Early users</div>
        <h2 className="section-title mb-4">What they're saying.</h2>
        <p className="text-muted max-w-lg leading-relaxed font-light mb-14">Real stories from artists and organizers on the waitlist.</p>
      </div>
      <div className="reveal grid md:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.name} className="card p-7 relative hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <span className="absolute top-2 left-5 font-display text-6xl text-gold/30 leading-none">"</span>
            <p className="text-sm leading-relaxed font-light italic mt-4 mb-5">{t.text}</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center text-base">{t.icon}</div>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted mt-0.5">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
