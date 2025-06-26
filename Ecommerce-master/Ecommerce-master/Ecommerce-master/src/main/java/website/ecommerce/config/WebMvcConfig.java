/*
 * WebMvcConfig.java
 * MelodyMatrix E-commerce Platform
 *
 * Configures static resource handling for the application, such as file uploads.
 *
 * Author: MelodyMatrix Team
 * Date: 2025-06-26
 */

package website.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

/**
 * Configures resource handlers for serving static files (e.g., uploaded images).
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    /**
     * Maps /uploads/** URLs to the local uploads/ directory.
     *
     * @param registry ResourceHandlerRegistry
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
