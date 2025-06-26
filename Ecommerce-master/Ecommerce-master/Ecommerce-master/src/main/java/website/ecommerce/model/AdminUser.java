/**
 * AdminUser entity representing an admin user in the MelodyMatrix e-commerce platform.
 * Maps to the 'admin_users' table in the database.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents an administrative user with elevated privileges.
 */
@Entity
@Table(name = "admin_users")
public class AdminUser {
    /** Unique identifier for the admin user. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique username for admin login. */
    @Column(nullable = false, unique = true)
    private String username;

    /** Hashed password for authentication. */
    @Column(nullable = false)
    private String password;

    /** Role of the admin user (e.g., SUPER_ADMIN, MANAGER). */
    @Column(nullable = false)
    private String role;

    /** Timestamp when the admin user was created. */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Gets the admin user ID.
     * @return the admin user ID
     */
    public Long getId() { return id; }
    /**
     * Sets the admin user ID.
     * @param id the admin user ID
     */
    public void setId(Long id) { this.id = id; }
    /**
     * Gets the username.
     * @return the username
     */
    public String getUsername() { return username; }
    /**
     * Sets the username.
     * @param username the username
     */
    public void setUsername(String username) { this.username = username; }
    /**
     * Gets the hashed password.
     * @return the password
     */
    public String getPassword() { return password; }
    /**
     * Sets the hashed password.
     * @param password the password
     */
    public void setPassword(String password) { this.password = password; }
    /**
     * Gets the admin role.
     * @return the role
     */
    public String getRole() { return role; }
    /**
     * Sets the admin role.
     * @param role the role
     */
    public void setRole(String role) { this.role = role; }
    /**
     * Gets the creation timestamp.
     * @return the creation time
     */
    public LocalDateTime getCreatedAt() { return createdAt; }
    /**
     * Sets the creation timestamp.
     * @param createdAt the creation time
     */
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
