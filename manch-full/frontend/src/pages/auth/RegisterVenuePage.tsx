import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { authService } from '@/services'
import { setUser } from '@/store/slices/authSlice'
import type { AppDispatch } from '@/store'
import { CITIES } from '@/types'

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, 'Min 8 characters'),
  city: z.string().min(1, 'Select city'),
  venueName: z.string().min(2, 'Venue name required'),
  venueType: z.string().min(1, 'Select venue type'),
})

const VENUE_TYPES = [
  ['CAFE_RESTAURANT', '☕ Café / Restaurant'],
  ['COLLEGE_UNIVERSITY', '🎓 College / University'],
  ['CORPORATE', '💼 Corporate Event'],
  ['COMMUNITY_SPACE', '🏘️ Community Space'],
  ['BAR_LOUNGE', '🍻 Bar / Lounge'],
  ['OUTDOOR_FESTIVAL', '🎪 Outdoor / Festival'],
  ['OTHER', '➕ Other'],
]

export default function RegisterVenuePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (d: Record<string, unknown>) => authService.register({ ...d, role: 'VENUE' }),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      dispatch(setUser(data.user))
      toast.success(`Welcome, ${data.user.venueName ?? data.user.fullName}! 🏛️`)
      navigate('/venue/dashboard', { replace: true })
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Registration failed'),
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-4xl font-black">मंच<span className="text-gold">.</span></Link>
          <p className="text-muted text-sm mt-2">Register your venue</p>
        </div>
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🏛️</span>
            <div>
              <h1 className="font-display text-2xl font-bold">Join as Venue</h1>
              <p className="text-muted text-xs mt-0.5">Already have an account? <Link to="/login" className="text-gold underline">Sign in</Link></p>
            </div>
          </div>
          <form onSubmit={handleSubmit(d => mutation.mutate(d as Record<string, unknown>))} className="space-y-4">
            <div>
              <label className="form-label">Venue / Organisation Name *</label>
              <input {...register('venueName')} placeholder="Cafe Bohemian / IIT Bombay" className="form-input" />
              {errors.venueName && <p className="text-rust text-xs mt-1">{errors.venueName.message as string}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Contact Name *</label>
                <input {...register('fullName')} placeholder="Your full name" className="form-input" />
                {errors.fullName && <p className="text-rust text-xs mt-1">{errors.fullName.message as string}</p>}
              </div>
              <div>
                <label className="form-label">City *</label>
                <select {...register('city')} className="form-input">
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.city && <p className="text-rust text-xs mt-1">{errors.city.message as string}</p>}
              </div>
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input {...register('email')} type="email" placeholder="contact@venue.com" className="form-input" />
              {errors.email && <p className="text-rust text-xs mt-1">{errors.email.message as string}</p>}
            </div>
            <div>
              <label className="form-label">Password *</label>
              <input {...register('password')} type="password" placeholder="Min. 8 characters" className="form-input" />
              {errors.password && <p className="text-rust text-xs mt-1">{errors.password.message as string}</p>}
            </div>
            <div>
              <label className="form-label">Venue Type *</label>
              <select {...register('venueType')} className="form-input">
                <option value="">What kind of events?</option>
                {VENUE_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              {errors.venueType && <p className="text-rust text-xs mt-1">{errors.venueType.message as string}</p>}
            </div>
            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full justify-center">
              {mutation.isPending ? 'Creating account...' : 'Create Venue Account →'}
            </button>
          </form>
          <p className="text-center text-xs text-muted mt-4">
            Joining as a performer? <Link to="/register/artist" className="underline hover:text-gold">Register as Artist</Link>
          </p>
        </div>
      </div>
    </div>
  )
}