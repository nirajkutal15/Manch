import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { artistService } from '@/services'
import { ART_FORM_LABELS, type ArtForm } from '@/types'
export default function ArtistPublicProfile() {
  const { id } = useParams<{id:string}>()
  const { data, isLoading } = useQuery({ queryKey:['artist',id], queryFn:()=>artistService.get(id!), enabled:!!id })
  if(isLoading) return <div className="px-6 md:px-24 py-20 animate-pulse"><div className="flex gap-6 mb-8"><div className="w-24 h-24 rounded-full bg-gold/10"/><div className="space-y-2 flex-1"><div className="h-8 bg-black/5 rounded w-48"/><div className="h-4 bg-black/5 rounded w-32"/></div></div></div>
  if(!data) return <div className="px-6 md:px-24 py-20 text-center"><p className="text-4xl mb-4">🎤</p><p className="text-lg font-display font-bold">Artist not found</p><Link to="/gigs" className="btn-primary mt-4">Browse Gigs</Link></div>
  const { profile, reviews } = data
  return (
    <div className="px-6 md:px-24 py-12 max-w-3xl">
      <Link to="/gigs" className="text-muted text-sm hover:text-gold mb-6 inline-block">← Back to Gigs</Link>
      <div className="flex items-start gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center text-4xl flex-shrink-0">🎤</div>
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">{profile.fullName}</h1>
          <p className="text-muted mb-2">{profile.artForm ? ART_FORM_LABELS[profile.artForm as ArtForm] : ''} · {profile.city}</p>
          <div className="flex gap-4 text-sm">
            <span className="text-gold font-medium">⭐ {profile.rating?.toFixed(1) ?? '—'}</span>
            <span className="text-muted">🎭 {profile.totalShows ?? 0} shows</span>
            {profile.yearsExperience ? <span className="text-muted">📅 {profile.yearsExperience} years</span> : null}
          </div>
        </div>
      </div>
      {profile.bio && <div className="card p-6 mb-8"><h2 className="font-display font-bold text-lg mb-3">About</h2><p className="text-muted leading-relaxed">{profile.bio}</p></div>}
      {profile.sampleClipUrl && <div className="card p-6 mb-8"><h2 className="font-display font-bold text-lg mb-3">Sample Work</h2><a href={profile.sampleClipUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline break-all">{profile.sampleClipUrl}</a></div>}
      {(reviews as any[]).length > 0 && (
        <div>
          <h2 className="font-display font-bold text-xl mb-4">Reviews</h2>
          <div className="space-y-4">
            {(reviews as any[]).map((r:any) => (
              <div key={r.id} className="card p-5">
                <div className="flex justify-between items-start mb-2">
                  <div><p className="font-medium text-sm">{r.reviewerName}</p><p className="text-xs text-muted">{r.gigTitle}</p></div>
                  <span className="text-gold font-medium">{'⭐'.repeat(r.rating)}</span>
                </div>
                {r.comment && <p className="text-sm text-muted italic">"{r.comment}"</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
