package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String email);
}