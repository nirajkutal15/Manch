package com.manch.service.impl;
import com.manch.dto.request.ContactRequest;
import com.manch.entity.ContactMessage;
import com.manch.repository.ContactMessageRepository;
import com.manch.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Map;
@Service @RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {
    private final ContactMessageRepository repo;
    @Override
    public Map<String,Object> save(ContactRequest req) {
        repo.save(ContactMessage.builder().fullName(req.getFullName()).email(req.getEmail()).message(req.getMessage()).build());
        return Map.of("message","Thanks for reaching out! We'll get back to you within 1-2 business days.");
    }
}
