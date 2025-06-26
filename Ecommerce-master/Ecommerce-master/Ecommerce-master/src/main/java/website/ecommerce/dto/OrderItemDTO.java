package website.ecommerce.dto;

/**
 * OrderItemDTO is a Data Transfer Object for transferring order item data
 * (name, quantity, price, image) between layers in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */

/**
 * DTO for transferring order item data between layers.
 */
public class OrderItemDTO {
    /** Name of the product. */
    private String name;
    /** Quantity of the product ordered. */
    private int quantity;
    /** Price per unit at the time of order. */
    private double price;
    /** Image filename or URL for the product. */
    private String image;

    /**
     * Default constructor.
     */
    public OrderItemDTO() {}

    /**
     * Gets the product name.
     * @return the product name
     */
    public String getName() { return name; }
    /**
     * Sets the product name.
     * @param name the product name
     */
    public void setName(String name) { this.name = name; }
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
     * Gets the image filename or URL.
     * @return the image
     */
    public String getImage() { return image; }
    /**
     * Sets the image filename or URL.
     * @param image the image
     */
    public void setImage(String image) { this.image = image; }
}
