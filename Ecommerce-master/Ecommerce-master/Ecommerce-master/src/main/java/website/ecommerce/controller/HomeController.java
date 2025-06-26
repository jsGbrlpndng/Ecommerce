/*
 * HomeController.java
 * MelodyMatrix E-commerce Platform
 *
 * Handles the root URL and redirects to the main index page.
 *
 * Author: MelodyMatrix Team
 * Date: 2025-06-26
 */

package website.ecommerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller for handling the root URL and redirecting to index.html.
 */
@Controller
public class HomeController {

    /**
     * Redirects the root URL ("/") to the main index.html page.
     *
     * @return Redirect string
     */
    @GetMapping("/")
    public String home() {
        return "redirect:/index.html";
    }
}