/**
 * OrderTotalsDTO is a Data Transfer Object for representing order totals breakdown
 * (subtotal, shipping, tax, total) in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.dto;

/**
 * DTO for order totals breakdown.
 */
public class OrderTotalsDTO {
    /** Subtotal amount for the order. */
    private double subtotal;
    /** Shipping cost for the order. */
    private double shipping;
    /** Tax amount for the order. */
    private double tax;
    /** Total amount for the order. */
    private double total;

    /**
     * Default constructor.
     */
    public OrderTotalsDTO() {}

    /**
     * Gets the subtotal amount.
     * @return the subtotal
     */
    public double getSubtotal() { return subtotal; }
    /**
     * Sets the subtotal amount.
     * @param subtotal the subtotal
     */
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    /**
     * Gets the shipping cost.
     * @return the shipping cost
     */
    public double getShipping() { return shipping; }
    /**
     * Sets the shipping cost.
     * @param shipping the shipping cost
     */
    public void setShipping(double shipping) { this.shipping = shipping; }
    /**
     * Gets the tax amount.
     * @return the tax
     */
    public double getTax() { return tax; }
    /**
     * Sets the tax amount.
     * @param tax the tax
     */
    public void setTax(double tax) { this.tax = tax; }
    /**
     * Gets the total amount.
     * @return the total
     */
    public double getTotal() { return total; }
    /**
     * Sets the total amount.
     * @param total the total
     */
    public void setTotal(double total) { this.total = total; }
}
