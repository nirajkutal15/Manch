package com.manch.entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.Instant;
@Entity @Table(name="contact_messages")
@EntityListeners(AuditingEntityListener.class) @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContactMessage {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private String id;
    @Column(nullable=false) private String fullName;
    @Column(nullable=false) private String email;
    @Column(nullable=false,length=3000) private String message;
    @CreatedDate @Column(updatable=false) private Instant createdAt;
}
