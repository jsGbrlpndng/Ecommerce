package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.Customer;

import java.util.List;

/**
 * CustomerRepository provides database access methods for Customer entities
 * in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */

/**
 * Repository interface for Customer entity.
 * Extends JpaRepository to provide CRUD operations and custom queries.
 */
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    /**
     * Finds a customer by email address.
     *
     * @param email the email address to search for
     * @return the Customer if found, otherwise null
     */
    Customer findByEmail(String email);

    /**
     * Finds customers by first name, last name, or email (case-insensitive, partial match).
     *
     * @param firstName the first name to search for
     * @param lastName  the last name to search for
     * @param email     the email to search for
     * @return list of matching customers
     */
    List<Customer> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName, String lastName, String email);
}