package website.ecommerce.service;

import org.springframework.stereotype.Service;
import website.ecommerce.model.OrderItem;
import website.ecommerce.dto.OrderTotalsDTO;
import java.util.List;

@Service
public class OrderCalculationService {
    private static final double VAT_RATE = 0.12;

    public OrderTotalsDTO calculateTotals(List<OrderItem> orderItems, double shippingFee) {
        double subtotal = 0.0;
        for (OrderItem item : orderItems) {
            subtotal += item.getPrice() * item.getQuantity();
        }
        double shipping = shippingFee;
        // Round subtotal and shipping BEFORE tax calculation for consistency
        double subtotalRounded = roundToTwoDecimals(subtotal);
        double shippingRounded = roundToTwoDecimals(shipping);
        double tax = roundToTwoDecimals((subtotalRounded + shippingRounded) * VAT_RATE);
        double total = roundToTwoDecimals(subtotalRounded + shippingRounded + tax);
        OrderTotalsDTO totals = new OrderTotalsDTO();
        totals.setSubtotal(subtotalRounded);
        totals.setShipping(shippingRounded);
        totals.setTax(tax);
        totals.setTotal(total);
        return totals;
    }

    private double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
