package com.manch.dto.response;
import com.manch.entity.User;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserDto user;
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UserDto {
        private String id, email, fullName, role, city, phone;
        private String artForm, bio, profileImageUrl, sampleClipUrl;
        private Integer yearsExperience, totalShows;
        private Double rating;
        private String venueName, venueType, websiteUrl;
        private boolean emailVerified;
    }
    public static UserDto toDto(User u) {
        return UserDto.builder()
            .id(u.getId()).email(u.getEmail()).fullName(u.getFullName()).role(u.getRole().name())
            .city(u.getCity()).phone(u.getPhone())
            .artForm(u.getArtForm()!=null?u.getArtForm().name():null)
            .bio(u.getBio()).profileImageUrl(u.getProfileImageUrl()).sampleClipUrl(u.getSampleClipUrl())
            .yearsExperience(u.getYearsExperience()).totalShows(u.getTotalShows()).rating(u.getRating())
            .venueName(u.getVenueName()).venueType(u.getVenueType()!=null?u.getVenueType().name():null)
            .websiteUrl(u.getWebsiteUrl()).emailVerified(u.isEmailVerified())
            .build();
    }
}
