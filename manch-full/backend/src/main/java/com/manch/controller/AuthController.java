package com.manch.controller;
import com.manch.dto.request.*;
import com.manch.dto.response.AuthResponse;
import com.manch.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor @Tag(name="Auth")
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register") public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) { return ResponseEntity.status(201).body(authService.register(req)); }
    @PostMapping("/login") public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) { return ResponseEntity.ok(authService.login(req)); }
    @PostMapping("/refresh") public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String,String> body) { return ResponseEntity.ok(authService.refreshToken(body.get("refreshToken"))); }
    @GetMapping("/me") @PreAuthorize("isAuthenticated()") public ResponseEntity<AuthResponse.UserDto> me() { return ResponseEntity.ok(authService.getCurrentUser()); }
    @PatchMapping("/profile/{id}") @PreAuthorize("isAuthenticated()") public ResponseEntity<AuthResponse.UserDto> updateProfile(@PathVariable String id, @RequestBody Map<String,Object> updates) { return ResponseEntity.ok(authService.updateProfile(id, updates)); }
}
