package com.manch.service;

import com.manch.dto.request.CreateGigRequest;
import com.manch.entity.*;
import com.manch.exception.*;
import com.manch.repository.*;
import com.manch.service.impl.GigServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GigServiceImplTest {

    @Mock GigRepository gigRepo;
    @Mock ApplicationRepository appRepo;
    @Mock UserRepository userRepo;
    @InjectMocks GigServiceImpl gigService;

    private User venueUser;
    private User artistUser;
    private Gig openGig;

    @BeforeEach
    void setUp() {
        venueUser = User.builder()
                .id("venue-1").email("venue@test.com")
                .role(User.UserRole.VENUE).build();

        artistUser = User.builder()
                .id("artist-1").email("artist@test.com")
                .role(User.UserRole.ARTIST).build();

        openGig = Gig.builder()
                .id("gig-1").title("Open Mic Night")
                .city("Pune").postedBy(venueUser)
                .eventDate(LocalDate.now().plusDays(5))
                .gigType(Gig.GigType.OPEN_MIC)
                .payType(Gig.PayType.FREE)
                .slotsAvailable(3).slotsFilled(0)
                .status(Gig.GigStatus.OPEN)
                .preferredArtForms(List.of())
                .build();
    }

    // ── helper to mock SecurityContext ──────────────────────────────────────
    private void mockCurrentUser(User user) {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(user.getEmail());
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
        when(userRepo.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
    }

    // ── findById ─────────────────────────────────────────────────────────────
    @Test
    void findById_returnsGig_whenExists() {
        when(gigRepo.findById("gig-1")).thenReturn(Optional.of(openGig));
        var result = gigService.findById("gig-1");
        assertEquals("Open Mic Night", result.getTitle());
    }

    @Test
    void findById_throws_whenNotFound() {
        when(gigRepo.findById("bad-id")).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> gigService.findById("bad-id"));
    }

    // ── createGig ────────────────────────────────────────────────────────────
    @Test
    void createGig_succeeds_forVenueUser() {
        mockCurrentUser(venueUser);
        var req = CreateGigRequest.builder()
                .title("Jazz Night").city("Pune")
                .eventDate(LocalDate.now().plusDays(7))
                .gigType(Gig.GigType.CAFE_NIGHT)
                .payType(Gig.PayType.PAID).payAmount(500)
                .slotsAvailable(2).build();
        when(gigRepo.save(any())).thenReturn(openGig);
        var result = gigService.createGig(req);
        assertNotNull(result);
        verify(gigRepo).save(any(Gig.class));
    }

    @Test
    void createGig_throws_forArtistUser() {
        mockCurrentUser(artistUser);
        var req = CreateGigRequest.builder().title("Test").build();
        assertThrows(ForbiddenException.class, () -> gigService.createGig(req));
    }

    // ── applyToGig ───────────────────────────────────────────────────────────
    @Test
    void applyToGig_succeeds_forArtist() {
        mockCurrentUser(artistUser);
        when(gigRepo.findById("gig-1")).thenReturn(Optional.of(openGig));
        when(appRepo.existsByGigAndArtist(openGig, artistUser)).thenReturn(false);
        var app = Application.builder()
                .id("app-1").gig(openGig).artist(artistUser)
                .status(Application.ApplicationStatus.PENDING).build();
        when(appRepo.save(any())).thenReturn(app);
        var result = gigService.applyToGig("gig-1", "Love jazz!");
        assertNotNull(result);
        verify(appRepo).save(any(Application.class));
    }

    @Test
    void applyToGig_throws_whenAlreadyApplied() {
        mockCurrentUser(artistUser);
        when(gigRepo.findById("gig-1")).thenReturn(Optional.of(openGig));
        when(appRepo.existsByGigAndArtist(openGig, artistUser)).thenReturn(true);
        assertThrows(ConflictException.class, () -> gigService.applyToGig("gig-1", null));
    }

    @Test
    void applyToGig_throws_whenGigClosed() {
        mockCurrentUser(artistUser);
        openGig.setStatus(Gig.GigStatus.CLOSED);
        when(gigRepo.findById("gig-1")).thenReturn(Optional.of(openGig));
        assertThrows(BadRequestException.class, () -> gigService.applyToGig("gig-1", null));
    }

    @Test
    void applyToGig_throws_whenSlotsFull() {
        mockCurrentUser(artistUser);
        openGig.setSlotsAvailable(1);
        openGig.setSlotsFilled(1);
        when(gigRepo.findById("gig-1")).thenReturn(Optional.of(openGig));
        assertThrows(BadRequestException.class, () -> gigService.applyToGig("gig-1", null));
    }

    // ── cancelGig ────────────────────────────────────────────────────────────
    @Test
    void cancelGig_throws_whenNotOwner() {
        mockCurrentUser(artistUser);
        when(gigRepo.findById("gig-1")).thenReturn(Optional.of(openGig));
        assertThrows(ForbiddenException.class, () -> gigService.cancelGig("gig-1"));
    }
}