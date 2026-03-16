package com.manch.entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.Instant;
@Entity @Table(name="reviews", uniqueConstraints=@UniqueConstraint(columnNames={"reviewer_id","reviewee_id","gig_id"}))
@EntityListeners(AuditingEntityListener.class) @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private String id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="reviewer_id",nullable=false) private User reviewer;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="reviewee_id",nullable=false) private User reviewee;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="gig_id",nullable=false) private Gig gig;
    @Column(nullable=false) private Integer rating;
    @Column(length=1000) private String comment;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private ReviewType reviewType;
    @CreatedDate @Column(updatable=false) private Instant createdAt;
    public enum ReviewType { VENUE_TO_ARTIST, ARTIST_TO_VENUE }
}
