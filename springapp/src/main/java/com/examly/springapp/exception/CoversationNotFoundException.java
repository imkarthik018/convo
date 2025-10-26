package com.examly.springapp.exception;

public class CoversationNotFoundException extends RuntimeException {
    public CoversationNotFoundException(String message) {
        super(message);
    }
}