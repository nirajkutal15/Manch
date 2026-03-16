package com.manch.exception;
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String msg) { super(msg); }
    public ResourceNotFoundException(String r, String id) { super(r + " not found: " + id); }
}
