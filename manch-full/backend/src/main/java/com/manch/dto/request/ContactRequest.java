package com.manch.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class ContactRequest {
    @NotBlank private String fullName;
    @NotBlank @Email private String email;
    @NotBlank @Size(min=10,max=2000) private String message;
}
