/*
 * CustomerManagementController.java
 * MelodyMatrix E-commerce Platform
 *
 * Handles admin endpoints for managing customers and their orders.
 * All endpoints require a valid admin session for access.
 *
 * Author: MelodyMatrix Team
 * Date: 2025-06-26
 */

package website.ecommerce.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import website.ecommerce.model.Customer;
import website.ecommerce.model.Order;
import website.ecommerce.repository.CheckoutInformationRepository;
import website.ecommerce.repository.CustomerRepository;
import website.ecommerce.repository.OrderItemRepository;
import website.ecommerce.repository.OrderRepository;
import website.ecommerce.dto.OrderDetailsDTO;
import website.ecommerce.dto.OrderItemDTO;
import website.ecommerce.dto.OrderTotalsDTO;
import website.ecommerce.service.OrderCalculationService;
import website.ecommerce.model.OrderItem;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller for admin management of customers and their orders.
 * All endpoints require admin session.
 */
@RestController
@RequestMapping("/api/admin")
public class CustomerManagementController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CheckoutInformationRepository checkoutInformationRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderCalculationService orderCalculationService;

    /**
     * Returns all customers, with optional search, status filter, and sorting (admin only).
     *
     * @param search Optional search query
     * @param status Optional status filter (active/inactive)
     * @param sort   Optional sort order
     * @param session HttpSession for admin check
     * @return List of customers
     */
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
            boolean isStatus = status.equalsIgnoreCase("active");
            customers = customers.stream()
                .filter(c -> c.isStatus() == isStatus)
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

    /**
     * Returns a customer by ID (admin only).
     *
     * @param id Customer ID
     * @param session HttpSession for admin check
     * @return Customer or 404 if not found
     */
    @GetMapping("/customers/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).build();
        }
        Optional<Customer> customer = customerRepository.findById(id);
        return customer.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    /**
     * Deletes a customer by ID (admin only).
     *
     * @param id Customer ID
     * @param session HttpSession for admin check
     * @return ResponseEntity with delete result
     */
    @DeleteMapping("/customers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).build();
        }

        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Get all orders for this customer
        List<Order> orders = orderRepository.findByCustomerId(id);
        boolean hasUndelivered = orders.stream()
            .anyMatch(order -> !"Delivered".equalsIgnoreCase(order.getStatus()));

        if (hasUndelivered) {
            return ResponseEntity.status(409).body("Cannot delete customer with undelivered orders.");
        }

        // Delete all delivered orders for this customer
        for (Order order : orders) {
            orderRepository.delete(order);
        }

        customerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Returns all orders for a customer (admin only).
     *
     * @param id Customer ID
     * @param session HttpSession for admin check
     * @return List of orders
     */
    @GetMapping("/customers/{id}/orders")
    public ResponseEntity<List<Map<String, Object>>> getCustomerOrders(@PathVariable Long id, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).build();
        }

        Optional<Customer> customer = customerRepository.findById(id);
        if (!customer.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Order> orders = orderRepository.findByCustomerId(id);
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (Order order : orders) {
            List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
            OrderTotalsDTO totals = orderCalculationService.calculateTotals(orderItems, order.getShippingFee());
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("orderId", order.getOrderId());
            map.put("orderDate", order.getOrderDate());
            map.put("status", order.getStatus());
            map.put("total", totals.getTotal());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Updates the status of an order (admin only).
     *
     * @param orderId Order ID
     * @param body Map containing new status
     * @param session HttpSession for admin check
     * @return ResponseEntity with update result
     */
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

    /**
     * Checks if the current session is an admin session.
     *
     * @param session HttpSession
     * @return ResponseEntity with session status
     */
    @GetMapping("/check-session")
    public ResponseEntity<?> checkAdminSession(HttpSession session) {
        System.out.println("Check admin session: isAdmin=" + session.getAttribute("isAdmin") + " | Session ID: " + session.getId());
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).body("Admin session not valid");
        }
        return ResponseEntity.ok().build();
    }

    /**
     * Toggles a customer's status (admin only).
     *
     * @param id Customer ID
     * @param body Map containing new status
     * @param session HttpSession for admin check
     * @return ResponseEntity with update result
     */
    @PatchMapping("/customers/{id}/status")
    public ResponseEntity<?> toggleCustomerStatus(@PathVariable Long id, @RequestBody Map<String, Object> body, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (!customerOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Customer customer = customerOpt.get();
        if (!body.containsKey("status")) {
            return ResponseEntity.badRequest().body("Missing 'status' field");
        }
        boolean newStatus = Boolean.parseBoolean(body.get("status").toString());
        customer.setStatus(newStatus);
        customerRepository.save(customer);
        return ResponseEntity.ok(customer);
    }

    /**
     * Returns full order details for a given orderId (admin only).
     * @param orderId Order ID
     * @param session HttpSession for admin check
     * @return Order details or 404 if not found
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> getOrderDetailsByOrderId(@PathVariable String orderId, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Order order = orderRepository.findByOrderId(orderId);
        if (order == null) {
            return ResponseEntity.status(404).body("Order not found");
        }
        // Fetch checkout info
        var checkout = checkoutInformationRepository.findByOrderId(orderId);
        // Fetch order items
        var orderItems = orderItemRepository.findByOrder(order);
        // Build DTO
        OrderDetailsDTO dto = new OrderDetailsDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOrderDate(order.getOrderDate() != null ? order.getOrderDate().toString() : null);
        dto.setStatus(order.getStatus());
        if (checkout != null) {
            dto.setFirstName(checkout.getFirstName());
            dto.setLastName(checkout.getLastName());
            dto.setEmail(checkout.getEmail());
            dto.setPhone(checkout.getPhone());
            dto.setPaymentMethod(checkout.getPaymentMethod());
            dto.setShippingMethod(checkout.getShippingMethod());
            dto.setAddress(checkout.getShippingAddress());
        }
        java.util.List<OrderItemDTO> itemDTOs = new java.util.ArrayList<>();
        for (var item : orderItems) {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setName(item.getName());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setPrice(item.getPrice());
            itemDTO.setImage(item.getImage());
            itemDTOs.add(itemDTO);
        }
        dto.setItems(itemDTOs);
        OrderTotalsDTO totals = orderCalculationService.calculateTotals(orderItems, order.getShippingFee());
        dto.setTotals(totals);
        return ResponseEntity.ok(dto);
    }
}
