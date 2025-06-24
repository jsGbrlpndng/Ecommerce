package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.Customer;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String email);
    List<Customer> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String firstName, String lastName, String email);
}