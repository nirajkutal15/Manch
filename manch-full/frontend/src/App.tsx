import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadMe } from '@/store/slices/authSlice'
import type { AppDispatch } from '@/store'

import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import RegisterArtistPage from '@/pages/auth/RegisterArtistPage'
import RegisterVenuePage from '@/pages/auth/RegisterVenuePage'
import GigsPage from '@/pages/GigsPage'
import ArtistPublicProfile from '@/pages/ArtistPublicProfile'

import ArtistDashboard from '@/pages/artist/ArtistDashboard'
import ArtistProfile from '@/pages/artist/ArtistProfile'
import ArtistApplications from '@/pages/artist/ArtistApplications'
import BrowseGigs from '@/pages/artist/BrowseGigs'

import VenueDashboard from '@/pages/venue/VenueDashboard'
import VenueGigs from '@/pages/venue/VenueGigs'
import PostGig from '@/pages/venue/PostGig'
import EditGig from '@/pages/venue/EditGig'
import GigApplications from '@/pages/venue/GigApplications'
import VenueProfile from '@/pages/venue/VenueProfile'

import ProtectedRoute from '@/components/common/ProtectedRoute'
import PageLayout from '@/components/layout/PageLayout'
import NotFoundPage from '@/pages/NotFoundPage'
import BrowseArtists from '@/pages/venue/BrowseArtists'

function AppInit() {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      dispatch(loadMe()).unwrap().catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })
    }
  }, [dispatch])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/artist" element={<RegisterArtistPage />} />
        <Route path="/register/venue" element={<RegisterVenuePage />} />

        <Route element={<PageLayout />}>
          <Route path="/gigs" element={<GigsPage />} />
          <Route path="/artists/:id" element={<ArtistPublicProfile />} />
        </Route>

        {/* Artist protected */}
        <Route element={<ProtectedRoute role="ARTIST" />}>
          <Route element={<PageLayout />}>
            <Route path="/artist/dashboard" element={<ArtistDashboard />} />
            <Route path="/artist/profile" element={<ArtistProfile />} />
            <Route path="/artist/applications" element={<ArtistApplications />} />
            <Route path="/artist/gigs" element={<BrowseGigs />} />
          </Route>
        </Route>

        {/* Venue protected */}
        <Route element={<ProtectedRoute role="VENUE" />}>
          <Route element={<PageLayout />}>
            <Route path="/venue/dashboard" element={<VenueDashboard />} />
            <Route path="/venue/gigs" element={<VenueGigs />} />
            <Route path="/venue/gigs/new" element={<PostGig />} />
            <Route path="/venue/gigs/:id/edit" element={<EditGig />} />
            <Route path="/venue/gigs/:id/applications" element={<GigApplications />} />
            <Route path="/venue/profile" element={<VenueProfile />} />
            <Route path="/venue/artists" element={<BrowseArtists />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}