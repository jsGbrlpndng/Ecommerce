/**
 * OrderItemRepository provides database access methods for OrderItem entities
 * in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.OrderItem;
import website.ecommerce.model.Order;
import java.util.List;

/**
 * Repository interface for OrderItem entity.
 * Extends JpaRepository to provide CRUD operations and custom queries.
 */
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    /**
     * Finds order items by order entity.
     * @param order the order to search for
     * @return list of order items for the given order
     */
    List<OrderItem> findByOrder(Order order);

    /**
     * Finds order items by order ID.
     * @param orderId the order ID to search for
     * @return list of order items for the given order ID
     */
    List<OrderItem> findByOrderId(Long orderId);
}
