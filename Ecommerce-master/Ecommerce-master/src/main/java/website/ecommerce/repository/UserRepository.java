package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email); // <-- Add this line
}