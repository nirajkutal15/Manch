package com.manch.exception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
@RestControllerAdvice @Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleNotFound(ResourceNotFoundException e) { return err(404, e.getMessage()); }
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String,Object>> handleConflict(ConflictException e) { return err(409, e.getMessage()); }
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String,Object>> handleBad(BadRequestException e) { return err(400, e.getMessage()); }
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String,Object>> handleForbidden(ForbiddenException e) { return err(403, e.getMessage()); }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String,Object>> handleCreds(BadCredentialsException e) { return err(401, "Invalid email or password"); }
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String,Object>> handleAccess(AccessDeniedException e) { return err(403, "Access denied"); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException e) {
        Map<String,String> errors = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach(err -> errors.put(((FieldError)err).getField(), err.getDefaultMessage()));
        return ResponseEntity.badRequest().body(Map.of("status",400,"message","Validation failed","errors",errors,"timestamp",Instant.now()));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleGeneral(Exception e) { log.error("Unhandled", e); return err(500, "An unexpected error occurred"); }
    private ResponseEntity<Map<String,Object>> err(int status, String msg) {
        return ResponseEntity.status(status).body(Map.of("status",status,"message",msg,"timestamp",Instant.now()));
    }
}
