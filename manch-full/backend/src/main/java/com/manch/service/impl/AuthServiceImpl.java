package com.manch.service.impl;
import com.manch.dto.request.*;
import com.manch.dto.response.AuthResponse;
import com.manch.entity.User;
import com.manch.exception.*;
import com.manch.repository.UserRepository;
import com.manch.security.JwtUtil;
import com.manch.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
@Service @RequiredArgsConstructor @Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final UserDetailsService uds;
    @Override @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) throw new ConflictException("Email already registered");
        var user = User.builder()
            .email(req.getEmail().toLowerCase().trim()).passwordHash(encoder.encode(req.getPassword()))
            .fullName(req.getFullName().trim()).role(req.getRole()).city(req.getCity())
            .artForm(req.getArtForm()).bio(req.getBio()).venueName(req.getVenueName())
            .venueType(req.getVenueType()).phone(req.getPhone())
            .emailVerified(false).active(true).rating(0.0).totalShows(0).yearsExperience(0).build();
        userRepo.save(user);
        log.info("Registered: {} ({})", user.getEmail(), user.getRole());
        return buildResponse(user);
    }
    @Override
    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        var user = userRepo.findByEmail(req.getEmail()).orElseThrow();
        return buildResponse(user);
    }
    @Override
    public AuthResponse refreshToken(String refreshToken) {
        String email = jwtUtil.extractUsername(refreshToken);
        var ud = uds.loadUserByUsername(email);
        if (!jwtUtil.isTokenValid(refreshToken, ud)) throw new BadRequestException("Invalid refresh token");
        var user = userRepo.findByEmail(email).orElseThrow();
        return buildResponse(user);
    }
    @Override
    public AuthResponse.UserDto getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return AuthResponse.toDto(userRepo.findByEmail(email).orElseThrow());
    }
    @Override @Transactional
    public AuthResponse.UserDto updateProfile(String userId, Map<String,Object> updates) {
        var user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User",userId));
        updates.forEach((k,v) -> { if(v==null) return; switch(k) {
            case "fullName" -> user.setFullName(v.toString());
            case "city" -> user.setCity(v.toString());
            case "bio" -> user.setBio(v.toString());
            case "phone" -> user.setPhone(v.toString());
            case "profileImageUrl" -> user.setProfileImageUrl(v.toString());
            case "sampleClipUrl" -> user.setSampleClipUrl(v.toString());
            case "yearsExperience" -> user.setYearsExperience(((Number)v).intValue());
            case "websiteUrl" -> user.setWebsiteUrl(v.toString());
            case "venueName" -> user.setVenueName(v.toString());
        }});
        return AuthResponse.toDto(userRepo.save(user));
    }
    private AuthResponse buildResponse(User user) {
        var ud = uds.loadUserByUsername(user.getEmail());
        return AuthResponse.builder().accessToken(jwtUtil.generateToken(ud))
            .refreshToken(jwtUtil.generateRefreshToken(ud)).tokenType("Bearer")
            .user(AuthResponse.toDto(user)).build();
    }
}
