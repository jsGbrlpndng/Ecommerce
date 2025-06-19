package website.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import website.ecommerce.model.Customer;
import website.ecommerce.repository.CustomerRepository;
import website.ecommerce.repository.OrderRepository;
import website.ecommerce.model.Order;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class CustomerManagementController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;    // Get all customers
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sort,
            HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).build();
        }
        List<Customer> customers;
        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            customers = customerRepository.findAll().stream()
                .filter(c -> (c.getFirstName() + " " + c.getLastName()).toLowerCase().contains(q)
                        || c.getEmail().toLowerCase().contains(q))
                .toList();
        } else {
            customers = customerRepository.findAll();
        }
        // Status filter
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("all")) {
            boolean isActive = status.equalsIgnoreCase("active");
            customers = customers.stream()
                .filter(c -> c.isActive() == isActive)
                .toList();
        }
        // Sorting
        if (sort != null && !sort.trim().isEmpty()) {
            switch (sort) {
                case "name_az":
                    customers = customers.stream().sorted((a, b) -> (a.getFirstName() + a.getLastName()).compareToIgnoreCase(b.getFirstName() + b.getLastName())).toList();
                    break;
                case "name_za":
                    customers = customers.stream().sorted((a, b) -> (b.getFirstName() + b.getLastName()).compareToIgnoreCase(a.getFirstName() + a.getLastName())).toList();
                    break;
                case "recent":
                    customers = customers.stream().sorted((a, b) -> b.getId().compareTo(a.getId())).toList();
                    break;
                case "oldest":
                    customers = customers.stream().sorted((a, b) -> a.getId().compareTo(b.getId())).toList();
                    break;
                default:
                    break;
            }
        }
        return ResponseEntity.ok(customers);
    }

    // Get customer by ID
    @GetMapping("/customers/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).build();
        }
        Optional<Customer> customer = customerRepository.findById(id);
        return customer.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // Update customer
    @PutMapping("/customers/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, 
                                          @RequestBody Customer customerDetails,
                                          HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).build();
        }

        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (!customerOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Customer customer = customerOpt.get();
        customer.setFirstName(customerDetails.getFirstName());
        customer.setLastName(customerDetails.getLastName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhone(customerDetails.getPhone());
        customer.setStreet(customerDetails.getStreet());
        customer.setCity(customerDetails.getCity());
        customer.setState(customerDetails.getState());
        customer.setZipCode(customerDetails.getZipCode());
        customer.setCountry(customerDetails.getCountry());

        customerRepository.save(customer);
        return ResponseEntity.ok().build();
    }

    // Delete customer
    @DeleteMapping("/customers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).build();
        }

        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        customerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Get customer orders
    @GetMapping("/customers/{id}/orders")
    public ResponseEntity<List<Order>> getCustomerOrders(@PathVariable Long id, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).build();
        }

        Optional<Customer> customer = customerRepository.findById(id);
        if (!customer.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Order> orders = orderRepository.findByCustomerId(id);
        return ResponseEntity.ok(orders);
    }

    // Update order status
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> body,
            HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String newStatus = body.get("status");
        if (newStatus == null || (!newStatus.equals("Processing") && !newStatus.equals("Shipping") && !newStatus.equals("Delivered"))) {
            return ResponseEntity.badRequest().body("Invalid status value");
        }
        Order order = orderRepository.findByOrderId(orderId);
        if (order == null) {
            return ResponseEntity.status(404).body("Order not found");
        }
        order.setStatus(newStatus);
        orderRepository.save(order);
        return ResponseEntity.ok().body("Order status updated");
    }

    // Check admin session
    @GetMapping("/check-session")
    public ResponseEntity<?> checkAdminSession(HttpSession session) {
        System.out.println("Check admin session: isAdmin=" + session.getAttribute("isAdmin") + " | Session ID: " + session.getId());
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).body("Admin session not valid");
        }
        return ResponseEntity.ok().build();
    }
}
