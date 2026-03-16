import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services'
import { setUser } from '@/store/slices/authSlice'
import type { AppDispatch } from '@/store'
import { CITIES } from '@/types'
import ImageUpload from '@/components/ui/ImageUpload'

const VENUE_TYPES = [
  ['CAFE_RESTAURANT', '☕ Café / Restaurant'],
  ['COLLEGE_UNIVERSITY', '🎓 College / University'],
  ['CORPORATE', '💼 Corporate Event'],
  ['COMMUNITY_SPACE', '🏘️ Community Space'],
  ['BAR_LOUNGE', '🍻 Bar / Lounge'],
  ['OUTDOOR_FESTIVAL', '🎪 Outdoor / Festival'],
  ['OTHER', '➕ Other'],
]

export default function VenueProfile() {
  const { user } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl ?? '')

  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: user?.fullName ?? '',
      venueName: user?.venueName ?? '',
      city: user?.city ?? '',
      venueType: user?.venueType ?? '',
      websiteUrl: user?.websiteUrl ?? '',
      phone: user?.phone ?? '',
    }
  })

  const mutation = useMutation({
    mutationFn: (d: Record<string, unknown>) =>
      authService.updateProfile(user!.id, { ...d, profileImageUrl }),
    onSuccess: (data) => {
      dispatch(setUser(data))
      toast.success('Profile updated! ✅')
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Update failed'),
  })

  return (
    <div className="px-6 md:px-24 py-12 max-w-2xl">
      <div className="mb-10">
        <div className="section-label">Edit Profile</div>
        <h1 className="section-title">Venue Profile</h1>
      </div>

      <div className="card p-8">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gold/10">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={user?.venueName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gold/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center text-3xl">🏛️</div>
          )}
          <div>
            <h2 className="font-display text-xl font-bold">{user?.venueName}</h2>
            <p className="text-muted text-sm">{user?.venueType?.replace(/_/g, ' ')} · {user?.city}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d as Record<string, unknown>))} className="space-y-5">
          {/* Profile picture upload */}
          <ImageUpload
            currentUrl={profileImageUrl}
            onUpload={(url) => setProfileImageUrl(url)}
            label="Venue Logo / Photo"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Venue Name</label>
              <input {...register('venueName')} className="form-input" />
            </div>
            <div>
              <label className="form-label">Contact Name</label>
              <input {...register('fullName')} className="form-input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">City</label>
              <select {...register('city')} className="form-input">
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Venue Type</label>
              <select {...register('venueType')} className="form-input">
                <option value="">Select</option>
                {VENUE_TYPES.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Website URL</label>
            <input {...register('websiteUrl')} placeholder="https://..." className="form-input" />
          </div>

          <div>
            <label className="form-label">Phone</label>
            <input {...register('phone')} placeholder="+91 98765 43210" className="form-input" />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes ✅'}
          </button>
        </form>
      </div>
    </div>
  )
}