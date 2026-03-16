import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { apiClient } from '@/services/apiClient'
import Modal from '@/components/ui/Modal'
import StarRating from '@/components/ui/StarRating'

interface Props {
  open: boolean
  onClose: () => void
  gigId: string
  gigTitle: string
  revieweeId: string
  revieweeName: string
  revieweeRole: 'artist' | 'venue'
}

export default function ReviewModal({
  open, onClose, gigId, gigTitle, revieweeId, revieweeName, revieweeRole
}: Props) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [success, setSuccess] = useState(false)
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => apiClient.post('/reviews', {
      gigId,
      revieweeId,
      rating,
      comment,
    }).then(r => r.data),
    onSuccess: (data) => {
      setSuccess(true)
      toast.success('Review submitted! ⭐')
      qc.invalidateQueries({ queryKey: ['my-applications'] })
      qc.invalidateQueries({ queryKey: ['venue-gigs'] })
      qc.invalidateQueries({ queryKey: ['gig-applications'] })
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message ?? 'Failed to submit review')
    }
  })

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSuccess(false)
      setRating(0)
      setComment('')
    }, 300)
  }

  return (
    <Modal open={open} onClose={handleClose}>
      {success ? (
        <div className="text-center py-4">
          <span className="text-6xl block mb-4 animate-pop">⭐</span>
          <h3 className="font-display text-2xl font-bold mb-2">Review Submitted!</h3>
          <p className="text-muted text-sm">
            Your review for <strong>{revieweeName}</strong> has been saved.
          </p>
          <button onClick={handleClose} className="btn-primary w-full justify-center mt-6">
            Close
          </button>
        </div>
      ) : (
        <div>
          <div className="text-4xl mb-4">{revieweeRole === 'artist' ? '🎤' : '🏛️'}</div>
          <h3 className="font-display text-xl font-bold mb-1">
            Rate {revieweeName}
          </h3>
          <p className="text-muted text-sm mb-6">
            For: <strong>{gigTitle}</strong>
          </p>

          <div className="mb-6">
            <label className="form-label mb-3 block">Your Rating *</label>
            <StarRating value={rating} onChange={setRating} size="lg" />
            {rating === 0 && (
              <p className="text-muted text-xs mt-2">Click a star to rate</p>
            )}
            {rating > 0 && (
              <p className="text-gold text-xs mt-2 font-medium">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="form-label">Comment <span className="normal-case font-normal text-muted">(optional)</span></label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              placeholder={revieweeRole === 'artist'
                ? "How was the performance? Would you book them again?"
                : "How was the venue? Would you perform there again?"
              }
              className="form-input resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => mutation.mutate()}
              disabled={rating === 0 || mutation.isPending}
              className="btn-primary flex-1 justify-center"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Review ⭐'}
            </button>
            <button onClick={handleClose} className="btn-outline px-6">
              Cancel
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}