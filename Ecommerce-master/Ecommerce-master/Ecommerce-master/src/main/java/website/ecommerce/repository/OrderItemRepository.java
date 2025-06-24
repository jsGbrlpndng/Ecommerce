package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.OrderItem;
import website.ecommerce.model.Order;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
    List<OrderItem> findByOrderId(Long orderId);
}
