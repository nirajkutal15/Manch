package com.manch.repository;
import com.manch.entity.WaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface WaitlistRepository extends JpaRepository<WaitlistEntry, String> {
    boolean existsByEmail(String email);
}
