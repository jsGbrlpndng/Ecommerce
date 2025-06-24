package website.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import website.ecommerce.model.Product;
import website.ecommerce.service.ProductService;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            System.out.println("Number of products returned from service: " + products.size());
            for (Product product : products) {
                System.out.println("Product: " + product);
                if (product.getImage() != null && !product.getImage().isEmpty() && !product.getImage().startsWith("/uploads/")) {
                    product.setImage("/uploads/images/instruments/" + product.getImage().replaceAll("^/+", ""));
                }
            }
            return products;
        } catch (Exception e) {
            System.err.println("Exception in getAllProducts: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping
    public Product addProduct(
            @RequestParam("name") String name,
            @RequestParam("sku") String sku,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("stock") int stock,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam(value = "description", required = false) String description
    ) {
        Product product = new Product();
        product.setName(name);
        product.setSku(sku);
        product.setCategory(category);
        product.setPrice(price);
        product.setStock(stock);
        product.setDescription(description);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImageFile(imageFile);
            product.setImage(imagePath);
        }

        return productService.saveProduct(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("sku") String sku,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("stock") int stock,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam(value = "description", required = false) String description
    ) {
        Product product = productService.getProductById(id);
        if (product == null) throw new RuntimeException("Product not found");

        product.setName(name);
        product.setSku(sku);
        product.setCategory(category);
        product.setPrice(price);
        product.setStock(stock);
        product.setDescription(description);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImageFile(imageFile);
            product.setImage(imagePath);
        }

        return productService.saveProduct(product);
    }

    @PostMapping("/test")
    public String testEndpoint() {
        System.out.println("Test endpoint hit");
        return "Test OK";
    }

    @PostMapping("/{id}/update")
    public Product updateProductPost(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("sku") String sku,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("stock") int stock,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        Product product = productService.getProductById(id);
        if (product == null) throw new RuntimeException("Product not found");

        product.setName(name);
        product.setSku(sku);
        product.setCategory(category);
        product.setPrice(price);
        product.setStock(stock);

        // Only update image if a new file is uploaded
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImageFile(imageFile);
            product.setImage(imagePath);
        }
        // else: do NOT overwrite the image field

        return productService.saveProduct(product);
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    private String saveImageFile(MultipartFile imageFile) {
        try {
            // Use absolute path for uploads directory
            String uploadDir = new java.io.File("").getAbsolutePath() + "/uploads/images/instruments/";
            java.io.File dir = new java.io.File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            java.io.File dest = new java.io.File(dir, filename);
            imageFile.transferTo(dest);
            return "/uploads/images/instruments/" + filename;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save image file", e);
        }
    }
}