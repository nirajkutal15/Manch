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
import { ART_FORM_LABELS, CITIES } from '@/types'

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, 'Min 8 characters'),
  city: z.string().min(1, 'Select city'),
  artForm: z.string().min(1, 'Select art form'),
  bio: z.string().optional()
})

export default function RegisterArtistPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (d: Record<string, unknown>) => authService.register({ ...d, role: 'ARTIST' }),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      dispatch(setUser(data.user))
      toast.success(`Welcome, ${data.user.fullName.split(' ')[0]}! 🎤`)
      navigate('/artist/dashboard', { replace: true })
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Registration failed'),
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-4xl font-black">मंच<span className="text-gold">.</span></Link>
          <p className="text-muted text-sm mt-2">Create your performer profile</p>
        </div>
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🎤</span>
            <div>
              <h1 className="font-display text-2xl font-bold">Join as Artist</h1>
              <p className="text-muted text-xs mt-0.5">Already have an account? <Link to="/login" className="text-gold underline">Sign in</Link></p>
            </div>
          </div>
          <form onSubmit={handleSubmit(d => mutation.mutate(d as Record<string, unknown>))} className="space-y-4">
            <div>
              <label className="form-label">Full Name *</label>
              <input {...register('fullName')} placeholder="Your full name" className="form-input" />
              {errors.fullName && <p className="text-rust text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Email *</label>
                <input {...register('email')} type="email" placeholder="you@example.com" className="form-input" />
                {errors.email && <p className="text-rust text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="form-label">City *</label>
                <select {...register('city')} className="form-input">
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.city && <p className="text-rust text-xs mt-1">{errors.city.message}</p>}
              </div>
            </div>
            <div>
              <label className="form-label">Password *</label>
              <input {...register('password')} type="password" placeholder="Min. 8 characters" className="form-input" />
              {errors.password && <p className="text-rust text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="form-label">Art Form *</label>
              <select {...register('artForm')} className="form-input">
                <option value="">What do you perform?</option>
                {Object.entries(ART_FORM_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              {errors.artForm && <p className="text-rust text-xs mt-1">{errors.artForm.message}</p>}
            </div>
            <div>
              <label className="form-label">Bio <span className="normal-case font-normal text-muted">(optional)</span></label>
              <textarea {...register('bio')} rows={3} placeholder="Tell venues about your performance style..." className="form-input resize-none" />
            </div>
            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full justify-center">
              {mutation.isPending ? 'Creating account...' : 'Create Artist Account →'}
            </button>
          </form>
          <p className="text-center text-xs text-muted mt-4">
            Joining as a venue? <Link to="/register/venue" className="underline hover:text-gold">Register as Venue</Link>
          </p>
        </div>
      </div>
    </div>
  )
}