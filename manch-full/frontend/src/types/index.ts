// ── Auth ────────────────────────────────────────────────────
export type UserRole = 'ARTIST' | 'VENUE' | 'ADMIN'

export type ArtForm =
  | 'STANDUP_COMEDY' | 'POETRY' | 'SPOKEN_WORD' | 'STORYTELLING'
  | 'MIMICRY' | 'IMPROV' | 'SINGER_SONGWRITER' | 'DANCE'
  | 'STREET_MAGIC' | 'INSTRUMENTAL' | 'MONOLOGUE' | 'VISUAL_LIVE_ART' | 'OTHER'

export type VenueType =
  | 'CAFE_RESTAURANT' | 'COLLEGE_UNIVERSITY' | 'CORPORATE'
  | 'COMMUNITY_SPACE' | 'BAR_LOUNGE' | 'OUTDOOR_FESTIVAL' | 'OTHER'

export interface UserDto {
  id: string; email: string; fullName: string; role: UserRole; city: string; phone?: string;
  artForm?: ArtForm; bio?: string; profileImageUrl?: string; sampleClipUrl?: string;
  yearsExperience?: number; totalShows?: number; rating?: number;
  venueName?: string; venueType?: VenueType; websiteUrl?: string; emailVerified: boolean;
}

export interface AuthResponse {
  accessToken: string; refreshToken: string; tokenType: string; user: UserDto;
}

// ── Gig ────────────────────────────────────────────────────
export type GigType = 'OPEN_MIC' | 'COLLEGE_FEST' | 'CORPORATE_SHOW' | 'CAFE_NIGHT' | 'COMMUNITY_EVENT' | 'POETRY_SLAM' | 'CULTURAL_EVENT' | 'OTHER'
export type PayType = 'FREE' | 'PAID' | 'NEGOTIABLE'
export type GigStatus = 'OPEN' | 'CLOSED' | 'CANCELLED' | 'COMPLETED'

export interface GigResponse {
  id: string; title: string; description?: string; city: string; venue?: string; address?: string;
  eventDate: string; eventTime?: string; gigType: GigType; payType: PayType; status: GigStatus;
  payAmount?: number; slotsAvailable: number; slotsFilled: number; durationMinutes?: number;
  requirements?: string; preferredArtForms?: ArtForm[];
  postedBy?: { id: string; fullName: string; venueName?: string; city: string; };
  createdAt?: string;
}

// ── Application ─────────────────────────────────────────────
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'

export interface ApplicationResponse {
  id: string; status: ApplicationStatus; note?: string; venueNote?: string; appliedAt?: string;
  gig?: { id: string; title: string; city: string; eventDate: string; gigType: string; };
  artist?: { id: string; fullName: string; artForm?: string; city: string; bio?: string; profileImageUrl?: string; rating?: number; totalShows?: number; };
}

// ── Pagination ──────────────────────────────────────────────
export interface Page<T> {
  content: T[]; totalElements: number; totalPages: number; number: number; size: number; last: boolean;
}

// ── Labels ──────────────────────────────────────────────────
export const ART_FORM_LABELS: Record<ArtForm, string> = {
  STANDUP_COMEDY: '🎤 Stand-up Comedy', POETRY: '✍️ Poetry', SPOKEN_WORD: '🗣️ Spoken Word',
  STORYTELLING: '📖 Storytelling', MIMICRY: '🎭 Mimicry', IMPROV: '🎪 Improv',
  SINGER_SONGWRITER: '🎵 Singer-Songwriter', DANCE: '💃 Dance', STREET_MAGIC: '🪄 Street Magic',
  INSTRUMENTAL: '🎶 Instrumental', MONOLOGUE: '🎬 Monologue', VISUAL_LIVE_ART: '🖼️ Visual Art', OTHER: '➕ Other'
}

export const GIG_TYPE_LABELS: Record<GigType, string> = {
  OPEN_MIC: 'Open Mic', COLLEGE_FEST: 'College Fest', CORPORATE_SHOW: 'Corporate Show',
  CAFE_NIGHT: 'Cafe Night', COMMUNITY_EVENT: 'Community Event', POETRY_SLAM: 'Poetry Slam',
  CULTURAL_EVENT: 'Cultural Event', OTHER: 'Other'
}

export const CITIES = ['Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Other']
