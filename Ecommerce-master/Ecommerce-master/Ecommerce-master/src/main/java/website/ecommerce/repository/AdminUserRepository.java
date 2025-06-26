package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.AdminUser;

/**
 * AdminUserRepository provides database access methods for AdminUser entities
 * in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */

/**
 * Repository interface for AdminUser entity.
 * Extends JpaRepository to provide CRUD operations and custom queries.
 */
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    /**
     * Finds an admin user by username (case-insensitive).
     * @param username the username to search for
     * @return the AdminUser if found, otherwise null
     */
    AdminUser findByUsernameIgnoreCase(String username);
}
