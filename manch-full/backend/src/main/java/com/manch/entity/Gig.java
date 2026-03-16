package com.manch.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "gigs")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Gig {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private String id;
    @Column(nullable = false) private String title;
    @Column(length = 3000) private String description;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "posted_by_id", nullable = false) private User postedBy;
    @Column(nullable = false) private String city;
    private String venue;
    private String address;
    @Column(nullable = false) private LocalDate eventDate;
    private LocalTime eventTime;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private GigType gigType;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private PayType payType;
    private Integer payAmount;
    @Column(nullable = false, columnDefinition = "int default 1") private Integer slotsAvailable = 1;
    @Column(nullable = false, columnDefinition = "int default 0") private Integer slotsFilled = 0;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private GigStatus status = GigStatus.OPEN;
    private String requirements;
    private Integer durationMinutes;
    @ElementCollection @Enumerated(EnumType.STRING)
    @CollectionTable(name = "gig_art_forms", joinColumns = @JoinColumn(name = "gig_id"))
    @Column(name = "art_form") private List<User.ArtForm> preferredArtForms = new ArrayList<>();
    @OneToMany(mappedBy = "gig", cascade = CascadeType.ALL) private List<Application> applications = new ArrayList<>();
    @OneToMany(mappedBy = "gig") private List<Review> reviews = new ArrayList<>();
    @CreatedDate @Column(updatable = false) private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;

    public enum GigType { OPEN_MIC, COLLEGE_FEST, CORPORATE_SHOW, CAFE_NIGHT, COMMUNITY_EVENT, POETRY_SLAM, CULTURAL_EVENT, OTHER }
    public enum PayType { FREE, PAID, NEGOTIABLE }
    public enum GigStatus { OPEN, CLOSED, CANCELLED, COMPLETED }
}
