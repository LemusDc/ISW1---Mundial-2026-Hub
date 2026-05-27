package com.mundial2026.shared.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " con id " + id + " no encontrado");
    }
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
