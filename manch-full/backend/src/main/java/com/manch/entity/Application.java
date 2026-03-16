package com.manch.entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.Instant;
@Entity @Table(name="applications", uniqueConstraints=@UniqueConstraint(columnNames={"gig_id","artist_id"}))
@EntityListeners(AuditingEntityListener.class) @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Application {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private String id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="gig_id",nullable=false) private Gig gig;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="artist_id",nullable=false) private User artist;
    @Column(length=1000) private String note;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private ApplicationStatus status = ApplicationStatus.PENDING;
    private String venueNote;
    @CreatedDate @Column(updatable=false) private Instant appliedAt;
    private Instant reviewedAt;
    public enum ApplicationStatus { PENDING, ACCEPTED, REJECTED, WITHDRAWN }
}
