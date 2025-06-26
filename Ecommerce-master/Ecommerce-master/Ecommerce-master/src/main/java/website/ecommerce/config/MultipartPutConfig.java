/*
 * MultipartPutConfig.java
 * MelodyMatrix E-commerce Platform
 *
 * Enables support for HTTP PUT and PATCH methods with multipart/form-data.
 * Required for file uploads and RESTful resource updates.
 *
 * Author: MelodyMatrix Team
 * Date: 2025-06-26
 */

package website.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.HiddenHttpMethodFilter;

/**
 * Configuration for enabling HTTP method filter to support PUT/PATCH with forms.
 */
@Configuration
public class MultipartPutConfig {
    /**
     * Registers the HiddenHttpMethodFilter bean.
     *
     * @return HiddenHttpMethodFilter instance
     */
    @Bean
    public HiddenHttpMethodFilter hiddenHttpMethodFilter() {
        return new HiddenHttpMethodFilter();
    }
}
