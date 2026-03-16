import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { gigService, applicationService } from '@/services'
import type { ApplicationResponse } from '@/types'
import Modal from '@/components/ui/Modal'
import ReviewModal from '@/components/common/ReviewModal'

export default function GigApplications() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const [selected, setSelected] = useState<ApplicationResponse | null>(null)
  const [venueNote, setVenueNote] = useState('')
  const [reviewType, setReviewType] = useState<'ACCEPTED' | 'REJECTED' | null>(null)
  const [reviewApp, setReviewApp] = useState<ApplicationResponse | null>(null)

  const { data: gig } = useQuery({ queryKey: ['gig', id], queryFn: () => gigService.get(id!) })
  const { data: apps, isLoading } = useQuery({ queryKey: ['gig-applications', id], queryFn: () => gigService.applications(id!) })

  const reviewMutation = useMutation({
    mutationFn: ({ appId, status, note }: { appId: string; status: string; note: string }) =>
      applicationService.review(appId, status, note),
    onSuccess: (_, vars) => {
      toast.success(vars.status === 'ACCEPTED' ? '✅ Artist accepted!' : '❌ Application rejected')
      qc.invalidateQueries({ queryKey: ['gig-applications', id] })
      qc.invalidateQueries({ queryKey: ['venue-gigs'] })
      setSelected(null)
      setReviewType(null)
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Failed to update'),
  })

  const handleReview = () => {
    if (!selected || !reviewType) return
    reviewMutation.mutate({ appId: selected.id, status: reviewType, note: venueNote })
  }

  const statusBadge = (s: string) => ({
    PENDING: 'badge-pending',
    ACCEPTED: 'badge-accepted',
    REJECTED: 'badge-rejected',
    WITHDRAWN: 'bg-black/5 text-muted'
  }[s] ?? 'badge-pending')

  if (isLoading) return (
    <div className="px-6 md:px-24 py-12">
      <div className="animate-pulse space-y-3">
        {[...Array(4)].map((_, i) => <div key={i} className="card h-24" />)}
      </div>
    </div>
  )

  return (
    <div className="px-6 md:px-24 py-12">
      <div className="mb-8">
        <Link to="/venue/gigs" className="text-muted text-sm hover:text-gold mb-4 inline-block">← Back to Gigs</Link>
        <div className="section-label">Applications</div>
        <h1 className="section-title mb-2">{gig?.title}</h1>
        <p className="text-muted text-sm">
          {gig?.city} · {gig?.eventDate ? new Date(gig.eventDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : ''} · {gig?.slotsFilled}/{gig?.slotsAvailable} slots filled
        </p>
      </div>

      {!apps?.content.length ? (
        <div className="card p-16 text-center text-muted">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-lg font-display font-bold mb-2">No applications yet</p>
          <p className="text-sm">Artists will start applying once they discover your gig.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.content.map(app => (
            <div key={app.id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                {/* Artist info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {app.artist?.profileImageUrl ? (
                      <img
                        src={app.artist.profileImageUrl}
                        alt={app.artist.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-gold/20 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-xl flex-shrink-0">
                        🎤
                      </div>
                    )}
                    <div>
                      <p className="font-display font-bold">{app.artist?.fullName}</p>
                      <p className="text-xs text-muted">{app.artist?.artForm?.replace(/_/g, ' ')} · {app.artist?.city}</p>
                    </div>
                    <span className={`badge ${statusBadge(app.status)}`}>{app.status}</span>
                  </div>

                  <div className="flex gap-4 text-xs text-muted mb-3 ml-14">
                    <span>⭐ {app.artist?.rating?.toFixed(1) ?? '—'}</span>
                    <span>🎭 {app.artist?.totalShows ?? 0} shows</span>
                    <span>📅 Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN') : ''}</span>
                  </div>

                  {app.artist?.bio && (
                    <p className="text-sm text-muted font-light leading-relaxed mb-2 ml-14 max-w-lg">
                      {app.artist.bio}
                    </p>
                  )}
                  {app.note && (
                    <p className="text-xs text-muted italic ml-14">Artist's note: "{app.note}"</p>
                  )}
                  {app.venueNote && (
                    <p className="text-xs text-sage font-medium ml-14 mt-1">Your note: "{app.venueNote}"</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 self-start flex-shrink-0">
                  {app.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelected(app); setReviewType('ACCEPTED'); setVenueNote('') }}
                        className="bg-sage text-cream text-xs font-medium px-4 py-2 rounded-sm hover:opacity-90 transition-opacity"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => { setSelected(app); setReviewType('REJECTED'); setVenueNote('') }}
                        className="bg-rust/10 text-rust border border-rust/20 text-xs font-medium px-4 py-2 rounded-sm hover:bg-rust/20 transition-colors"
                      >
                        ✕ Decline
                      </button>
                    </div>
                  )}
                  {app.status === 'ACCEPTED' && app.artist && (
                    <button
                      onClick={() => setReviewApp(app)}
                      className="btn-gold py-2 px-4 text-sm"
                    >
                      ⭐ Rate Artist
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accept / Reject Modal */}
      <Modal open={!!selected && !!reviewType} onClose={() => { setSelected(null); setReviewType(null) }}>
        {selected && reviewType && (
          <div>
            <div className={`text-5xl mb-4 ${reviewType === 'ACCEPTED' ? 'text-sage' : 'text-rust'}`}>
              {reviewType === 'ACCEPTED' ? '✅' : '❌'}
            </div>
            <h3 className="font-display text-xl font-bold mb-1">
              {reviewType === 'ACCEPTED' ? 'Accept' : 'Decline'} {selected.artist?.fullName}?
            </h3>
            <p className="text-muted text-sm mb-6">
              {reviewType === 'ACCEPTED'
                ? 'This will fill one slot and notify the artist. You can add a note with any details.'
                : 'The artist will be notified. You can include a brief reason.'}
            </p>
            <div className="mb-5">
              <label className="form-label">
                Message to artist <span className="normal-case font-normal">(optional)</span>
              </label>
              <textarea
                value={venueNote}
                onChange={e => setVenueNote(e.target.value)}
                rows={3}
                placeholder={reviewType === 'ACCEPTED'
                  ? "e.g. Great profile! Please arrive 30 mins early for soundcheck."
                  : "e.g. We're looking for a different style for this show."}
                className="form-input resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReview}
                disabled={reviewMutation.isPending}
                className={reviewType === 'ACCEPTED'
                  ? 'btn-primary'
                  : 'bg-rust text-cream px-6 py-3 rounded-sm text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60'}
              >
                {reviewMutation.isPending ? 'Saving...' : reviewType === 'ACCEPTED' ? '✓ Confirm Accept' : '✕ Confirm Decline'}
              </button>
              <button
                onClick={() => { setSelected(null); setReviewType(null) }}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Rate Artist Modal */}
      {reviewApp && reviewApp.artist && (
        <ReviewModal
          open={!!reviewApp}
          onClose={() => setReviewApp(null)}
          gigId={id!}
          gigTitle={gig?.title ?? ''}
          revieweeId={reviewApp.artist.id}
          revieweeName={reviewApp.artist.fullName ?? 'Artist'}
          revieweeRole="artist"
        />
      )}
    </div>
  )
}