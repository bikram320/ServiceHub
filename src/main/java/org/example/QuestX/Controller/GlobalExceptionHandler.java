package org.example.QuestX.Controller;

import org.example.QuestX.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleValidationErrors(MethodArgumentNotValidException exception) {
        var errors = new HashMap<String, String>();
        exception.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = (error instanceof FieldError) ? ((FieldError) error).getField() : error.getObjectName();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String,String>> handleUserNotFound(UserNotFoundException exception) {
        var errors = new HashMap<String, String>();
        errors.put("message", exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errors);
    }

    @ExceptionHandler(TechnicianNotFoundException.class)
    public ResponseEntity<Map<String,String>> handleTechnicianNotFound(UserNotFoundException exception) {
        var errors = new HashMap<String, String>();
        errors.put("message", exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errors);
    }

    @ExceptionHandler(DuplicateDataException.class)
    public ResponseEntity<Map<String,String>> handleDuplicateDataException(DuplicateDataException exception) {
        var errors = new HashMap<String, String>();
        errors.put("message", exception.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String,String>> handleBadCredentialsException(BadCredentialsException exception) {
        var errors = new HashMap<String, String>();
        errors.put("message", exception.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(InvalidDateTimeException.class)
    public ResponseEntity<Map<String,String>> handleInvalidDateTimeException(InvalidDateTimeException exception) {
        var errors = new HashMap<String, String>();
        errors.put("message", exception.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(ServiceNotFoundException.class)
    public ResponseEntity<Map<String,String>> handleServiceNotFoundException(ServiceNotFoundException exception) {
        var errors = new HashMap<String, String>();
        errors.put("message", exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errors);
    }

    @ExceptionHandler(TimeConflictException.class)
    public ResponseEntity<Map<String,String>> handleTimeConflictException(TimeConflictException exception) {
        var errors = new HashMap<String, String>();
        errors.put("message", exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errors);
    }

    @ExceptionHandler(StatusInvalidException.class)
    public ResponseEntity<Map<String,String>> handleStatusInvalidException(StatusInvalidException exception) {
        var errors = new HashMap<String, String>();
        errors.put("message", exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
