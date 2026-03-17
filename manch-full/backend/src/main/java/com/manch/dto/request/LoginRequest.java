package com.manch.dto.request;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;
@Builder
@Data
public class LoginRequest {
    @NotBlank @Email private String email;
    @NotBlank private String password;
}
