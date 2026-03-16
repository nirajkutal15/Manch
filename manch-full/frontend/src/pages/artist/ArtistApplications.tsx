import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationService } from '@/services'
import toast from 'react-hot-toast'
import ReviewModal from '@/components/common/ReviewModal'
import type { ApplicationResponse } from '@/types'

export default function ArtistApplications() {
  const qc = useQueryClient()
  const [reviewApp, setReviewApp] = useState<ApplicationResponse | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.mine()
  })

  const withdraw = useMutation({
    mutationFn: (id: string) => applicationService.withdraw(id),
    onSuccess: () => {
      toast.success('Application withdrawn')
      qc.invalidateQueries({ queryKey: ['my-applications'] })
    }
  })

  const statusColor = (s: string) => ({
    PENDING: 'badge-pending',
    ACCEPTED: 'badge-accepted',
    REJECTED: 'badge-rejected',
    WITHDRAWN: 'bg-black/5 text-muted'
  }[s] ?? 'badge-pending')

  if (isLoading) return (
    <div className="px-6 md:px-24 py-12">
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => <div key={i} className="card h-24" />)}
      </div>
    </div>
  )

  return (
    <div className="px-6 md:px-24 py-12">
      <div className="mb-10">
        <div className="section-label">My Applications</div>
        <h1 className="section-title">
          {data?.totalElements ?? 0} Application{data?.totalElements !== 1 ? 's' : ''}
        </h1>
      </div>

      {!data?.content.length ? (
        <div className="card p-12 text-center text-muted">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-lg font-display font-bold mb-2">No applications yet</p>
          <p className="text-sm">Browse gigs and apply to find your next stage.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.content.map(app => (
            <div key={app.id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-display font-bold text-lg">{app.gig?.title}</span>
                    <span className={`badge ${statusColor(app.status)}`}>{app.status}</span>
                  </div>
                  <p className="text-sm text-muted">
                    {app.gig?.gigType?.replace(/_/g, ' ')} · {app.gig?.city} · {app.gig?.eventDate
                      ? new Date(app.gig.eventDate).toLocaleDateString('en-IN', {
                          weekday: 'short', day: 'numeric', month: 'short'
                        })
                      : ''}
                  </p>
                  {app.note && (
                    <p className="text-xs text-muted mt-2 italic">Your note: "{app.note}"</p>
                  )}
                  {app.venueNote && (
                    <p className="text-xs text-sage mt-1 font-medium">Venue said: "{app.venueNote}"</p>
                  )}
                  <p className="text-xs text-muted/60 mt-1">
                    Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN') : ''}
                  </p>
                </div>

                <div className="flex flex-col gap-2 self-start">
                  {app.status === 'PENDING' && (
                    <button
                      onClick={() => withdraw.mutate(app.id)}
                      disabled={withdraw.isPending}
                      className="btn-outline py-2 px-4 text-sm"
                    >
                      Withdraw
                    </button>
                  )}
                  {app.status === 'ACCEPTED' && app.gig?.id && (
                    <button
                      onClick={() => setReviewApp(app)}
                      className="btn-gold py-2 px-4 text-sm"
                    >
                      ⭐ Rate Venue
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewApp && reviewApp.gig && (
        <ReviewModal
          open={!!reviewApp}
          onClose={() => setReviewApp(null)}
          gigId={reviewApp.gig.id}
          gigTitle={reviewApp.gig.title}
          revieweeId={reviewApp.gig.id}
          revieweeName="the Venue"
          revieweeRole="venue"
        />
      )}
    </div>
  )
}