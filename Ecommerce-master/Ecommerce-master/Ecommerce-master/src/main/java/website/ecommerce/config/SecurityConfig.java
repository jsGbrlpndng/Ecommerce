/*
 * SecurityConfig.java
 * MelodyMatrix E-commerce Platform
 *
 * Configures Spring Security for the application, including endpoint access rules,
 * CSRF protection, and password encoding.
 *
 * Author: MelodyMatrix Team
 * Date: 2025-06-26
 */

package website.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpMethod;

/**
 * Configures security settings for the application.
 * Defines which endpoints are public and which require authentication.
 */
@Configuration
public class SecurityConfig {

    /**
     * Configures the security filter chain, including CSRF and endpoint access rules.
     *
     * @param http HttpSecurity instance
     * @return SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/api/**") // Disable CSRF for API endpoints
                .disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/",
                    "/api/users/register",
                    "/api/users/login",
                    "/api/admin/login", // Admin login endpoint
                    "/css/**",
                    "/js/**",
                    "/Images/**",
                    "/images/**",
                    "/admin/img/**", // Admin images
                    "/uploads/**",
                    "/*.html",
                    "/admin/*.html",
                    "/admin/js/**", // Admin JS
                    "/favicon.ico"
                ).permitAll()
                // Allow all methods for products API
                .requestMatchers("/api/products", "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/me").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/featured").permitAll()
                .requestMatchers(
                    "/api/products/{id}/update",
                    "/api/products/*/update"
                ).permitAll()
                // Customer/admin management endpoints (protected by session check in controller)
                .requestMatchers("/api/admin/customers/**").permitAll()
                .requestMatchers("/api/admin/orders/**").permitAll()
                .requestMatchers("/api/admin/check-session").permitAll()
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());
        return http.build();
    }

    /**
     * Provides a BCrypt password encoder bean.
     *
     * @return PasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Provides the authentication manager bean.
     *
     * @param authenticationConfiguration AuthenticationConfiguration
     * @return AuthenticationManager
     * @throws Exception if configuration fails
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}