package com.manch.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class ReviewRequest {
    @NotBlank private String gigId;
    @NotBlank private String revieweeId;
    @NotNull @Min(1) @Max(5) private Integer rating;
    private String comment;
}
