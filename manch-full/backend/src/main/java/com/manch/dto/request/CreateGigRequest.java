package com.manch.dto.request;
import com.manch.entity.Gig;
import com.manch.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
@Data public class CreateGigRequest {
    @NotBlank @Size(max=200) private String title;
    private String description;
    @NotBlank private String city;
    private String venue;
    private String address;
    @NotNull private LocalDate eventDate;
    private LocalTime eventTime;
    @NotNull private Gig.GigType gigType;
    @NotNull private Gig.PayType payType;
    private Integer payAmount;
    @Min(1) @Max(50) private int slotsAvailable = 1;
    private String requirements;
    private Integer durationMinutes;
    private List<User.ArtForm> preferredArtForms;
}
