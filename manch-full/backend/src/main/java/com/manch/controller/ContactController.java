package com.manch.controller;
import com.manch.dto.request.ContactRequest;
import com.manch.service.ContactService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/contact") @RequiredArgsConstructor @Tag(name="Contact")
public class ContactController {
    private final ContactService contactService;
    @PostMapping public ResponseEntity<Map<String,Object>> send(@Valid @RequestBody ContactRequest req) { return ResponseEntity.ok(contactService.save(req)); }
}
