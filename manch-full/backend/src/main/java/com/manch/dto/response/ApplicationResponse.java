package com.manch.dto.response;

import com.manch.entity.Application;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApplicationResponse {

    private String id, status, note, venueNote, appliedAt;
    private GigInfo gig;
    private ArtistInfo artist;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class GigInfo {
        private String id, title, city, eventDate, gigType;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ArtistInfo {
        private String id, fullName, artForm, city, bio, profileImageUrl;
        private Double rating;
        private Integer totalShows;
    }

    public static ApplicationResponse from(Application a) {
        return ApplicationResponse.builder()
                .id(a.getId())
                .status(a.getStatus().name())
                .note(a.getNote())
                .venueNote(a.getVenueNote())
                .appliedAt(a.getAppliedAt() != null ? a.getAppliedAt().toString() : null)
                .gig(a.getGig() != null ? GigInfo.builder()
                        .id(a.getGig().getId())
                        .title(a.getGig().getTitle())
                        .city(a.getGig().getCity())
                        .eventDate(a.getGig().getEventDate().toString())
                        .gigType(a.getGig().getGigType().name())
                        .build() : null)
                .artist(a.getArtist() != null ? ArtistInfo.builder()
                        .id(a.getArtist().getId())
                        .fullName(a.getArtist().getFullName())
                        .artForm(a.getArtist().getArtForm() != null ? a.getArtist().getArtForm().name() : null)
                        .city(a.getArtist().getCity())
                        .bio(a.getArtist().getBio())
                        .profileImageUrl(a.getArtist().getProfileImageUrl())
                        .rating(a.getArtist().getRating())
                        .totalShows(a.getArtist().getTotalShows())
                        .build() : null)
                .build();
    }
}