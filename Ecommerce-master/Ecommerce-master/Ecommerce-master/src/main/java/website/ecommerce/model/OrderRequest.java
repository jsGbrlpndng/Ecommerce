/**
 * OrderRequest DTO for encapsulating order and checkout information in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.model;

/**
 * Data Transfer Object for order placement, containing checkout and order details.
 */
public class OrderRequest {

    /** Checkout information for the order. */
    private CheckoutInformation checkoutInformation;
    /** Order details. */
    private Order order;

    /**
     * Gets the checkout information.
     * @return the checkout information
     */
    public CheckoutInformation getCheckoutInformation() {
        return checkoutInformation;
    }

    /**
     * Sets the checkout information.
     * @param checkoutInformation the checkout information
     */
    public void setCheckoutInformation(CheckoutInformation checkoutInformation) {
        this.checkoutInformation = checkoutInformation;
    }

    /**
     * Gets the order details.
     * @return the order
     */
    public Order getOrder() {
        return order;
    }

    /**
     * Sets the order details.
     * @param order the order
     */
    public void setOrder(Order order) {
        this.order = order;
    }
}