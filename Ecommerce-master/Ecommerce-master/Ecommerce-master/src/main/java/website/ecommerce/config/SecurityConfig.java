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

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/api/**") // Disable CSRF for API endpoints
                .disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/api/users/register",
                    "/api/users/login",
                    "/api/admin/login", // Allow admin login endpoint
                    "/css/**",
                    "/js/**",
                    "/Images/**",
                    "/images/**",
                    "/admin/img/**", // Allow admin images
                     "/uploads/**",
                    "/*.html",
                    "/admin/*.html",
                    "/admin/js/**", // Allow admin JS
                    "/favicon.ico"
                ).permitAll()
                // Allow ALL methods for products API
                .requestMatchers("/api/products", "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/me").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/featured").permitAll()
                .requestMatchers(
                    "/api/products/{id}/update",
                    "/api/products/*/update"
                ).permitAll()
                // Customer management endpoints (protected by session check in controller)
                .requestMatchers("/api/admin/customers/**").permitAll()
                .requestMatchers("/api/admin/orders/**").permitAll()
                .requestMatchers("/api/admin/check-session").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}