package com.manch.service.impl;

import com.manch.dto.request.CreateGigRequest;
import com.manch.dto.response.ApplicationResponse;
import com.manch.dto.response.GigResponse;
import com.manch.entity.*;
import com.manch.exception.*;
import com.manch.repository.*;
import com.manch.service.GigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class GigServiceImpl implements GigService {

    private final GigRepository gigRepo;
    private final ApplicationRepository appRepo;
    private final UserRepository userRepo;

    @Override
    public Page<GigResponse> findGigs(String city, Gig.GigType gigType, Gig.PayType payType, Pageable pageable) {
        try {
            return gigRepo.findFiltered(city, gigType, payType, pageable).map(GigResponse::from);
        } catch (Exception e) {
            log.error("Error finding gigs", e);
            return Page.empty(pageable);
        }
    }

    @Override
    public GigResponse findById(String id) {
        return GigResponse.from(gigRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gig", id)));
    }

    @Override
    @Transactional
    public GigResponse createGig(CreateGigRequest req) {
        var venue = currentUser();
        if (venue.getRole() != User.UserRole.VENUE)
            throw new ForbiddenException("Only venues can post gigs");
        var gig = Gig.builder()
                .title(req.getTitle()).description(req.getDescription())
                .postedBy(venue).city(req.getCity()).venue(req.getVenue())
                .address(req.getAddress()).eventDate(req.getEventDate())
                .eventTime(req.getEventTime()).gigType(req.getGigType())
                .payType(req.getPayType()).payAmount(req.getPayAmount())
                .slotsAvailable(req.getSlotsAvailable()).slotsFilled(0)
                .status(Gig.GigStatus.OPEN).requirements(req.getRequirements())
                .durationMinutes(req.getDurationMinutes())
                .preferredArtForms(req.getPreferredArtForms() != null ? req.getPreferredArtForms() : List.of())
                .build();
        return GigResponse.from(gigRepo.save(gig));
    }

    @Override
    @Transactional
    public GigResponse updateGig(String id, Map<String, Object> updates) {
        var gig = gigRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gig", id));
        if (!gig.getPostedBy().getId().equals(currentUser().getId()))
            throw new ForbiddenException("Not your gig");

        updates.forEach((k, v) -> {
            if (v == null) return;
            String val = v.toString().trim();
            switch (k) {
                case "title" -> gig.setTitle(val);
                case "description" -> gig.setDescription(val);
                case "city" -> gig.setCity(val);
                case "venue" -> gig.setVenue(val);
                case "address" -> gig.setAddress(val);
                case "eventDate" -> {
                    if (!val.isEmpty()) gig.setEventDate(LocalDate.parse(val));
                }
                case "eventTime" -> {
                    if (val.isEmpty()) gig.setEventTime(null);
                    else gig.setEventTime(LocalTime.parse(val));
                }
                case "gigType" -> {
                    if (!val.isEmpty()) gig.setGigType(Gig.GigType.valueOf(val));
                }
                case "payType" -> {
                    if (!val.isEmpty()) gig.setPayType(Gig.PayType.valueOf(val));
                }
                case "payAmount" -> {
                    if (val.isEmpty()) gig.setPayAmount(null);
                    else gig.setPayAmount(((Number) v).intValue());
                }
                case "slotsAvailable" -> gig.setSlotsAvailable(((Number) v).intValue());
                case "requirements" -> gig.setRequirements(val);
                case "durationMinutes" -> {
                    if (val.isEmpty()) gig.setDurationMinutes(null);
                    else gig.setDurationMinutes(((Number) v).intValue());
                }
                case "status" -> {
                    if (!val.isEmpty()) gig.setStatus(Gig.GigStatus.valueOf(val));
                }
            }
        });

        return GigResponse.from(gigRepo.save(gig));
    }

    @Override
    @Transactional
    public void cancelGig(String id) {
        var gig = gigRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gig", id));
        if (!gig.getPostedBy().getId().equals(currentUser().getId()))
            throw new ForbiddenException("Not your gig");
        gig.setStatus(Gig.GigStatus.CANCELLED);
        gigRepo.save(gig);
    }

    @Override
    public Page<GigResponse> getVenueGigs(Pageable pageable) {
        return gigRepo.findByPostedBy(currentUser(), pageable).map(GigResponse::from);
    }

    @Override
    @Transactional
    public ApplicationResponse applyToGig(String gigId, String note) {
        var artist = currentUser();
        if (artist.getRole() != User.UserRole.ARTIST)
            throw new ForbiddenException("Only artists can apply");
        var gig = gigRepo.findById(gigId)
                .orElseThrow(() -> new ResourceNotFoundException("Gig", gigId));
        if (gig.getStatus() != Gig.GigStatus.OPEN)
            throw new BadRequestException("This gig is not open");
        if (gig.getSlotsFilled() >= gig.getSlotsAvailable())
            throw new BadRequestException("All slots are filled");
        if (appRepo.existsByGigAndArtist(gig, artist))
            throw new ConflictException("You already applied to this gig");
        var app = Application.builder()
                .gig(gig).artist(artist).note(note)
                .status(Application.ApplicationStatus.PENDING).build();
        return ApplicationResponse.from(appRepo.save(app));
    }

    @Override
    public Page<ApplicationResponse> getApplicationsForGig(String gigId, Pageable pageable) {
        var gig = gigRepo.findById(gigId)
                .orElseThrow(() -> new ResourceNotFoundException("Gig", gigId));
        if (!gig.getPostedBy().getId().equals(currentUser().getId()))
            throw new ForbiddenException("Not your gig");
        return appRepo.findByGig(gig, pageable).map(ApplicationResponse::from);
    }

    @Override
    public Page<ApplicationResponse> getMyApplications(Pageable pageable) {
        return appRepo.findByArtist(currentUser(), pageable).map(ApplicationResponse::from);
    }

    @Override
    @Transactional
    public ApplicationResponse reviewApplication(String appId, String status, String venueNote) {
        var app = appRepo.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", appId));
        if (!app.getGig().getPostedBy().getId().equals(currentUser().getId()))
            throw new ForbiddenException("Not your gig");
        app.setStatus(Application.ApplicationStatus.valueOf(status));
        app.setVenueNote(venueNote);
        app.setReviewedAt(Instant.now());
        if (Application.ApplicationStatus.ACCEPTED.name().equals(status)) {
            var gig = app.getGig();
            gig.setSlotsFilled(gig.getSlotsFilled() + 1);
            if (gig.getSlotsFilled() >= gig.getSlotsAvailable())
                gig.setStatus(Gig.GigStatus.CLOSED);
            gigRepo.save(gig);
        }
        return ApplicationResponse.from(appRepo.save(app));
    }

    @Override
    @Transactional
    public ApplicationResponse withdrawApplication(String appId) {
        var app = appRepo.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", appId));
        if (!app.getArtist().getId().equals(currentUser().getId()))
            throw new ForbiddenException("Not your application");
        if (app.getStatus() != Application.ApplicationStatus.PENDING)
            throw new BadRequestException("Can only withdraw pending applications");
        app.setStatus(Application.ApplicationStatus.WITHDRAWN);
        return ApplicationResponse.from(appRepo.save(app));
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void autoCompleteGigs() {
        List<Gig> openGigs = gigRepo.findAll().stream()
                .filter(g -> g.getStatus() == Gig.GigStatus.OPEN || g.getStatus() == Gig.GigStatus.CLOSED)
                .filter(g -> g.getEventDate().isBefore(LocalDate.now()))
                .collect(Collectors.toList());
        openGigs.forEach(g -> {
            g.setStatus(Gig.GigStatus.COMPLETED);
            gigRepo.save(g);
            log.info("Auto completed gig: {}", g.getTitle());
        });
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Not authenticated"));
    }
}