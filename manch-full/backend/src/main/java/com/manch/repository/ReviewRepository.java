package com.manch.repository;
import com.manch.entity.Review;
import com.manch.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByReviewee(User reviewee);
    boolean existsByReviewerIdAndRevieweeIdAndGigId(String reviewerId, String revieweeId, String gigId);
    @Query("SELECT COALESCE(AVG(r.rating),0.0) FROM Review r WHERE r.reviewee=:user")
    Double getAverageRating(@Param("user") User user);
}
