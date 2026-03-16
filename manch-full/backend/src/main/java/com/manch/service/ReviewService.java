package com.manch.service;

import com.manch.dto.request.ReviewRequest;
import java.util.List;
import java.util.Map;

public interface ReviewService {
    Map<String, Object> submitReview(ReviewRequest req);
    List<Map<String, Object>> getReviewsForUser(String userId);
    Map<String, Object> canReview(String gigId, String revieweeId);
}