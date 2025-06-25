package website.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import website.ecommerce.model.Customer;
import website.ecommerce.repository.CustomerRepository;
import website.ecommerce.dto.LoginRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import website.ecommerce.repository.CheckoutInformationRepository;
import website.ecommerce.model.CheckoutInformation;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CheckoutInformationRepository checkoutInformationRepository;

    public UserController(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            CheckoutInformationRepository checkoutInformationRepository
    ) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.checkoutInformationRepository = checkoutInformationRepository;
    }

    // Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody Customer customer) {
        if (customerRepository.findByEmail(customer.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        customer.setActive(true); // Ensure active is set
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customerRepository.save(customer);
        return ResponseEntity.ok("Customer registered successfully");
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            String email = authentication.getName();
            Customer customer = customerRepository.findByEmail(email);
            if (customer == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Customer not found"));
            }
            if (!customer.isActive()) {
                return ResponseEntity.status(403).body(Map.of(
                    "message", "Your account is currently inactive due to a violation of our policies. Please contact the administrator for assistance."
                ));
            }
            SecurityContextHolder.getContext().setAuthentication(authentication);
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            return ResponseEntity.ok(Map.of(
                "id", customer.getId(),
                "firstName", customer.getFirstName(),
                "lastName", customer.getLastName(),
                "email", customer.getEmail(),
                "phone", customer.getPhone()
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
    }

    // Logout endpoint
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully");
    }

    // Endpoint to get current logged-in customer's info
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentCustomer(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Not logged in"));
        }
        String email = authentication.getName();
        Customer customer = customerRepository.findByEmail(email);
        if (customer != null) {
            // Fetch latest checkout info for this customer
            java.util.Optional<CheckoutInformation> checkoutOpt = checkoutInformationRepository.findTopByCustomerIdOrderByIdDesc(customer.getId());
            Map<String, Object> shippingAddress = Map.of();
            if (checkoutOpt.isPresent()) {
                CheckoutInformation checkout = checkoutOpt.get();
                shippingAddress = Map.of(
                    "street", checkout.getShippingAddress(),
                    "city", checkout.getCity(),
                    "state", checkout.getState(),
                    "zipCode", checkout.getZip(),
                    "country", checkout.getCountry()
                );
            }
            return ResponseEntity.ok(Map.of(
                "id", customer.getId(),
                "firstName", customer.getFirstName(),
                "lastName", customer.getLastName(),
                "email", customer.getEmail(),
                "phone", customer.getPhone(),
                "username", customer.getFirstName() + " " + customer.getLastName(),
                "shippingAddress", shippingAddress
            ));
        }
        return ResponseEntity.status(404).body(Map.of("message", "Customer not found"));
    }

    // Update current user's profile
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentCustomer(@RequestBody Map<String, Object> updates, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Not logged in"));
        }
        String email = authentication.getName();
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Customer not found"));
        }
        // Only allow updating safe fields
        if (updates.containsKey("firstName")) customer.setFirstName((String) updates.get("firstName"));
        if (updates.containsKey("lastName")) customer.setLastName((String) updates.get("lastName"));
        if (updates.containsKey("email")) customer.setEmail((String) updates.get("email"));
        if (updates.containsKey("phone")) customer.setPhone((String) updates.get("phone"));
        if (updates.containsKey("street")) customer.setStreet((String) updates.get("street"));
        if (updates.containsKey("city")) customer.setCity((String) updates.get("city"));
        if (updates.containsKey("state")) customer.setState((String) updates.get("state"));
        if (updates.containsKey("zipCode")) customer.setZipCode((String) updates.get("zipCode"));
        if (updates.containsKey("country")) customer.setCountry((String) updates.get("country"));
        customerRepository.save(customer);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }
}