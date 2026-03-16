package com.manch.repository;
import com.manch.entity.Application;
import com.manch.entity.Gig;
import com.manch.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {
    Page<Application> findByArtist(User artist, Pageable pageable);
    Page<Application> findByGig(Gig gig, Pageable pageable);
    Optional<Application> findByGigAndArtist(Gig gig, User artist);
    boolean existsByGigAndArtist(Gig gig, User artist);
    long countByGigAndStatus(Gig gig, Application.ApplicationStatus status);
}
