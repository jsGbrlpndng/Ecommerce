package website.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import website.ecommerce.repository.ProductRepository;
import website.ecommerce.model.Product;
import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
      public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        System.out.println("Number of products found in database: " + products.size());
        return products;
    }
    
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
    
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    // Add more service methods
}