package website.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import website.ecommerce.model.CheckoutInformation;

public interface CheckoutInformationRepository extends JpaRepository<CheckoutInformation, Long> {
    CheckoutInformation findByOrderId(String orderId);
    java.util.Optional<CheckoutInformation> findTopByCustomerIdOrderByIdDesc(Long customerId);
}