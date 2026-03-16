import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services'
import { setUser } from '@/store/slices/authSlice'
import type { AppDispatch } from '@/store'
import { ART_FORM_LABELS, CITIES } from '@/types'
import ImageUpload from '@/components/ui/ImageUpload'
import StarRating from '@/components/ui/StarRating'

export default function ArtistProfile() {
  const { user } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const qc = useQueryClient()
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl ?? '')

  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: user?.fullName ?? '',
      city: user?.city ?? '',
      artForm: user?.artForm ?? '',
      bio: user?.bio ?? '',
      yearsExperience: user?.yearsExperience ?? 0,
      sampleClipUrl: user?.sampleClipUrl ?? '',
    }
  })

  const mutation = useMutation({
    mutationFn: (d: Record<string, unknown>) =>
      authService.updateProfile(user!.id, { ...d, profileImageUrl }),
    onSuccess: (data) => {
      dispatch(setUser(data))
      toast.success('Profile updated! ✅')
      qc.invalidateQueries({ queryKey: ['me'] })
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Update failed'),
  })

  return (
    <div className="px-6 md:px-24 py-12 max-w-2xl">
      <div className="mb-10">
        <div className="section-label">Edit Profile</div>
        <h1 className="section-title">Your Artist Profile</h1>
      </div>

      <div className="card p-8">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gold/10">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={user?.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gold/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center text-3xl">🎤</div>
          )}
          <div>
            <h2 className="font-display text-xl font-bold">{user?.fullName}</h2>
            <p className="text-muted text-sm">{user?.artForm?.replace(/_/g, ' ')} · {user?.city}</p>
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(user?.rating ?? 0)} readonly size="sm" />
              <span className="text-xs text-muted">
                {user?.rating?.toFixed(1) ?? '—'} · {user?.totalShows ?? 0} shows
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d as Record<string, unknown>))} className="space-y-5">
          {/* Profile picture upload */}
          <ImageUpload
            currentUrl={profileImageUrl}
            onUpload={(url) => setProfileImageUrl(url)}
            label="Profile Picture"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name</label>
              <input {...register('fullName')} className="form-input" />
            </div>
            <div>
              <label className="form-label">City</label>
              <select {...register('city')} className="form-input">
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Art Form</label>
              <select {...register('artForm')} className="form-input">
                <option value="">Select</option>
                {Object.entries(ART_FORM_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Years Experience</label>
              <input
                {...register('yearsExperience', { valueAsNumber: true })}
                type="number"
                min="0"
                max="50"
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Bio</label>
            <textarea
              {...register('bio')}
              rows={4}
              placeholder="Tell venues about your performance style..."
              className="form-input resize-none"
            />
          </div>

          <div>
            <label className="form-label">Sample Clip URL</label>
            <input
              {...register('sampleClipUrl')}
              placeholder="YouTube / SoundCloud / Instagram link"
              className="form-input"
            />
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