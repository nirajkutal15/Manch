package com.manch.controller;
import com.manch.dto.response.ApplicationResponse;
import com.manch.service.GigService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/applications") @RequiredArgsConstructor @Tag(name="Applications") @SecurityRequirement(name="bearerAuth")
public class ApplicationController {
    private final GigService gigService;
    @GetMapping("/mine") @PreAuthorize("hasRole('ARTIST')") public ResponseEntity<Page<ApplicationResponse>> mine(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size) { return ResponseEntity.ok(gigService.getMyApplications(PageRequest.of(page,size,Sort.by("appliedAt").descending()))); }
    @PatchMapping("/{id}/review") @PreAuthorize("hasRole('VENUE')") public ResponseEntity<ApplicationResponse> review(@PathVariable String id,@RequestBody Map<String,String> body) { return ResponseEntity.ok(gigService.reviewApplication(id,body.get("status"),body.get("venueNote"))); }
    @PatchMapping("/{id}/withdraw") @PreAuthorize("hasRole('ARTIST')") public ResponseEntity<ApplicationResponse> withdraw(@PathVariable String id) { return ResponseEntity.ok(gigService.withdrawApplication(id)); }
}
