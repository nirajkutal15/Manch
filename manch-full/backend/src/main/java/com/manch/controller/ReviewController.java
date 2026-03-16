package com.manch.controller;

import com.manch.dto.request.ReviewRequest;
import com.manch.repository.ReviewRepository;
import com.manch.repository.UserRepository;
import com.manch.service.ReviewService;
import com.manch.dto.response.AuthResponse;
import com.manch.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews")
@SecurityRequirement(name = "bearerAuth")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepo;
    private final UserRepository userRepo;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> submit(@Valid @RequestBody ReviewRequest req) {
        return ResponseEntity.ok(reviewService.submitReview(req));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserReviews(@PathVariable String userId) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(userId));
    }

    @GetMapping("/can-review")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> canReview(
            @RequestParam String gigId,
            @RequestParam String revieweeId
    ) {
        return ResponseEntity.ok(reviewService.canReview(gigId, revieweeId));
    }
}