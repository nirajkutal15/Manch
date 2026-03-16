package com.manch.dto.response;
import com.manch.entity.Gig;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class GigResponse {
    private String id, title, description, city, venue, address;
    private LocalDate eventDate; private LocalTime eventTime;
    private String gigType, payType, status;
    private Integer payAmount, slotsAvailable, slotsFilled, durationMinutes;
    private String requirements;
    private List<String> preferredArtForms;
    private VenueInfo postedBy;
    private String createdAt;
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VenueInfo { private String id, fullName, venueName, city; }
    public static GigResponse from(Gig g) {
        return GigResponse.builder()
            .id(g.getId()).title(g.getTitle()).description(g.getDescription())
            .city(g.getCity()).venue(g.getVenue()).address(g.getAddress())
            .eventDate(g.getEventDate()).eventTime(g.getEventTime())
            .gigType(g.getGigType().name()).payType(g.getPayType().name()).status(g.getStatus().name())
            .payAmount(g.getPayAmount()).slotsAvailable(g.getSlotsAvailable()).slotsFilled(g.getSlotsFilled())
            .durationMinutes(g.getDurationMinutes()).requirements(g.getRequirements())
            .preferredArtForms(g.getPreferredArtForms()!=null?g.getPreferredArtForms().stream().map(Enum::name).collect(Collectors.toList()):List.of())
            .postedBy(g.getPostedBy()!=null?VenueInfo.builder().id(g.getPostedBy().getId()).fullName(g.getPostedBy().getFullName()).venueName(g.getPostedBy().getVenueName()).city(g.getPostedBy().getCity()).build():null)
            .createdAt(g.getCreatedAt()!=null?g.getCreatedAt().toString():null)
            .build();
    }
}
