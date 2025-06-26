/*
 * ProductController.java
 * MelodyMatrix E-commerce Platform
 *
 * Handles all product-related endpoints, including CRUD operations and image uploads.
 *
 * Author: MelodyMatrix Team
 * Date: 2025-06-26
 */

package website.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import website.ecommerce.model.Product;
import website.ecommerce.service.ProductService;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controller for product management endpoints (CRUD, image upload).
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Returns all products.
     *
     * @return List of all products
     */
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

    /**
     * Adds a new product with optional image upload.
     *
     * @param name Product name
     * @param sku Product SKU
     * @param category Product category
     * @param price Product price
     * @param stock Product stock
     * @param imageFile Optional image file
     * @param description Optional description
     * @return Created product
     */
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

    /**
     * Updates an existing product by ID (with optional image upload).
     *
     * @param id Product ID
     * @param name Product name
     * @param sku Product SKU
     * @param category Product category
     * @param price Product price
     * @param stock Product stock
     * @param imageFile Optional image file
     * @param description Optional description
     * @return Updated product
     */
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

    /**
     * Test endpoint for debugging.
     *
     * @return Test OK string
     */
    @PostMapping("/test")
    public String testEndpoint() {
        System.out.println("Test endpoint hit");
        return "Test OK";
    }

    /**
     * Updates a product by ID using POST (for legacy support).
     *
     * @param id Product ID
     * @param name Product name
     * @param sku Product SKU
     * @param category Product category
     * @param price Product price
     * @param stock Product stock
     * @param imageFile Optional image file
     * @return Updated product
     */
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

    /**
     * Returns a product by ID.
     *
     * @param id Product ID
     * @return Product
     */
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    /**
     * Deletes a product by ID.
     *
     * @param id Product ID
     */
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    /**
     * Saves an uploaded image file to the uploads directory.
     *
     * @param imageFile MultipartFile to save
     * @return Path to saved image
     */
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