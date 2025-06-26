/**
 * ProductService provides business logic for managing products
 * in the MelodyMatrix e-commerce platform.
 *
 * @author MelodyMatrix Team
 */
package website.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import website.ecommerce.repository.ProductRepository;
import website.ecommerce.model.Product;
import java.util.List;

/**
 * Service for product management operations.
 */
@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    /**
     * Retrieves all products from the database.
     * @return list of all products
     */
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        System.out.println("Number of products found in database: " + products.size());
        return products;
    }

    /**
     * Saves a product to the database.
     * @param product the product to save
     * @return the saved product
     */
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    /**
     * Retrieves a product by its ID.
     * @param id the product ID
     * @return the product if found, otherwise null
     */
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    /**
     * Deletes a product by its ID.
     * @param id the product ID
     */
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    // Add more service methods as needed
}