/*
 * CorsConfig.java
 * MelodyMatrix E-commerce Platform
 *
 * Configures CORS (Cross-Origin Resource Sharing) for API endpoints.
 * Allows frontend clients (e.g., React, Vue, Angular) to access backend APIs securely.
 *
 * Author: MelodyMatrix Team
 * Date: 2025-06-26
 */

package website.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for CORS settings.
 * Allows cross-origin requests to /api/** endpoints from the specified origin.
 */
@Configuration
public class CorsConfig {
    /**
     * Configures CORS mappings for API endpoints.
     *
     * @return WebMvcConfigurer with CORS settings
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override 
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:8080")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowCredentials(true)
                        .allowedHeaders("*")
                        .exposedHeaders("Set-Cookie");
            }
        };
    }
}
