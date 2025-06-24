package website.ecommerce.dto;

public class OrderTotalsDTO {
    private double subtotal;
    private double shipping;
    private double tax;
    private double total;

    public OrderTotalsDTO() {}

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getShipping() { return shipping; }
    public void setShipping(double shipping) { this.shipping = shipping; }

    public double getTax() { return tax; }
    public void setTax(double tax) { this.tax = tax; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
}
