/**
 * LoginRequest DTO for user authentication in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.model;

/**
 * Data Transfer Object for login requests.
 */
public class LoginRequest {
    /** Username for login. */
    private String username;
    /** Password for login. */
    private String password;

    /**
     * Gets the username.
     * @return the username
     */
    public String getUsername() {
        return username;
    }
    /**
     * Sets the username.
     * @param username the username
     */
    public void setUsername(String username) {
        this.username = username;
    }
    /**
     * Gets the password.
     * @return the password
     */
    public String getPassword() {
        return password;
    }
    /**
     * Sets the password.
     * @param password the password
     */
    public void setPassword(String password) {
        this.password = password;
    }
}