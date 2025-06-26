/**
 * Product entity representing an item for sale in the MelodyMatrix e-commerce platform.
 * Maps to the 'products' table in the database.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.model;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;

/**
 * Represents a product available in the store.
 */
@Entity
@Table(name = "products")
public class Product {
    /** Unique identifier for the product. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Product name. */
    private String name;
    /** Stock keeping unit. */
    private String sku;
    /** Product category. */
    private String category;
    /** Product price. */
    private Double price;
    /** Number of items in stock. */
    private Integer stock;
    /** Product status (e.g., available, out of stock). */
    private String status;
    /** Image filename or URL. */
    private String image;
    /** Product description. */
    private String description;

    /** Timestamp when the product was created. */
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters and setters
    /**
     * Gets the product ID.
     * @return the product ID
     */
    public Long getId() {
        return id;
    }
    /**
     * Sets the product ID.
     * @param id the product ID
     */
    public void setId(Long id) {
        this.id = id;
    }
    /**
     * Gets the product name.
     * @return the product name
     */
    public String getName() {
        return name;
    }
    /**
     * Sets the product name.
     * @param name the product name
     */
    public void setName(String name) {
        this.name = name;
    }
    /**
     * Gets the SKU.
     * @return the SKU
     */
    public String getSku() {
        return sku;
    }
    /**
     * Sets the SKU.
     * @param sku the SKU
     */
    public void setSku(String sku) {
        this.sku = sku;
    }
    /**
     * Gets the category.
     * @return the category
     */
    public String getCategory() {
        return category;
    }
    /**
     * Sets the category.
     * @param category the category
     */
    public void setCategory(String category) {
        this.category = category;
    }
    /**
     * Gets the price.
     * @return the price
     */
    public Double getPrice() {
        return price;
    }
    /**
     * Sets the price.
     * @param price the price
     */
    public void setPrice(Double price) {
        this.price = price;
    }
    /**
     * Gets the stock quantity.
     * @return the stock
     */
    public Integer getStock() {
        return stock;
    }
    /**
     * Sets the stock quantity.
     * @param stock the stock
     */
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    /**
     * Gets the product status.
     * @return the status
     */
    public String getStatus() {
        return status;
    }
    /**
     * Sets the product status.
     * @param status the status
     */
    public void setStatus(String status) {
        this.status = status;
    }
    /**
     * Gets the image filename or URL.
     * @return the image
     */
    public String getImage() {
        return image;
    }
    /**
     * Sets the image filename or URL.
     * @param image the image
     */
    public void setImage(String image) {
        this.image = image;
    }
    /**
     * Gets the product description.
     * @return the description
     */
    public String getDescription() {
        return description;
    }
    /**
     * Sets the product description.
     * @param description the description
     */
    public void setDescription(String description) {
        this.description = description;
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
}