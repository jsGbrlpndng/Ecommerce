/**
 * CheckoutInformation entity representing checkout and shipping details in the MelodyMatrix e-commerce platform.
 * Maps to the 'checkout_information' table in the database.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.model;

import jakarta.persistence.*;

/**
 * Represents checkout and shipping information for an order.
 */
@Entity
@Table(name = "checkout_information")
public class CheckoutInformation {

    /** Unique identifier for the checkout information. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Order identifier. */
    @Column(name = "order_id")
    private String orderId;

    /** Customer identifier. */
    @Column(name = "customer_id")
    private Long customerId;

    /** Shipping address. */
    @Column(name = "shipping_address")
    private String shippingAddress;

    /** City. */
    private String city;
    /** State or province. */
    private String state;
    /** Postal/ZIP code. */
    private String zip;
    /** Country. */
    private String country;

    /** Shipping method. */
    @Column(name = "shipping_method")
    private String shippingMethod;

    /** Payment method. */
    @Column(name = "payment_method")
    private String paymentMethod;

    /** Indicates if terms and conditions were accepted. */
    @Column(name = "terms_accepted")
    private boolean termsAccepted;

    // --- New fields for customer info ---
    /** Customer's first name. */
    @Column(name = "first_name")
    private String firstName;
    /** Customer's last name. */
    @Column(name = "last_name")
    private String lastName;
    /** Customer's email address. */
    @Column(name = "email")
    private String email;
    /** Customer's phone number. */
    @Column(name = "phone")
    private String phone;

    // --- Getters and Setters ---
    /**
     * Gets the checkout information ID.
     * @return the ID
     */
    public Long getId() {
        return id;
    }
    /**
     * Sets the checkout information ID.
     * @param id the ID
     */
    public void setId(Long id) {
        this.id = id;
    }
    /**
     * Gets the order identifier.
     * @return the order ID
     */
    public String getOrderId() {
        return orderId;
    }
    /**
     * Sets the order identifier.
     * @param orderId the order ID
     */
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    /**
     * Gets the customer identifier.
     * @return the customer ID
     */
    public Long getCustomerId() {
        return customerId;
    }
    /**
     * Sets the customer identifier.
     * @param customerId the customer ID
     */
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
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
     * Gets the city.
     * @return the city
     */
    public String getCity() {
        return city;
    }
    /**
     * Sets the city.
     * @param city the city
     */
    public void setCity(String city) {
        this.city = city;
    }
    /**
     * Gets the state or province.
     * @return the state
     */
    public String getState() {
        return state;
    }
    /**
     * Sets the state or province.
     * @param state the state
     */
    public void setState(String state) {
        this.state = state;
    }
    /**
     * Gets the postal/ZIP code.
     * @return the ZIP code
     */
    public String getZip() {
        return zip;
    }
    /**
     * Sets the postal/ZIP code.
     * @param zip the ZIP code
     */
    public void setZip(String zip) {
        this.zip = zip;
    }
    /**
     * Gets the country.
     * @return the country
     */
    public String getCountry() {
        return country;
    }
    /**
     * Sets the country.
     * @param country the country
     */
    public void setCountry(String country) {
        this.country = country;
    }
    /**
     * Gets the shipping method.
     * @return the shipping method
     */
    public String getShippingMethod() {
        return shippingMethod;
    }
    /**
     * Sets the shipping method.
     * @param shippingMethod the shipping method
     */
    public void setShippingMethod(String shippingMethod) {
        this.shippingMethod = shippingMethod;
    }
    /**
     * Gets the payment method.
     * @return the payment method
     */
    public String getPaymentMethod() {
        return paymentMethod;
    }
    /**
     * Sets the payment method.
     * @param paymentMethod the payment method
     */
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    /**
     * Checks if terms and conditions were accepted.
     * @return true if accepted, false otherwise
     */
    public boolean isTermsAccepted() {
        return termsAccepted;
    }
    /**
     * Sets the terms accepted flag.
     * @param termsAccepted true if accepted, false otherwise
     */
    public void setTermsAccepted(boolean termsAccepted) {
        this.termsAccepted = termsAccepted;
    }
    /**
     * Gets the customer's first name.
     * @return the first name
     */
    public String getFirstName() {
        return firstName;
    }
    /**
     * Sets the customer's first name.
     * @param firstName the first name
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    /**
     * Gets the customer's last name.
     * @return the last name
     */
    public String getLastName() {
        return lastName;
    }
    /**
     * Sets the customer's last name.
     * @param lastName the last name
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    /**
     * Gets the customer's email address.
     * @return the email
     */
    public String getEmail() {
        return email;
    }
    /**
     * Sets the customer's email address.
     * @param email the email
     */
    public void setEmail(String email) {
        this.email = email;
    }
    /**
     * Gets the customer's phone number.
     * @return the phone
     */
    public String getPhone() {
        return phone;
    }
    /**
     * Sets the customer's phone number.
     * @param phone the phone
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }
}