/**
 * CustomUserDetailsService implements Spring Security's UserDetailsService
 * for authenticating customers in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.service;

import website.ecommerce.model.Customer;
import website.ecommerce.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

/**
 * Service for loading customer details for authentication.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    /** Repository for accessing customer data. */
    private final CustomerRepository customerRepository;

    /**
     * Constructor for dependency injection.
     * @param customerRepository the customer repository
     */
    public CustomUserDetailsService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    /**
     * Loads a customer by email for authentication.
     * @param email the customer's email address
     * @return UserDetails for Spring Security
     * @throws UsernameNotFoundException if no customer is found
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new org.springframework.security.core.userdetails.User(
            customer.getEmail(),
            customer.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority("USER"))
        );
    }
}