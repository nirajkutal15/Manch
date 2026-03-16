package com.manch.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false, unique = true) private String email;
    @Column(nullable = false) private String passwordHash;
    @Column(nullable = false) private String fullName;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private UserRole role;
    @Column(nullable = false) private String city;
    private String phone;
    @Column(nullable = false, columnDefinition = "boolean default false") private boolean emailVerified = false;
    @Column(nullable = false, columnDefinition = "boolean default true") private boolean active = true;
    // Artist fields
    @Enumerated(EnumType.STRING) private ArtForm artForm;
    @Column(length = 2000) private String bio;
    private String profileImageUrl;
    private String sampleClipUrl;
    @Column(columnDefinition = "int default 0") private Integer yearsExperience = 0;
    @Column(columnDefinition = "double default 0.0") private Double rating = 0.0;
    @Column(columnDefinition = "int default 0") private Integer totalShows = 0;
    // Venue fields
    private String venueName;
    @Enumerated(EnumType.STRING) private VenueType venueType;
    private String websiteUrl;
    // Relations
    @OneToMany(mappedBy = "postedBy", cascade = CascadeType.ALL) private List<Gig> postedGigs = new ArrayList<>();
    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL) private List<Application> applications = new ArrayList<>();
    // Audit
    @CreatedDate @Column(updatable = false) private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;

    public enum UserRole { ARTIST, VENUE, ADMIN }
    public enum ArtForm { STANDUP_COMEDY, POETRY, SPOKEN_WORD, STORYTELLING, MIMICRY, IMPROV, SINGER_SONGWRITER, DANCE, STREET_MAGIC, INSTRUMENTAL, MONOLOGUE, VISUAL_LIVE_ART, OTHER }
    public enum VenueType { CAFE_RESTAURANT, COLLEGE_UNIVERSITY, CORPORATE, COMMUNITY_SPACE, BAR_LOUNGE, OUTDOOR_FESTIVAL, OTHER }
}
