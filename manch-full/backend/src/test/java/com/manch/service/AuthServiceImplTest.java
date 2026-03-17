package com.manch.service;

import com.manch.dto.request.LoginRequest;
import com.manch.dto.request.RegisterRequest;
import com.manch.entity.User;
import com.manch.exception.ConflictException;
import com.manch.repository.UserRepository;
import com.manch.security.JwtUtil;
import com.manch.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock UserRepository userRepo;
    @Mock PasswordEncoder encoder;
    @Mock JwtUtil jwtUtil;
    @Mock AuthenticationManager authManager;
    @Mock UserDetailsService uds;
    @InjectMocks AuthServiceImpl authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id("user-1").email("niraj@test.com")
                .passwordHash("hashed").fullName("Niraj Kutal")
                .role(User.UserRole.ARTIST).active(true)
                .emailVerified(false).rating(0.0)
                .totalShows(0).yearsExperience(0).build();
    }

    @Test
    void register_succeeds_withNewEmail() {
        when(userRepo.existsByEmail("niraj@test.com")).thenReturn(false);
        when(encoder.encode(any())).thenReturn("hashed");
        when(userRepo.save(any())).thenReturn(testUser);
        UserDetails ud = mock(UserDetails.class);
        when(uds.loadUserByUsername(any())).thenReturn(ud);
        when(jwtUtil.generateToken(any())).thenReturn("access-token");
        when(jwtUtil.generateRefreshToken(any())).thenReturn("refresh-token");

        var req = RegisterRequest.builder()
                .email("niraj@test.com").password("Test@1234")
                .fullName("Niraj Kutal").role(User.UserRole.ARTIST).build();

        var result = authService.register(req);
        assertNotNull(result);
        assertEquals("access-token", result.getAccessToken());
        verify(userRepo).save(any(User.class));
    }

    @Test
    void register_throws_whenEmailAlreadyExists() {
        when(userRepo.existsByEmail("niraj@test.com")).thenReturn(true);
        var req = RegisterRequest.builder()
                .email("niraj@test.com").password("Test@1234")
                .fullName("Niraj Kutal").role(User.UserRole.ARTIST).build();
        assertThrows(ConflictException.class, () -> authService.register(req));
        verify(userRepo, never()).save(any());
    }

    @Test
    void login_succeeds_withValidCredentials() {
        when(userRepo.findByEmail("niraj@test.com")).thenReturn(Optional.of(testUser));
        UserDetails ud = mock(UserDetails.class);
        when(uds.loadUserByUsername(any())).thenReturn(ud);
        when(jwtUtil.generateToken(any())).thenReturn("access-token");
        when(jwtUtil.generateRefreshToken(any())).thenReturn("refresh-token");

        var req = LoginRequest.builder()
                .email("niraj@test.com").password("Test@1234").build();

        var result = authService.login(req);
        assertNotNull(result);
        verify(authManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_throws_whenAuthManagerRejects() {
        doThrow(new BadCredentialsException("bad"))
                .when(authManager).authenticate(any());
        var req = LoginRequest.builder()
                .email("niraj@test.com").password("wrongpassword").build();
        assertThrows(BadCredentialsException.class, () -> authService.login(req));
    }

    @Test
    void refreshToken_throws_whenTokenInvalid() {
        UserDetails ud = mock(UserDetails.class);
        when(jwtUtil.extractUsername("bad-token")).thenReturn("niraj@test.com");
        when(uds.loadUserByUsername("niraj@test.com")).thenReturn(ud);
        when(jwtUtil.isTokenValid("bad-token", ud)).thenReturn(false);
        assertThrows(com.manch.exception.BadRequestException.class,
                () -> authService.refreshToken("bad-token"));
    }
}