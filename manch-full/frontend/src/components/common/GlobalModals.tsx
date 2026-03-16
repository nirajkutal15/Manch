import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useState } from 'react'
import type { RootState, AppDispatch } from '@/store'
import { closeModal } from '@/store/slices/uiSlice'
import { waitlistService, contactService } from '@/services'
import Modal from '@/components/ui/Modal'
import { CITIES, ART_FORM_LABELS, type ArtForm } from '@/types'

export default function GlobalModals() {
  const dispatch = useDispatch<AppDispatch>()
  const { activeModal } = useSelector((s: RootState) => s.ui)
  const close = () => dispatch(closeModal())

  return (
    <>
      <WaitlistModal open={activeModal === 'artist-waitlist' || activeModal === 'venue-waitlist'} type={activeModal === 'venue-waitlist' ? 'VENUE' : 'ARTIST'} onClose={close} />
      <AboutModal open={activeModal === 'about'} onClose={close} />
      <ContactModal open={activeModal === 'contact'} onClose={close} />
      <PrivacyModal open={activeModal === 'privacy'} onClose={close} />
    </>
  )
}

// ── Waitlist ────────────────────────────────────────────────
const waitlistSchema = z.object({
  fullName: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  city: z.string().min(1, 'City required'),
  artForm: z.string().optional(),
  venueName: z.string().optional(),
  venueType: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
})

function WaitlistModal({ open, type, onClose }: { open: boolean; type: 'ARTIST' | 'VENUE'; onClose: () => void }) {
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(waitlistSchema) })
  const dispatch = useDispatch<AppDispatch>()

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => waitlistService.join({ ...data, type }),
    onSuccess: () => setSuccess(true),
    onError: () => toast.error('Failed to join waitlist. Try again.'),
  })

  const handleClose = () => { onClose(); setTimeout(() => { setSuccess(false); reset() }, 300) }

  return (
    <Modal open={open} onClose={handleClose}>
      {success ? (
        <div className="text-center py-4">
          <span className="text-6xl block mb-4 animate-pop">{type === 'ARTIST' ? '🎤' : '🏛️'}</span>
          <h2 className="font-display text-2xl font-bold mb-3">You're on the list!</h2>
          <p className="text-muted text-sm leading-relaxed">We'll notify you when Manch launches in your city. Keep performing! 🌟</p>
          <button onClick={handleClose} className="btn-primary mt-6 w-full justify-center">Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(d => mutation.mutate(d as Record<string, unknown>))}>
          <div className="text-4xl mb-4">{type === 'ARTIST' ? '🎤' : '🏛️'}</div>
          <h2 className="font-display text-2xl font-bold mb-1">{type === 'ARTIST' ? 'Join as Artist' : 'Join as Venue'}</h2>
          <p className="text-muted text-sm mb-6 leading-relaxed">
            {type === 'ARTIST' ? 'Get early access when Manch launches in your city.' : 'Post your first slot for free. Find the right talent, fast.'}
          </p>

          {type === 'VENUE' && (
            <div className="mb-3">
              <label className="form-label">Venue / Organisation Name</label>
              <input {...register('venueName')} placeholder="Cafe Bohemian / IIT Bombay" className="form-input" />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input {...register('fullName')} placeholder="Your name" className="form-input" />
            {errors.fullName && <p className="text-rust text-xs mt-1">{errors.fullName.message as string}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="form-label">Email</label>
              <input {...register('email')} type="email" placeholder="you@example.com" className="form-input" />
              {errors.email && <p className="text-rust text-xs mt-1">{errors.email.message as string}</p>}
            </div>
            <div>
              <label className="form-label">City</label>
              <select {...register('city')} className="form-input">
                <option value="">Select city</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
              {errors.city && <p className="text-rust text-xs mt-1">{errors.city.message as string}</p>}
            </div>
          </div>

          {type === 'ARTIST' && (
            <div className="mb-3">
              <label className="form-label">Art Form</label>
              <select {...register('artForm')} className="form-input">
                <option value="">What do you perform?</option>
                {Object.entries(ART_FORM_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          )}

          {type === 'VENUE' && (
            <div className="mb-3">
              <label className="form-label">Venue Type</label>
              <select {...register('venueType')} className="form-input">
                <option value="">What kind of events?</option>
                {['CAFE_RESTAURANT','COLLEGE_UNIVERSITY','CORPORATE','COMMUNITY_SPACE','BAR_LOUNGE','OUTDOOR_FESTIVAL','OTHER'].map(v => (
                  <option key={v} value={v}>{v.replace(/_/g,' ')}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">{type === 'ARTIST' ? 'About yourself' : 'Notes'} <span className="normal-case font-normal">(optional)</span></label>
            <textarea {...register('bio')} rows={2} placeholder={type === 'ARTIST' ? 'How long performing? Any links?' : 'Type of events you host...'} className="form-input resize-none" />
          </div>

          <button type="submit" disabled={mutation.isPending} className="btn-primary w-full justify-center mt-2">
            {mutation.isPending ? 'Submitting...' : type === 'ARTIST' ? 'Join Waitlist →' : 'Get Early Access →'}
          </button>

          <p className="text-center text-xs text-muted mt-4">
            Want to{' '}
            <button type="button" onClick={() => { handleClose(); setTimeout(() => dispatch({ type: 'ui/openModal', payload: { id: type === 'ARTIST' ? 'venue-waitlist' : 'artist-waitlist' } }), 350) }} className="underline hover:text-gold">
              join as {type === 'ARTIST' ? 'a venue' : 'an artist'}
            </button>{' '}instead?
          </p>
        </form>
      )}
    </Modal>
  )
}

// ── About ───────────────────────────────────────────────────
function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-4xl mb-4">🎭</div>
      <h2 className="font-display text-2xl font-bold mb-4">About Manch</h2>
      <div className="text-sm text-muted leading-relaxed space-y-3">
        <p><strong className="text-ink">Manch</strong> (मंच) means "stage" in Hindi — and that's exactly what we're building.</p>
        <p>We're a small team from Pune who noticed that incredible performing artists — poets, stand-ups, storytellers — were struggling to find their first gig. Meanwhile, cafes, colleges and event organizers were spending hours on WhatsApp trying to discover talent.</p>
        <p>Manch is the bridge. A clean, purposeful platform for India's indie performance scene.</p>
        <p className="text-xs">Built with ❤️ in Pune. Currently in beta — launching city by city.</p>
      </div>
      <button onClick={onClose} className="btn-primary w-full justify-center mt-6">Close</button>
    </Modal>
  )
}

// ── Contact ─────────────────────────────────────────────────
const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(contactSchema) })

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => contactService.send(data),
    onSuccess: () => setSuccess(true),
  })

  const handleClose = () => { onClose(); setTimeout(() => { setSuccess(false); reset() }, 300) }

  return (
    <Modal open={open} onClose={handleClose}>
      {success ? (
        <div className="text-center py-4">
          <span className="text-5xl block mb-4 animate-pop">✅</span>
          <h2 className="font-display text-xl font-bold mb-2">Message sent!</h2>
          <p className="text-muted text-sm">We'll get back to you within 1–2 business days.</p>
          <button onClick={handleClose} className="btn-primary mt-6 w-full justify-center">Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(d => mutation.mutate(d as Record<string, unknown>))}>
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="font-display text-2xl font-bold mb-1">Get in Touch</h2>
          <p className="text-muted text-sm mb-6">Questions, partnerships, press — we'd love to hear from you.</p>
          <div className="space-y-3">
            <div><label className="form-label">Name</label><input {...register('fullName')} placeholder="Your name" className="form-input" />{errors.fullName && <p className="text-rust text-xs mt-1">Name required</p>}</div>
            <div><label className="form-label">Email</label><input {...register('email')} type="email" placeholder="you@example.com" className="form-input" />{errors.email && <p className="text-rust text-xs mt-1">Valid email required</p>}</div>
            <div><label className="form-label">Message</label><textarea {...register('message')} rows={4} placeholder="What's on your mind?" className="form-input resize-none" />{errors.message && <p className="text-rust text-xs mt-1">Message too short</p>}</div>
          </div>
          <button type="submit" disabled={mutation.isPending} className="btn-primary w-full justify-center mt-4">
            {mutation.isPending ? 'Sending...' : 'Send Message →'}
          </button>
        </form>
      )}
    </Modal>
  )
}

// ── Privacy ─────────────────────────────────────────────────
function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <h2 className="font-display text-2xl font-bold mb-6">Privacy Policy</h2>
      <div className="text-sm text-muted leading-relaxed space-y-4 max-h-[55vh] overflow-y-auto pr-2">
        <div><h3 className="text-ink font-semibold mb-1">Data We Collect</h3><p>We collect your name, email, city, and art form when you join our waitlist. That's it for now.</p></div>
        <div><h3 className="text-ink font-semibold mb-1">How We Use It</h3><p>We use your information only to notify you when Manch launches in your city and to improve our platform.</p></div>
        <div><h3 className="text-ink font-semibold mb-1">We Never Sell Your Data</h3><p>Your information is never sold to third parties. We hate spam as much as you do.</p></div>
        <div><h3 className="text-ink font-semibold mb-1">Cookies</h3><p>We use minimal analytics cookies to understand how people discover us. No cross-site tracking.</p></div>
        <div><h3 className="text-ink font-semibold mb-1">Contact</h3><p>For any privacy concerns, write to privacy@manch.in</p></div>
        <p className="text-xs">Last updated: December 2024</p>
      </div>
      <button onClick={onClose} className="btn-primary w-full justify-center mt-6">Close</button>
    </Modal>
  )
}
