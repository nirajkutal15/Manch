package com.manch.entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.Instant;
@Entity @Table(name="waitlist_entries")
@EntityListeners(AuditingEntityListener.class) @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WaitlistEntry {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private String id;
    @Column(nullable=false) private String fullName;
    @Column(nullable=false,unique=true) private String email;
    @Column(nullable=false) private String city;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private WaitlistType type;
    @Enumerated(EnumType.STRING) private User.ArtForm artForm;
    private String bio;
    private String venueName;
    @Enumerated(EnumType.STRING) private User.VenueType venueType;
    private String phone;
    @Column(nullable=false,columnDefinition="boolean default false") private boolean notified=false;
    @CreatedDate @Column(updatable=false) private Instant joinedAt;
    public enum WaitlistType { ARTIST, VENUE }
}
