package website.ecommerce.dto;

/**
 * LoginRequest is a Data Transfer Object for user authentication requests
 * in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */

/**
 * DTO for login requests.
 */
public class LoginRequest {
    /** User's email address. */
    private String email;
    /** User's password. */
    private String password;

    /**
     * No-args constructor (required for Spring).
     */
    public LoginRequest() {}

    /**
     * Gets the user's email address.
     * @return the email
     */
    public String getEmail() { return email; }
    /**
     * Sets the user's email address.
     * @param email the email
     */
    public void setEmail(String email) { this.email = email; }
    /**
     * Gets the user's password.
     * @return the password
     */
    public String getPassword() { return password; }
    /**
     * Sets the user's password.
     * @param password the password
     */
    public void setPassword(String password) { this.password = password; }
}