/**
 * OrderService provides business logic for creating and managing orders
 * in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import website.ecommerce.model.CheckoutInformation;
import website.ecommerce.model.Order;
import website.ecommerce.model.Customer;
import website.ecommerce.repository.CheckoutInformationRepository;
import website.ecommerce.repository.OrderRepository;
import website.ecommerce.repository.CustomerRepository;

import java.util.UUID;

/**
 * Service for order creation and management.
 */
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CheckoutInformationRepository checkoutInformationRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Creates a new order and associated checkout information for a customer.
     *
     * @param order the order to create
     * @param checkoutInformation the checkout information to associate
     * @param customerId the ID of the customer placing the order
     * @return the generated or assigned order ID
     * @throws IllegalArgumentException if any argument is null or customer not found
     */
    @Transactional
    public String createOrder(Order order, CheckoutInformation checkoutInformation, Long customerId) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }

        if (checkoutInformation == null) {
            throw new IllegalArgumentException("CheckoutInformation cannot be null");
        }

        if (customerId == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }

        // Use orderId from order if present, otherwise generate a new one
        String orderId = order.getOrderId();
        if (orderId == null || orderId.isEmpty()) {
            orderId = UUID.randomUUID().toString();
        }
        order.setOrderId(orderId);
        checkoutInformation.setOrderId(orderId);

        // Set Customer
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer with ID " + customerId + " not found"));
        order.setCustomer(customer);

        // Save both entities to the database
        orderRepository.save(order);
        checkoutInformationRepository.save(checkoutInformation);

        // Increment the customer's orders count and save
        customer.setOrders(customer.getOrders() + 1);
        customerRepository.save(customer);

        return orderId;
    }
}