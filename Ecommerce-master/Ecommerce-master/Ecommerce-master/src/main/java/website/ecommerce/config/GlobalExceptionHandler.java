/*
 * GlobalExceptionHandler.java
 * MelodyMatrix E-commerce Platform
 *
 * Provides centralized exception handling for all controllers.
 * Ensures consistent error responses and logging for debugging and security.
 *
 * Author: MelodyMatrix Team
 * Date: 2025-06-26
 */

package website.ecommerce.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Handles exceptions globally for all controllers.
 * Provides user-friendly error messages and logs details for developers.
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    /**
     * Handles all uncaught exceptions.
     *
     * @param ex      The exception thrown
     * @param request The HTTP request
     * @return ResponseEntity with error message and 500 status
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex, HttpServletRequest request) {
        System.err.println("Exception at " + request.getRequestURI() + ": " + ex.getMessage());
        ex.printStackTrace();
        return new ResponseEntity<>("Error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles access denied (403) exceptions.
     *
     * @param ex      The exception thrown
     * @param request The HTTP request
     * @return ResponseEntity with forbidden message and 403 status
     */
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDenied(Exception ex, HttpServletRequest request) {
        System.err.println("403 Forbidden at " + request.getRequestURI() + ": " + ex.getMessage());
        return new ResponseEntity<>("Forbidden: " + ex.getMessage(), HttpStatus.FORBIDDEN);
    }
}
