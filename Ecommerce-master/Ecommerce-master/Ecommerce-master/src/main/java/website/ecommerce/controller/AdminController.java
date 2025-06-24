package website.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import website.ecommerce.repository.ProductRepository;
import website.ecommerce.model.LoginRequest;
import website.ecommerce.model.Product;
import org.springframework.http.HttpStatus;
import java.util.List;
import website.ecommerce.repository.AdminUserRepository;
import website.ecommerce.model.AdminUser;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AdminUserRepository adminUserRepository;
    
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

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    private boolean isAdminSession(HttpSession session) {
        Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
        return isAdmin != null && isAdmin;
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(productRepository.findAll());
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(productRepository.save(product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}