package com.manch.service;
import com.manch.dto.request.*;
import com.manch.dto.response.AuthResponse;
public interface AuthService {
    AuthResponse register(RegisterRequest req);
    AuthResponse login(LoginRequest req);
    AuthResponse refreshToken(String refreshToken);
    AuthResponse.UserDto getCurrentUser();
    AuthResponse.UserDto updateProfile(String userId, java.util.Map<String,Object> updates);
}
