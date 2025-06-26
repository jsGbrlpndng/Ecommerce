/**
 * OrderItem entity representing an item in an order in the MelodyMatrix e-commerce platform.
 * Maps to the 'order_items' table in the database.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.model;

import jakarta.persistence.*;

/**
 * Represents a single item within an order, including product snapshot details.
 */
@Entity
@Table(name = "order_items")
public class OrderItem {
    /** Unique identifier for the order item. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The order this item belongs to. */
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    /** Product ID for the item. */
    @Column(name = "product_id")
    private Long productId;

    /** Quantity of the product ordered. */
    private int quantity;
    /** Price per unit at the time of order. */
    private double price;

    /** Product name snapshot. */
    private String name;
    /** Product image snapshot. */
    private String image;

    /** Default constructor. */
    public OrderItem() {}

    /**
     * Gets the order item ID.
     * @return the order item ID
     */
    public Long getId() { return id; }
    /**
     * Sets the order item ID.
     * @param id the order item ID
     */
    public void setId(Long id) { this.id = id; }
    /**
     * Gets the order.
     * @return the order
     */
    public Order getOrder() { return order; }
    /**
     * Sets the order.
     * @param order the order
     */
    public void setOrder(Order order) { this.order = order; }
    /**
     * Gets the product ID.
     * @return the product ID
     */
    public Long getProductId() { return productId; }
    /**
     * Sets the product ID.
     * @param productId the product ID
     */
    public void setProductId(Long productId) { this.productId = productId; }
    /**
     * Gets the quantity ordered.
     * @return the quantity
     */
    public int getQuantity() { return quantity; }
    /**
     * Sets the quantity ordered.
     * @param quantity the quantity
     */
    public void setQuantity(int quantity) { this.quantity = quantity; }
    /**
     * Gets the price per unit.
     * @return the price
     */
    public double getPrice() { return price; }
    /**
     * Sets the price per unit.
     * @param price the price
     */
    public void setPrice(double price) { this.price = price; }
    /**
     * Gets the product name snapshot.
     * @return the name
     */
    public String getName() { return name; }
    /**
     * Sets the product name snapshot.
     * @param name the name
     */
    public void setName(String name) { this.name = name; }
    /**
     * Gets the product image snapshot.
     * @return the image
     */
    public String getImage() { return image; }
    /**
     * Sets the product image snapshot.
     * @param image the image
     */
    public void setImage(String image) { this.image = image; }
}
