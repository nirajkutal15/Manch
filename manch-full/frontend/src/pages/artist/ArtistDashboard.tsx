import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { applicationService, gigService } from '@/services'
import { apiClient } from '@/services/apiClient'
import { GIG_TYPE_LABELS } from '@/types'
import StarRating from '@/components/ui/StarRating'

const SkeletonStat = () => (
  <div className="card p-6 animate-pulse">
    <div className="h-8 w-8 bg-gold/10 rounded mb-3" />
    <div className="h-6 bg-gold/10 rounded w-1/2 mb-2" />
    <div className="h-3 bg-gold/10 rounded w-3/4" />
  </div>
)

const SkeletonCard = () => (
  <div className="card p-4 animate-pulse">
    <div className="h-3 bg-gold/10 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gold/10 rounded w-1/2" />
  </div>
)

export default function ArtistDashboard() {
  const { user } = useAuth()

  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.mine({ size: 5 }),
  })

  const { data: gigs, isLoading: gigsLoading } = useQuery({
    queryKey: ['gigs-dashboard'],
    queryFn: () => gigService.list({ size: 3, city: user?.city }),
  })

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['my-reviews', user?.id],
    queryFn: () => apiClient.get(`/reviews/user/${user!.id}`).then(r => r.data),
    enabled: !!user?.id,
  })

  const stats = [
    { icon: '🎭', label: 'Shows Performed', value: user?.totalShows ?? 0 },
    { icon: '⭐', label: 'Average Rating', value: user?.rating ? user.rating.toFixed(1) : '—' },
    { icon: '📝', label: 'Applications', value: apps?.totalElements ?? '—' },
    { icon: '🏙️', label: 'City', value: user?.city ?? '—' },
  ]

  const statusColor = (s: string) => ({
    PENDING: 'badge-pending',
    ACCEPTED: 'badge-accepted',
    REJECTED: 'badge-rejected',
    WITHDRAWN: 'bg-black/5 text-muted'
  }[s] ?? 'badge-pending')

  return (
    <div className="px-6 md:px-24 py-12">
      <div className="mb-10">
        <div className="section-label">Artist Dashboard</div>
        <div className="flex items-center gap-4 mb-2">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt={user.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-gold/20" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center text-3xl">🎤</div>
          )}
          <div>
            <h1 className="section-title mb-1">Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
            <p className="text-muted font-light">{user?.artForm?.replace(/_/g, ' ')} · {user?.city}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {appsLoading
          ? [...Array(4)].map((_, i) => <SkeletonStat key={i} />)
          : stats.map(s => (
              <div key={s.label} className="card p-6">
                <span className="text-2xl block mb-3">{s.icon}</span>
                <div className="font-display text-3xl font-bold">{s.value}</div>
                <div className="text-xs text-muted uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))
        }
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Recent Applications */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-bold">Recent Applications</h2>
            <Link to="/artist/applications" className="text-gold text-sm hover:underline">View all →</Link>
          </div>
          {appsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : !apps?.content.length ? (
            <div className="card p-8 text-center text-muted">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-sm mb-3">No applications yet</p>
              <Link to="/artist/gigs" className="btn-primary text-sm">Browse Gigs →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {apps.content.map(app => (
                <div key={app.id} className="card p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{app.gig?.title}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {app.gig?.city} · {app.gig?.eventDate
                        ? new Date(app.gig.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                        : ''}
                    </p>
                  </div>
                  <span className={`badge ${statusColor(app.status)}`}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gigs Near You */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-bold">Gigs Near You</h2>
            <Link to="/artist/gigs" className="text-gold text-sm hover:underline">Browse all →</Link>
          </div>
          <div className="space-y-3">
            {gigsLoading
              ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
              : gigs?.content.map(g => (
                  <div key={g.id} className="card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="badge badge-open text-[10px] mb-1 inline-block">{GIG_TYPE_LABELS[g.gigType]}</span>
                        <p className="font-medium text-sm">{g.title}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {g.venue ?? g.city} · {new Date(g.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-sage">
                        {g.payType === 'FREE' ? 'Free' : g.payAmount ? `₹${g.payAmount.toLocaleString()}` : 'Neg.'}
                      </span>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviewsLoading ? (
        <div className="mb-12">
          <h2 className="font-display text-xl font-bold mb-4">Reviews Received ⭐</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      ) : reviews && reviews.length > 0 && (
        <div className="mb-12">
          <h2 className="font-display text-xl font-bold mb-4">Reviews Received ⭐</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {reviews.slice(0, 3).map((r: any) => (
              <div key={r.id} className="card p-5 relative">
                <span className="absolute top-2 left-4 font-display text-4xl text-gold/20 leading-none">"</span>
                <div className="mt-3 mb-3">
                  <StarRating value={r.rating} readonly size="sm" />
                </div>
                {r.comment && <p className="text-sm text-muted italic leading-relaxed mb-3">"{r.comment}"</p>}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center text-sm">🏛️</div>
                  <div>
                    <p className="text-xs font-medium">{r.reviewerName}</p>
                    <p className="text-xs text-muted">{r.gigTitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/artist/gigs" className="card p-6 text-center hover:border-gold hover:bg-[#FFF8ED] transition-all">
          <p className="text-3xl mb-3">🔍</p>
          <p className="font-display font-bold">Browse Gigs</p>
          <p className="text-xs text-muted mt-1">Find your next performance</p>
        </Link>
        <Link to="/artist/applications" className="card p-6 text-center hover:border-gold hover:bg-[#FFF8ED] transition-all">
          <p className="text-3xl mb-3">📋</p>
          <p className="font-display font-bold">My Applications</p>
          <p className="text-xs text-muted mt-1">Track all your applications</p>
        </Link>
        <Link to="/artist/profile" className="card p-6 text-center hover:border-gold hover:bg-[#FFF8ED] transition-all">
          <p className="text-3xl mb-3">👤</p>
          <p className="font-display font-bold">Edit Profile</p>
          <p className="text-xs text-muted mt-1">Update bio, clips & details</p>
        </Link>
      </div>
    </div>
  )
}