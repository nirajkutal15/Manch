package com.manch.controller;
import com.manch.dto.request.WaitlistRequest;
import com.manch.service.WaitlistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/waitlist") @RequiredArgsConstructor @Tag(name="Waitlist")
public class WaitlistController {
    private final WaitlistService waitlistService;
    @PostMapping public ResponseEntity<Map<String,Object>> join(@Valid @RequestBody WaitlistRequest req) { return ResponseEntity.status(201).body(waitlistService.joinWaitlist(req)); }
}
