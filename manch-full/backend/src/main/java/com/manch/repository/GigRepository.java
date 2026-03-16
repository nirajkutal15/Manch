package com.manch.repository;

import com.manch.entity.Gig;
import com.manch.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GigRepository extends JpaRepository<Gig, String> {

    @Query("SELECT g FROM Gig g WHERE g.status = 'OPEN' " +
            "AND (:city IS NULL OR LOWER(g.city) = LOWER(:city)) " +
            "AND (:gigType IS NULL OR g.gigType = :gigType) " +
            "AND (:payType IS NULL OR g.payType = :payType) " +
            "ORDER BY g.eventDate ASC")
    Page<Gig> findFiltered(
            @Param("city") String city,
            @Param("gigType") Gig.GigType gigType,
            @Param("payType") Gig.PayType payType,
            Pageable pageable
    );

    Page<Gig> findByPostedBy(User postedBy, Pageable pageable);

    Page<Gig> findByPostedByAndStatus(User postedBy, Gig.GigStatus status, Pageable pageable);
}