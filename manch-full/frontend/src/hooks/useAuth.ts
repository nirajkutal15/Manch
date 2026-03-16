import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
export function useAuth() {
  const { user, accessToken } = useSelector((s:RootState) => s.auth)
  return { user, accessToken, isLoggedIn:!!accessToken, isArtist:user?.role==='ARTIST', isVenue:user?.role==='VENUE', isAdmin:user?.role==='ADMIN' }
}
