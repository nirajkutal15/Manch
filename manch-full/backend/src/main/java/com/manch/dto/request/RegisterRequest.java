package com.manch.dto.request;
import com.manch.entity.User;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;
@Builder
@Data
public class RegisterRequest {
    @NotBlank @Size(min=2,max=100) private String fullName;
    @NotBlank @Email private String email;
    @NotBlank @Size(min=8) private String password;
    @NotBlank private String city;
    @NotNull private User.UserRole role;
    private User.ArtForm artForm;
    private String bio;
    private String venueName;
    private User.VenueType venueType;
    private String phone;
}
