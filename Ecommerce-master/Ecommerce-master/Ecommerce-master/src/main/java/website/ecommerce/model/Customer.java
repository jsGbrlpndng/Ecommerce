/**
 * Customer entity representing a customer in the MelodyMatrix e-commerce platform.
 * Maps to the 'customers' table in the database.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

/**
 * Represents a customer, including personal and address information, and associated orders.
 */
@Entity
@Table(name = "customers")
public class Customer {

    /** Unique identifier for the customer. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Customer's first name. */
    private String firstName;
    /** Customer's last name. */
    private String lastName;
    /** Customer's email address. */
    private String email;
    /** Hashed password for authentication. */
    private String password;
    /** Customer's phone number. */
    private String phone;
    /** Indicates if the customer account is active. */
    @Column(name = "status")
    private boolean status = true;

    /** Timestamp when the customer was created. */
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /** Total number of orders placed by the customer. */
    @Column(name = "orders")
    private int orders;

    // Constructors
    /** Default constructor. */
    public Customer() {}

    /**
     * Parameterized constructor for creating a customer.
     */
    public Customer(String firstName, String lastName, String email, String password, String phone) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

    /**
     * Gets the customer ID.
     * @return the customer ID
     */
    public Long getId() {
        return id;
    }
    /**
     * Sets the customer ID.
     * @param id the customer ID
     */
    public void setId(Long id) {
        this.id = id;
    }
    /**
     * Gets the first name.
     * @return the first name
     */
    public String getFirstName() {
        return firstName;
    }
    /**
     * Sets the first name.
     * @param firstName the first name
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    /**
     * Gets the last name.
     * @return the last name
     */
    public String getLastName() {
        return lastName;
    }
    /**
     * Sets the last name.
     * @param lastName the last name
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    /**
     * Gets the email address.
     * @return the email
     */
    public String getEmail() {
        return email;
    }
    /**
     * Sets the email address.
     * @param email the email
     */
    public void setEmail(String email) {
        this.email = email;
    }
    /**
     * Gets the hashed password.
     * @return the password
     */
    public String getPassword() {
        return password;
    }
    /**
     * Sets the hashed password.
     * @param password the password
     */
    public void setPassword(String password) {
        this.password = password;
    }
    /**
     * Gets the phone number.
     * @return the phone
     */
    public String getPhone() {
        return phone;
    }
    /**
     * Sets the phone number.
     * @param phone the phone
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }
    /**
     * Checks if the customer account is active.
     * @return true if active, false otherwise
     */
    public boolean isStatus() {
        return status;
    }
    /**
     * Sets the status (active/inactive).
     * @param status true if active, false otherwise
     */
    public void setStatus(boolean status) {
        this.status = status;
    }
    /**
     * Gets the creation timestamp.
     * @return the creation time
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    /**
     * Sets the creation timestamp.
     * @param createdAt the creation time
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    /**
     * Gets the total number of orders placed by the customer.
     * @return the order count
     */
    public int getOrders() {
        return orders;
    }
    /**
     * Sets the total number of orders placed by the customer.
     * @param orders the order count
     */
    public void setOrders(int orders) {
        this.orders = orders;
    }
}