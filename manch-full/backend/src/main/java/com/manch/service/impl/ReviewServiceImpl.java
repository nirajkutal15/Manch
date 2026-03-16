package com.manch.service.impl;

import com.manch.dto.request.ReviewRequest;
import com.manch.entity.*;
import com.manch.exception.*;
import com.manch.repository.*;
import com.manch.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepo;
    private final UserRepository userRepo;
    private final GigRepository gigRepo;

    @Override
    @Transactional
    public Map<String, Object> submitReview(ReviewRequest req) {
        var reviewer = currentUser();
        var reviewee = userRepo.findById(req.getRevieweeId())
                .orElseThrow(() -> new ResourceNotFoundException("User", req.getRevieweeId()));
        var gig = gigRepo.findById(req.getGigId())
                .orElseThrow(() -> new ResourceNotFoundException("Gig", req.getGigId()));

        if (gig.getStatus() != Gig.GigStatus.COMPLETED)
            throw new BadRequestException("You can only review after the gig is completed");

        if (reviewRepo.existsByReviewerIdAndRevieweeIdAndGigId(
                reviewer.getId(), reviewee.getId(), gig.getId()))
            throw new ConflictException("You have already reviewed this person for this gig");

        var reviewType = reviewer.getRole() == User.UserRole.VENUE
                ? Review.ReviewType.VENUE_TO_ARTIST
                : Review.ReviewType.ARTIST_TO_VENUE;

        reviewRepo.save(Review.builder()
                .reviewer(reviewer).reviewee(reviewee).gig(gig)
                .rating(req.getRating()).comment(req.getComment())
                .reviewType(reviewType).build());

        Double avg = reviewRepo.getAverageRating(reviewee);
        reviewee.setRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        userRepo.save(reviewee);

        return Map.of(
                "message", "Review submitted successfully",
                "newRating", reviewee.getRating()
        );
    }

    @Override
    public List<Map<String, Object>> getReviewsForUser(String userId) {
        var user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        return reviewRepo.findByReviewee(user).stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", r.getId());
            m.put("rating", r.getRating());
            m.put("comment", r.getComment());
            m.put("reviewType", r.getReviewType().name());
            m.put("createdAt", r.getCreatedAt());
            m.put("reviewerName", r.getReviewer().getFullName());
            m.put("reviewerId", r.getReviewer().getId());
            m.put("gigTitle", r.getGig().getTitle());
            m.put("gigId", r.getGig().getId());
            return m;
        }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> canReview(String gigId, String revieweeId) {
        var reviewer = currentUser();
        boolean already = reviewRepo.existsByReviewerIdAndRevieweeIdAndGigId(
                reviewer.getId(), revieweeId, gigId);
        var gig = gigRepo.findById(gigId)
                .orElseThrow(() -> new ResourceNotFoundException("Gig", gigId));
        boolean completed = gig.getStatus() == Gig.GigStatus.COMPLETED;
        return Map.of(
                "canReview", !already && completed,
                "alreadyReviewed", already,
                "gigCompleted", completed
        );
    }

    private User currentUser() {
        return userRepo.findByEmail(
                SecurityContextHolder.getContext().getAuthentication().getName()
        ).orElseThrow(() -> new BadRequestException("Not authenticated"));
    }
}