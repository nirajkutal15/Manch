package com.manch.dto.request;
import com.manch.entity.User;
import com.manch.entity.WaitlistEntry;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class WaitlistRequest {
    @NotBlank private String fullName;
    @NotBlank @Email private String email;
    @NotBlank private String city;
    @NotNull private WaitlistEntry.WaitlistType type;
    private User.ArtForm artForm;
    private String bio;
    private String venueName;
    private User.VenueType venueType;
    private String phone;
}
