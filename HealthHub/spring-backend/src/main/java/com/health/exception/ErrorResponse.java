package com.health.exception;

import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;

public class ErrorResponse {

    private String message;
    private String timestamp;
    private int status;

    public ErrorResponse(String message, HttpStatus status) {
        this.message = message;
        this.timestamp = LocalDateTime.now().toString();
        this.status = status.value();
    }

    public String getMessage() {
        return message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }
}
