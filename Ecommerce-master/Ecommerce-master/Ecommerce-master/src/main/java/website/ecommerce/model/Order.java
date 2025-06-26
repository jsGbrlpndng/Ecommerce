/**
 * Order entity representing a customer order in the MelodyMatrix e-commerce platform.
 * Maps to the 'orders' table in the database.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.model;

import jakarta.persistence.*;
import java.util.Date;

/**
 * Represents a customer order, including order details and customer reference.
 */
@Entity
@Table(name = "orders")
public class Order {

    /** Unique identifier for the order. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Order identifier string. */
    @Column(name = "order_id")
    private String orderId;

    /** Date and time when the order was placed. */
    @Column(name = "order_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;

    /** Order status (e.g., pending, shipped, delivered). */
    private String status;
    /** Total order amount. */
    private double total;

    /** Shipping address for the order. */
    @Column(name = "shipping_address")
    private String shippingAddress;

    /** Shipping fee for the order. */
    @Column(name = "shipping_fee")
    private double shippingFee = 0.0;

    /** Customer who placed the order. */
    @ManyToOne
    @JoinColumn(name = "customer_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Customer customer;

    // Constructors
    /** Default constructor. */
    public Order() {}

    /**
     * Gets the order ID.
     * @return the order ID
     */
    public Long getId() {
        return id;
    }
    /**
     * Sets the order ID.
     * @param id the order ID
     */
    public void setId(Long id) {
        this.id = id;
    }
    /**
     * Gets the order identifier string.
     * @return the order identifier
     */
    public String getOrderId() {
        return orderId;
    }
    /**
     * Sets the order identifier string.
     * @param orderId the order identifier
     */
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    /**
     * Gets the order date.
     * @return the order date
     */
    public Date getOrderDate() {
        return orderDate;
    }
    /**
     * Sets the order date.
     * @param orderDate the order date
     */
    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }
    /**
     * Gets the order status.
     * @return the status
     */
    public String getStatus() {
        return status;
    }
    /**
     * Sets the order status.
     * @param status the status
     */
    public void setStatus(String status) {
        this.status = status;
    }
    /**
     * Gets the total order amount.
     * @return the total
     */
    public double getTotal() {
        return total;
    }
    /**
     * Sets the total order amount.
     * @param total the total
     */
    public void setTotal(double total) {
        this.total = total;
    }
    /**
     * Gets the shipping address.
     * @return the shipping address
     */
    public String getShippingAddress() {
        return shippingAddress;
    }
    /**
     * Sets the shipping address.
     * @param shippingAddress the shipping address
     */
    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
    /**
     * Gets the shipping fee.
     * @return the shipping fee
     */
    public double getShippingFee() {
        return shippingFee;
    }
    /**
     * Sets the shipping fee.
     * @param shippingFee the shipping fee
     */
    public void setShippingFee(double shippingFee) {
        this.shippingFee = shippingFee;
    }
    /**
     * Gets the customer who placed the order.
     * @return the customer
     */
    public Customer getCustomer() {
        return customer;
    }
    /**
     * Sets the customer who placed the order.
     * @param customer the customer
     */
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}