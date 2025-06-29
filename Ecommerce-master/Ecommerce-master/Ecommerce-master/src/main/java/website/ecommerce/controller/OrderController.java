/*
 * OrderController.java
 * MelodyMatrix E-commerce Platform
 *
 * Handles all order-related endpoints, including checkout, order details, and customer order history.
 *
 * Author: MelodyMatrix Team
 * Date: 2025-06-26
 */

package website.ecommerce.controller;

import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import website.ecommerce.model.*;
import website.ecommerce.repository.*;
import website.ecommerce.service.OrderService;
import website.ecommerce.dto.OrderDetailsDTO;
import website.ecommerce.dto.OrderItemDTO;
import website.ecommerce.dto.OrderTotalsDTO;
import website.ecommerce.service.OrderCalculationService;

/**
 * Controller for order management, checkout, and order status endpoints.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CheckoutInformationRepository checkoutInformationRepository;

    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderCalculationService orderCalculationService;

    /**
     * Processes a new order (checkout) for the authenticated user.
     *
     * @param orderData Order data from frontend
     * @param authentication Spring Security authentication
     * @return ResponseEntity with result
     */
    @PostMapping
    public ResponseEntity<String> processCheckout(@RequestBody Map<String, Object> orderData, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("Unauthenticated user attempted to create an order");
            return ResponseEntity.status(401).body("Not authenticated");
        }

        // Get authenticated user
        String email = authentication.getName();
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null) {
            logger.error("Customer not found for email: {}", email);
            return ResponseEntity.status(404).body("Customer not found");
        }

        // Verify the authenticated user matches the customer ID
        Long customerId;
        try {
            customerId = Long.parseLong(orderData.get("customerId").toString());
            if (!customer.getId().equals(customerId)) {
                logger.error("User {} attempted to create order for different customer {}", customer.getId(), customerId);
                return ResponseEntity.status(403).body("Unauthorized to create order for this customer");
            }
        } catch (NumberFormatException | NullPointerException e) {
            logger.error("Invalid or missing customerId in order data", e);
            return ResponseEntity.badRequest().body("Invalid or missing customerId in order data");
        }

        try {
            // Compose full shipping address from individual fields
            String street = orderData.get("shippingAddress") != null
                    ? orderData.get("shippingAddress").toString()
                    : (orderData.get("address") != null ? orderData.get("address").toString() : null);
            String city = orderData.get("city") != null ? orderData.get("city").toString() : null;
            String state = orderData.get("state") != null ? orderData.get("state").toString() : null;
            String zip = orderData.get("zip") != null ? orderData.get("zip").toString() : null;
            String country = orderData.get("country") != null ? orderData.get("country").toString() : null;

            if (street == null) {
                return ResponseEntity.badRequest().body("Missing shipping address");
            }

            // Build formatted address: Street, City, State ZIP, Country
            StringBuilder addressBuilder = new StringBuilder();
            if (street != null && !street.isEmpty()) addressBuilder.append(street);
            if (city != null && !city.isEmpty()) {
                if (addressBuilder.length() > 0) addressBuilder.append(", ");
                addressBuilder.append(city);
            }
            if (state != null && !state.isEmpty()) {
                if (addressBuilder.length() > 0) addressBuilder.append(", ");
                addressBuilder.append(state);
            }
            if (zip != null && !zip.isEmpty()) {
                if (addressBuilder.length() > 0) addressBuilder.append(" ");
                addressBuilder.append(zip);
            }
            if (country != null && !country.isEmpty()) {
                if (addressBuilder.length() > 0) addressBuilder.append(", ");
                addressBuilder.append(country);
            }
            String fullShippingAddress = addressBuilder.toString();

            // Create CheckoutInformation
            CheckoutInformation checkoutInformation = new CheckoutInformation();
            checkoutInformation.setOrderId(orderData.get("orderId") != null ? orderData.get("orderId").toString() : UUID.randomUUID().toString());
            checkoutInformation.setCustomerId(customerId);
            checkoutInformation.setShippingAddress(fullShippingAddress);
            checkoutInformation.setShippingMethod(orderData.get("shippingMethod") != null ? orderData.get("shippingMethod").toString() : null);
            checkoutInformation.setPaymentMethod(orderData.get("paymentMethod") != null ? orderData.get("paymentMethod").toString() : null);
            checkoutInformation.setTermsAccepted(true); // Already validated in frontend

            // Set customer info fields from orderData
            checkoutInformation.setFirstName(orderData.get("firstName") != null ? orderData.get("firstName").toString() : null);
            checkoutInformation.setLastName(orderData.get("lastName") != null ? orderData.get("lastName").toString() : null);
            checkoutInformation.setEmail(orderData.get("email") != null ? orderData.get("email").toString() : null);
            checkoutInformation.setPhone(orderData.get("phone") != null ? orderData.get("phone").toString() : null);

            // Set city, country, state, and zip from orderData if present
            checkoutInformation.setCity(city);
            checkoutInformation.setCountry(country);
            checkoutInformation.setState(state);
            checkoutInformation.setZip(zip);

            // Create Order
            Order order = new Order();
            order.setCustomer(customer);

            // Use .doubleValue() to convert directly from Double to double
            Object totalValue = orderData.get("total");
            if (totalValue instanceof Double) {
                order.setTotal(((Double) totalValue).doubleValue());
            } else if (totalValue instanceof Integer) {
                order.setTotal(((Integer) totalValue).doubleValue());
            } else if (totalValue instanceof String) {
                try {
                    order.setTotal(Double.parseDouble((String) totalValue));
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Invalid total format: " + totalValue, e);
                }
            } else {
                throw new IllegalArgumentException("Unexpected total type: " + (totalValue != null ? totalValue.getClass().getName() : "null"));
            }

            // Save shipping fee from frontend (default to 0 if not provided)
            double shippingFee = 0.0;
            if (orderData.get("shippingFee") != null) {
                try {
                    shippingFee = Double.parseDouble(orderData.get("shippingFee").toString());
                } catch (Exception e) {
                    shippingFee = 0.0;
                }
            }
            order.setShippingFee(shippingFee);

            order.setStatus("Processing");
            order.setShippingAddress(fullShippingAddress);
            order.setOrderDate(new java.util.Date());            // Save order and checkout info
            String orderId = orderService.createOrder(order, checkoutInformation, customerId);
            Order savedOrder = orderRepository.findByOrderId(orderId);
            
            // Process order items
            List<Map<String, Object>> items = null;
            Object itemsObj = orderData.get("items");
            Object productsObj = orderData.get("products");
            
            if (itemsObj instanceof List<?>) {
                List<?> itemsList = (List<?>) itemsObj;
                if (!itemsList.isEmpty() && itemsList.get(0) instanceof Map) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> checkedItems = (List<Map<String, Object>>) itemsList;
                    items = checkedItems;
                }
            } else if (productsObj instanceof List<?>) {
                List<?> productsList = (List<?>) productsObj;
                if (!productsList.isEmpty() && productsList.get(0) instanceof Map) {                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> checkedProducts = (List<Map<String, Object>>) productsList;
                    items = checkedProducts;
                }
            }

            if (items != null) {
                for (Map<String, Object> item : items) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(savedOrder);
                    
                    // Handle product details
                    Long productId = null;
                    if (item.get("id") != null) {
                        try {
                            productId = Long.parseLong(item.get("id").toString());
                        } catch (Exception e) {
                            logger.warn("Invalid product ID: {}", item.get("id"));
                        }
                    }

                    // Try to get product details from database first
                    if (productId != null) {
                        Optional<Product> product = productRepository.findById(productId);
                        if (product.isPresent()) {
                            Product p = product.get();
                            orderItem.setProductId(productId);
                            orderItem.setName(p.getName());
                            orderItem.setImage(p.getImage());
                            orderItem.setPrice(p.getPrice());
                        } else {
                            setOrderItemFromCartData(orderItem, item);
                        }
                    } else {
                        setOrderItemFromCartData(orderItem, item);
                    }

                    // Handle quantity
                    int quantity = 1;
                    if (item.get("quantity") != null) {
                        try {
                            if (item.get("quantity") instanceof Number) {
                                quantity = ((Number) item.get("quantity")).intValue();
                            } else {
                                quantity = Integer.parseInt(item.get("quantity").toString());
                            }
                        } catch (Exception e) {
                            logger.warn("Invalid quantity: {}, using default of 1", item.get("quantity"));
                        }
                    }
                    orderItem.setQuantity(quantity);

                    if (orderItem.getName() == null || orderItem.getPrice() == 0) {
                        logger.warn("OrderItem missing product details: {}", item);
                    }

                    orderItemRepository.save(orderItem);

                    // --- Deduct product stock after saving order item ---
                    if (orderItem.getProductId() != null) {
                        Optional<Product> productOpt = productRepository.findById(orderItem.getProductId());
                        if (productOpt.isPresent()) {
                            Product product = productOpt.get();
                            int currentStock = product.getStock() != null ? product.getStock() : 0;
                            int newStock = currentStock - orderItem.getQuantity();
                            if (newStock < 0) newStock = 0; // Prevent negative stock
                            product.setStock(newStock);
                            productRepository.save(product);
                        }
                    }
                }
            }

            return ResponseEntity.ok("Order created successfully with orderId: " + orderId);

        } catch (Exception e) {
            logger.error("Error processing checkout", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body("Error processing checkout: " + e.getMessage());
        }
    }

    /**
     * Helper to set order item fields from cart data.
     *
     * @param orderItem OrderItem entity
     * @param item Cart item data
     */
    private void setOrderItemFromCartData(OrderItem orderItem, Map<String, Object> item) {
        // Set product ID if available
        if (item.get("id") != null) {
            try {
                orderItem.setProductId(Long.parseLong(item.get("id").toString()));
            } catch (Exception e) {
                logger.warn("Invalid product ID in cart data: {}", item.get("id"));
            }
        }

        // Set name
        orderItem.setName(item.get("name") != null ? item.get("name").toString() : null);
        
        // Set image
        orderItem.setImage(item.get("image") != null ? item.get("image").toString() : null);
        
        // Set price
        if (item.get("price") instanceof Number) {
            orderItem.setPrice(((Number) item.get("price")).doubleValue());
        } else if (item.get("price") != null) {
            try {
                orderItem.setPrice(Double.parseDouble(item.get("price").toString()));
            } catch (Exception e) {
                logger.warn("Invalid price in cart data: {}", item.get("price"));
            }
        }
    }

    /**
     * Returns order details for a specific order (authenticated user only).
     *
     * @param orderId Order ID
     * @param authentication Spring Security authentication
     * @return OrderDetailsDTO with order info
     */
    @GetMapping("/checkout/{orderId}")
    public ResponseEntity<OrderDetailsDTO> getCheckoutInformationByOrderId(@PathVariable String orderId, Authentication authentication) {
        // Check authentication
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("Unauthenticated user attempted to access order information");
            return ResponseEntity.status(401).body(null);
        }

        // Get authenticated user
        String email = authentication.getName();
        Customer authenticatedCustomer = customerRepository.findByEmail(email);
        if (authenticatedCustomer == null) {
            logger.error("Customer not found for email: {}", email);
            return ResponseEntity.status(404).body(null);
        }

        // Get checkout and order information
        CheckoutInformation checkoutInformation = checkoutInformationRepository.findByOrderId(orderId);
        if (checkoutInformation == null) {
            return ResponseEntity.notFound().build();
        }

        Order order = orderRepository.findByOrderId(orderId);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        // Verify the authenticated user owns this order
        if (!order.getCustomer().getId().equals(authenticatedCustomer.getId())) {
            logger.error("User {} attempted to access order belonging to different customer {}", 
                authenticatedCustomer.getId(), order.getCustomer().getId());
            return ResponseEntity.status(403).body(null);
        }

        OrderDetailsDTO orderDetailsDTO = new OrderDetailsDTO();
        orderDetailsDTO.setOrderId(checkoutInformation.getOrderId());
        orderDetailsDTO.setOrderDate(order.getOrderDate() != null ? order.getOrderDate().toString() : null);
        orderDetailsDTO.setStatus(order.getStatus());
        orderDetailsDTO.setShippingMethod(checkoutInformation.getShippingMethod());
        orderDetailsDTO.setPaymentMethod(checkoutInformation.getPaymentMethod());

        // Compose a user-friendly address string
        String address = checkoutInformation.getShippingAddress();
        if (address == null || address.trim().isEmpty()) {
            StringBuilder sb = new StringBuilder();
            if (checkoutInformation.getCity() != null && !checkoutInformation.getCity().isEmpty()) sb.append(checkoutInformation.getCity());
            if (checkoutInformation.getState() != null && !checkoutInformation.getState().isEmpty()) {
                if (sb.length() > 0) sb.append(", ");
                sb.append(checkoutInformation.getState());
            }
            if (checkoutInformation.getZip() != null && !checkoutInformation.getZip().isEmpty()) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(checkoutInformation.getZip());
            }
            if (checkoutInformation.getCountry() != null && !checkoutInformation.getCountry().isEmpty()) {
                if (sb.length() > 0) sb.append(", ");
                sb.append(checkoutInformation.getCountry());
            }
            address = sb.toString();
        }
        orderDetailsDTO.setAddress(address);
        orderDetailsDTO.setFirstName(checkoutInformation.getFirstName());
        orderDetailsDTO.setLastName(checkoutInformation.getLastName());
        orderDetailsDTO.setEmail(checkoutInformation.getEmail());
        orderDetailsDTO.setPhone(checkoutInformation.getPhone());

        // Fetch order items and map to DTOs
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
        List<OrderItemDTO> itemDTOs = new ArrayList<>();
        for (OrderItem item : orderItems) {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setName(item.getName());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setPrice(item.getPrice());
            itemDTO.setImage(item.getImage());
            itemDTOs.add(itemDTO);
        }
        orderDetailsDTO.setItems(itemDTOs);
        // Use unified backend calculation for totals
        OrderTotalsDTO totals = orderCalculationService.calculateTotals(orderItems, order.getShippingFee());
        orderDetailsDTO.setTotals(totals);
        return ResponseEntity.ok(orderDetailsDTO);
    }    /**
     * Returns all orders for a customer (authenticated user only).
     *
     * @param customerId Customer ID
     * @param authentication Spring Security authentication
     * @return List of OrderDetailsDTO
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDetailsDTO>> getOrdersByCustomer(@PathVariable Long customerId, Authentication authentication) {
        if (customerId == null) {
            logger.error("No customerId provided");
            return ResponseEntity.badRequest().body(null);
        }

        try {
            // Check authentication
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.error("Unauthenticated user attempted to access orders");
                return ResponseEntity.status(401).body(null);
            }

            // Get authenticated user
            String email = authentication.getName();
            Customer authenticatedCustomer = customerRepository.findByEmail(email);
            if (authenticatedCustomer == null) {
                logger.error("Customer not found for email: {}", email);
                return ResponseEntity.status(404).body(null);
            }

            // Verify the authenticated user is accessing their own orders
            if (!authenticatedCustomer.getId().equals(customerId)) {
                logger.error("User {} attempted to access orders for different customer {}", 
                    authenticatedCustomer.getId(), customerId);
                return ResponseEntity.status(403).body(null);
            }

            // Log successful authentication
            logger.info("User {} successfully authenticated to view orders", email);

            List<Order> orders = orderRepository.findByCustomerId(customerId);
            if (orders == null || orders.isEmpty()) {
                logger.warn("No orders found for customerId: {}", customerId);
                return ResponseEntity.ok(new ArrayList<>()); // Return empty list, not error
            }

            List<OrderDetailsDTO> orderDetailsList = new ArrayList<>();
            for (Order order : orders) {
                try {
                    CheckoutInformation checkoutInfo = checkoutInformationRepository.findByOrderId(order.getOrderId());
                    List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
                    logger.info("Order {}: {} items, shippingFee={}, status={}", order.getOrderId(), orderItems.size(), order.getShippingFee(), order.getStatus());
                    for (OrderItem item : orderItems) {
                        logger.info("  Item: name={}, price={}, qty={}", item.getName(), item.getPrice(), item.getQuantity());
                    }
                    OrderDetailsDTO dto = new OrderDetailsDTO();
                    dto.setOrderId(order.getOrderId());
                    dto.setOrderDate(order.getOrderDate() != null ? order.getOrderDate().toString() : null);
                    dto.setStatus(order.getStatus());
                    if (checkoutInfo != null) {
                        dto.setShippingMethod(checkoutInfo.getShippingMethod());
                        dto.setPaymentMethod(checkoutInfo.getPaymentMethod());
                        dto.setAddress(checkoutInfo.getShippingAddress());
                        dto.setFirstName(checkoutInfo.getFirstName());
                        dto.setLastName(checkoutInfo.getLastName());
                        dto.setEmail(checkoutInfo.getEmail());
                        dto.setPhone(checkoutInfo.getPhone());
                    }
                    List<OrderItemDTO> itemDTOs = new ArrayList<>();
                    for (OrderItem item : orderItems) {
                        try {
                            OrderItemDTO itemDTO = new OrderItemDTO();
                            itemDTO.setName(item.getName());
                            itemDTO.setQuantity(item.getQuantity());
                            itemDTO.setPrice(item.getPrice());
                            itemDTO.setImage(item.getImage());
                            itemDTOs.add(itemDTO);
                        } catch (Exception e) {
                            logger.warn("Error processing order item for order {}: {}", order.getOrderId(), e.getMessage());
                        }
                    }
                    dto.setItems(itemDTOs);
                    website.ecommerce.dto.OrderTotalsDTO totals = orderCalculationService.calculateTotals(orderItems, order.getShippingFee());
                    logger.info("Order {} totals: subtotal={}, shipping={}, tax={}, total={}", order.getOrderId(), totals.getSubtotal(), totals.getShipping(), totals.getTax(), totals.getTotal());
                    dto.setTotals(totals);
                    orderDetailsList.add(dto);
                } catch (Exception e) {
                    logger.error("Error processing order {} for customerId {}: {}", 
                        order.getOrderId(), customerId, e.getMessage());
                }
            }

            return ResponseEntity.ok(orderDetailsList);
        } catch (Exception e) {
            logger.error("Error loading orders for customerId {}: {}", customerId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Calculates order totals (subtotal, shipping, tax, total) for a given cart and shipping fee.
     * This endpoint is used by the frontend to ensure totals are always consistent with backend logic.
     *
     * Request body example:
     * {
     *   "items": [ { "price": 1000, "quantity": 2 }, ... ],
     *   "shippingFee": 10
     * }
     *
     * @param payload Map with keys: items (List<Map>), shippingFee (Double)
     * @return OrderTotalsDTO with calculated totals
     */
    @PostMapping("/summary")
    public ResponseEntity<OrderTotalsDTO> calculateOrderSummary(@RequestBody Map<String, Object> payload) {
        try {
            Object itemsObj = payload.get("items");
            if (!(itemsObj instanceof List<?>)) {
                return ResponseEntity.badRequest().build();
            }
            List<?> itemsRaw = (List<?>) itemsObj;
            List<OrderItem> orderItems = new ArrayList<>();
            for (Object itemObj : itemsRaw) {
                if (!(itemObj instanceof Map)) {
                    return ResponseEntity.badRequest().build();
                }
                Map<?, ?> item = (Map<?, ?>) itemObj;
                OrderItem orderItem = new OrderItem();
                Object priceObj = item.get("price");
                Object quantityObj = item.get("quantity");
                if (priceObj == null || quantityObj == null) {
                    return ResponseEntity.badRequest().build();
                }
                orderItem.setPrice(Double.parseDouble(priceObj.toString()));
                orderItem.setQuantity(Integer.parseInt(quantityObj.toString()));
                orderItems.add(orderItem);
            }
            double shippingFee = payload.get("shippingFee") != null ? Double.parseDouble(payload.get("shippingFee").toString()) : 0.0;
            OrderTotalsDTO totals = orderCalculationService.calculateTotals(orderItems, shippingFee);
            return ResponseEntity.ok(totals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
