package com.manch.repository;
import com.manch.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.role='ARTIST' AND u.active=true AND (:city IS NULL OR LOWER(u.city)=LOWER(:city)) AND (:artForm IS NULL OR u.artForm=:artForm)")
    Page<User> findArtists(@Param("city") String city, @Param("artForm") User.ArtForm artForm, Pageable pageable);
}
