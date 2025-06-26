/**
 * OrderRepository provides database access methods for Order entities
 * in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.Order;
import java.util.List;

/**
 * Repository interface for Order entity.
 * Extends JpaRepository to provide CRUD operations and custom queries.
 */
public interface OrderRepository extends JpaRepository<Order, Long> {
    /**
     * Finds orders by customer ID.
     * @param customerId the customer ID to search for
     * @return list of orders for the given customer
     */
    List<Order> findByCustomerId(Long customerId);

    /**
     * Finds an order by its order ID string.
     * @param orderId the order ID string to search for
     * @return the Order if found, otherwise null
     */
    Order findByOrderId(String orderId);
}