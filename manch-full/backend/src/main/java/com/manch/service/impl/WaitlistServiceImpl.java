package com.manch.service.impl;
import com.manch.dto.request.WaitlistRequest;
import com.manch.entity.WaitlistEntry;
import com.manch.exception.ConflictException;
import com.manch.repository.WaitlistRepository;
import com.manch.service.WaitlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
@Service @RequiredArgsConstructor
public class WaitlistServiceImpl implements WaitlistService {
    private final WaitlistRepository repo;
    @Override @Transactional
    public Map<String,Object> joinWaitlist(WaitlistRequest req) {
        String email = req.getEmail().toLowerCase().trim();
        if (repo.existsByEmail(email)) throw new ConflictException("This email is already on the waitlist");
        repo.save(WaitlistEntry.builder().fullName(req.getFullName()).email(email).city(req.getCity())
            .type(req.getType()).artForm(req.getArtForm()).bio(req.getBio())
            .venueName(req.getVenueName()).venueType(req.getVenueType()).phone(req.getPhone()).build());
        return Map.of("message","You're on the list! We'll notify you when Manch launches in your city.","email",email);
    }
}
