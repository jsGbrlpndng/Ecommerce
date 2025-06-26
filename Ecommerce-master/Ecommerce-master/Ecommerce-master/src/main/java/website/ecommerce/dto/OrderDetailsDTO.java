/**
 * OrderDetailsDTO is a Data Transfer Object for transferring detailed order information
 * (including customer, shipping, payment, items, and totals) between layers in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.dto;

import java.util.List;

/**
 * DTO for transferring order details data between layers.
 * Includes order metadata, customer/shipping info, item list, and totals.
 */
public class OrderDetailsDTO {
    /** Unique order identifier. */
    private String orderId;
    /** Order date as a string. */
    private String orderDate;
    /** Order status (e.g., pending, shipped, delivered). */
    private String status;
    /** Shipping method used for the order. */
    private String shippingMethod;
    /** Payment method used for the order. */
    private String paymentMethod;
    /** Shipping address. */
    private String address;
    /** Customer's first name. */
    private String firstName;
    /** Customer's last name. */
    private String lastName;
    /** Customer's email address. */
    private String email;
    /** Customer's phone number. */
    private String phone;
    /** List of items in the order. */
    private List<OrderItemDTO> items;
    /** Totals breakdown for the order. */
    private OrderTotalsDTO totals;

    /**
     * Default constructor.
     */
    public OrderDetailsDTO() {}

    /**
     * Gets the order ID.
     * @return the order ID
     */
    public String getOrderId() { return orderId; }
    /**
     * Sets the order ID.
     * @param orderId the order ID
     */
    public void setOrderId(String orderId) { this.orderId = orderId; }
    /**
     * Gets the order date.
     * @return the order date
     */
    public String getOrderDate() { return orderDate; }
    /**
     * Sets the order date.
     * @param orderDate the order date
     */
    public void setOrderDate(String orderDate) { this.orderDate = orderDate; }
    /**
     * Gets the order status.
     * @return the status
     */
    public String getStatus() { return status; }
    /**
     * Sets the order status.
     * @param status the status
     */
    public void setStatus(String status) { this.status = status; }
    /**
     * Gets the shipping method.
     * @return the shipping method
     */
    public String getShippingMethod() { return shippingMethod; }
    /**
     * Sets the shipping method.
     * @param shippingMethod the shipping method
     */
    public void setShippingMethod(String shippingMethod) { this.shippingMethod = shippingMethod; }
    /**
     * Gets the payment method.
     * @return the payment method
     */
    public String getPaymentMethod() { return paymentMethod; }
    /**
     * Sets the payment method.
     * @param paymentMethod the payment method
     */
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    /**
     * Gets the shipping address.
     * @return the address
     */
    public String getAddress() { return address; }
    /**
     * Sets the shipping address.
     * @param address the address
     */
    public void setAddress(String address) { this.address = address; }
    /**
     * Gets the customer's first name.
     * @return the first name
     */
    public String getFirstName() { return firstName; }
    /**
     * Sets the customer's first name.
     * @param firstName the first name
     */
    public void setFirstName(String firstName) { this.firstName = firstName; }
    /**
     * Gets the customer's last name.
     * @return the last name
     */
    public String getLastName() { return lastName; }
    /**
     * Sets the customer's last name.
     * @param lastName the last name
     */
    public void setLastName(String lastName) { this.lastName = lastName; }
    /**
     * Gets the customer's email address.
     * @return the email
     */
    public String getEmail() { return email; }
    /**
     * Sets the customer's email address.
     * @param email the email
     */
    public void setEmail(String email) { this.email = email; }
    /**
     * Gets the customer's phone number.
     * @return the phone
     */
    public String getPhone() { return phone; }
    /**
     * Sets the customer's phone number.
     * @param phone the phone
     */
    public void setPhone(String phone) { this.phone = phone; }
    /**
     * Gets the list of order items.
     * @return the list of items
     */
    public List<OrderItemDTO> getItems() { return items; }
    /**
     * Sets the list of order items.
     * @param items the list of items
     */
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
    /**
     * Gets the order totals breakdown.
     * @return the totals
     */
    public OrderTotalsDTO getTotals() { return totals; }
    /**
     * Sets the order totals breakdown.
     * @param totals the totals
     */
    public void setTotals(OrderTotalsDTO totals) { this.totals = totals; }
}
