import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@/store/slices/authSlice'
import type { RootState, AppDispatch } from '@/store'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error, accessToken, user } = useSelector((s: RootState) => s.auth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  useEffect(() => {
    if (accessToken && user) {
      if (user.role === 'VENUE') {
        navigate('/venue/dashboard', { replace: true })
      } else if (user.role === 'ARTIST') {
        navigate('/artist/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [accessToken, user, navigate])

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      const loggedUser = result.payload.user
      if (loggedUser.role === 'VENUE') {
        navigate('/venue/dashboard', { replace: true })
      } else if (loggedUser.role === 'ARTIST') {
        navigate('/artist/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-4xl font-black">
            मंच<span className="text-gold">.</span>
          </Link>
          <p className="text-muted text-sm mt-3">Welcome back to the stage.</p>
        </div>

        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold mb-6">Sign in</h1>

          {error && (
            <p className="text-rust text-sm bg-rust/10 px-3 py-2 rounded-sm mb-4 border border-rust/20">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="form-label">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="form-input"
                autoComplete="email"
              />
              {isSubmitted && errors.email && (
                <p className="text-rust text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="form-input"
                autoComplete="current-password"
              />
              {isSubmitted && errors.password && (
                <p className="text-rust text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <div className="border-t border-black/5 mt-6 pt-5 text-center text-sm text-muted">
            <p className="mb-3">New to Manch?</p>
            <div className="flex gap-3">
              <Link
                to="/register/artist"
                className="flex-1 text-center py-2 border border-black/10 rounded-sm hover:border-gold hover:text-gold transition-all text-xs font-medium"
              >
                🎤 Join as Artist
              </Link>
              <Link
                to="/register/venue"
                className="flex-1 text-center py-2 border border-black/10 rounded-sm hover:border-gold hover:text-gold transition-all text-xs font-medium"
              >
                🏛️ Join as Venue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}