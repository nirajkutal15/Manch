package com.manch.controller;

import com.manch.dto.request.CreateGigRequest;
import com.manch.dto.response.ApplicationResponse;
import com.manch.dto.response.GigResponse;
import com.manch.entity.Gig;
import com.manch.service.GigService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gigs")
@RequiredArgsConstructor
@Tag(name = "Gigs")
public class GigController {

    private final GigService gigService;

    @GetMapping
    public ResponseEntity<Page<GigResponse>> list(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String gigType,
            @RequestParam(required = false) String payType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Gig.GigType gt = null;
        Gig.PayType pt = null;
        try { if (gigType != null && !gigType.isEmpty()) gt = Gig.GigType.valueOf(gigType); } catch (Exception ignored) {}
        try { if (payType != null && !payType.isEmpty()) pt = Gig.PayType.valueOf(payType); } catch (Exception ignored) {}
        return ResponseEntity.ok(gigService.findGigs(
                city, gt, pt,
                PageRequest.of(page, size, Sort.by("eventDate").ascending())
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GigResponse> get(@PathVariable String id) {
        return ResponseEntity.ok(gigService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('VENUE')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<GigResponse> create(@Valid @RequestBody CreateGigRequest req) {
        return ResponseEntity.status(201).body(gigService.createGig(req));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('VENUE')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<GigResponse> update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(gigService.updateGig(id, body));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('VENUE')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> cancel(@PathVariable String id) {
        gigService.cancelGig(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('VENUE')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Page<GigResponse>> mine(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(gigService.getVenueGigs(
                PageRequest.of(page, size, Sort.by("eventDate").descending())
        ));
    }

    @PostMapping("/{id}/apply")
    @PreAuthorize("hasRole('ARTIST')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApplicationResponse> apply(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        return ResponseEntity.status(201).body(
                gigService.applyToGig(id, body != null ? body.get("note") : null)
        );
    }

    @GetMapping("/{id}/applications")
    @PreAuthorize("hasRole('VENUE')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Page<ApplicationResponse>> applications(
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(gigService.getApplicationsForGig(id, PageRequest.of(page, size)));
    }
}