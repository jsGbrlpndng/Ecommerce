/**
 * CheckoutInformationRepository provides database access methods for CheckoutInformation entities
 * in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.CheckoutInformation;

/**
 * Repository interface for CheckoutInformation entity.
 * Extends JpaRepository to provide CRUD operations and custom queries.
 */
public interface CheckoutInformationRepository extends JpaRepository<CheckoutInformation, Long> {
    /**
     * Finds checkout information by order ID.
     * @param orderId the order ID to search for
     * @return the CheckoutInformation if found, otherwise null
     */
    CheckoutInformation findByOrderId(String orderId);

    /**
     * Finds the most recent checkout information for a customer.
     * @param customerId the customer ID to search for
     * @return an Optional containing the most recent CheckoutInformation, if any
     */
    java.util.Optional<CheckoutInformation> findTopByCustomerIdOrderByIdDesc(Long customerId);
}