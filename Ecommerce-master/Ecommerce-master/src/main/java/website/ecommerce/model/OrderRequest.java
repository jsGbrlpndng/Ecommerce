package website.ecommerce.model;

public class OrderRequest {

    private CheckoutInformation checkoutInformation;
    private Order order;

    public CheckoutInformation getCheckoutInformation() {
        return checkoutInformation;
    }

    public void setCheckoutInformation(CheckoutInformation checkoutInformation) {
        this.checkoutInformation = checkoutInformation;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}