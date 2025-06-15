package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.AdminUser;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    AdminUser findByUsernameIgnoreCase(String username);
}
