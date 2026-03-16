package com.manch.controller;
import com.manch.dto.response.AuthResponse;
import com.manch.entity.User;
import com.manch.exception.ResourceNotFoundException;
import com.manch.repository.UserRepository;
import com.manch.service.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/artists") @RequiredArgsConstructor @Tag(name="Artists")
public class ArtistController {
    private final UserRepository userRepo;
    private final ReviewService reviewService;
    @GetMapping public ResponseEntity<Page<AuthResponse.UserDto>> listArtists(@RequestParam(required=false) String city,@RequestParam(required=false) String artForm,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="12") int size) {
        User.ArtForm af = null;
        try { if(artForm!=null) af=User.ArtForm.valueOf(artForm); } catch(Exception ignored){}
        return ResponseEntity.ok(userRepo.findArtists(city,af,PageRequest.of(page,size)).map(AuthResponse::toDto));
    }
    @GetMapping("/{id}") public ResponseEntity<Map<String,Object>> getArtist(@PathVariable String id) {
        var u = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Artist",id));
        var reviews = reviewService.getReviewsForUser(id);
        return ResponseEntity.ok(Map.of("profile",AuthResponse.toDto(u),"reviews",reviews));
    }
}
