/*
 * AdminController.java
 * MelodyMatrix E-commerce Platform
 *
 * Handles admin authentication and product management endpoints.
 * All endpoints require a valid admin session for access.
 *
 * Author: MelodyMatrix Team
 * Date: 2025-06-26
 */

package website.ecommerce.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import website.ecommerce.model.LoginRequest;
import website.ecommerce.model.Product;
import website.ecommerce.repository.AdminUserRepository;
import website.ecommerce.repository.ProductRepository;
import website.ecommerce.model.AdminUser;

import java.util.List;

/**
 * Controller for admin authentication and product management.
 * All endpoints require admin session except login.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AdminUserRepository adminUserRepository;

    /**
     * Authenticates an admin user and starts an admin session.
     *
     * @param request LoginRequest containing username and password
     * @param session HttpSession for storing admin session attributes
     * @return ResponseEntity with login result
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request, HttpSession session) {
        System.out.println("Admin login: " + request.getUsername() + " | Session ID: " + session.getId());
        AdminUser admin = adminUserRepository.findByUsernameIgnoreCase(request.getUsername());
        if (admin != null &&
            "ADMIN".equalsIgnoreCase(admin.getRole()) &&
            passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            session.setAttribute("isAdmin", true);
            session.setAttribute("adminUsername", admin.getUsername());
            return ResponseEntity.ok("Login successful");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid admin credentials");
    }

    /**
     * Logs out the admin and invalidates the session.
     *
     * @param session HttpSession to invalidate
     * @return ResponseEntity with logout result
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    /**
     * Returns all products (admin only).
     *
     * @param session HttpSession for admin check
     * @return List of all products
     */
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(productRepository.findAll());
    }

    /**
     * Creates a new product (admin only).
     *
     * @param product Product to create
     * @param session HttpSession for admin check
     * @return Created product
     */
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(productRepository.save(product));
    }

    /**
     * Deletes a product by ID (admin only).
     *
     * @param id Product ID
     * @param session HttpSession for admin check
     * @return ResponseEntity with no content
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}