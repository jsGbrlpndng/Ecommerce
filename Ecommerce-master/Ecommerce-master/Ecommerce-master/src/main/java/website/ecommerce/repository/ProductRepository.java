/**
 * ProductRepository provides database access methods for Product entities
 * in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.repository;

import website.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Product entity.
 * Extends JpaRepository to provide CRUD operations.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {
}