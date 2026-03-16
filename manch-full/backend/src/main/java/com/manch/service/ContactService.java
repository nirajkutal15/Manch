package com.manch.service;
import com.manch.dto.request.ContactRequest;
import java.util.Map;
public interface ContactService { Map<String,Object> save(ContactRequest req); }
