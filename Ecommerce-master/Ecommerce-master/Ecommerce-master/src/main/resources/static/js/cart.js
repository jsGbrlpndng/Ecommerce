document.addEventListener("DOMContentLoaded", () => {
    // Dropdown user info, login, register, logout logic
    fetch('/api/users/me', {
        credentials: 'include'
    })
        .then(res => {
            if (!res.ok) throw new Error('Not logged in');
            return res.json();
        })
        .then(data => {
            const usernameElem = document.getElementById('dropdown-username');
            const emailElem = document.getElementById('dropdown-email');
            if (usernameElem) usernameElem.textContent = data.username;
            if (emailElem) emailElem.textContent = data.email;
            document.getElementById('user-info-section').style.display = '';
            document.getElementById('logout-btn').style.display = '';
            document.getElementById('dropdown-login-form').style.display = 'none';
            document.getElementById('register-link-section').style.display = 'none';
        })
        .catch(() => {
            const usernameElem = document.getElementById('dropdown-username');
            const emailElem = document.getElementById('dropdown-email');
            if (usernameElem) usernameElem.textContent = "Guest";
            if (emailElem) emailElem.textContent = "";
            document.getElementById('user-info-section').style.display = '';
            document.getElementById('logout-btn').style.display = 'none';
            document.getElementById('dropdown-login-form').style.display = '';
            document.getElementById('register-link-section').style.display = '';
        });

    // Login form handler
    const loginForm = document.getElementById('dropdown-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('dropdown-login-email').value.trim();
            const password = document.getElementById('dropdown-login-password').value;
            const errorDiv = document.getElementById('dropdown-login-error');
            errorDiv.style.display = 'none';
            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });
                if (response.ok) {
                    window.location.reload();
                } else {
                    const error = await response.text();
                    errorDiv.textContent = error || 'Invalid email or password';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                errorDiv.textContent = 'An error occurred during login';
                errorDiv.style.display = 'block';
            }
        });
    }

    // Admin Login button
    const showAdminBtn = document.getElementById('show-admin-login');
    if (showAdminBtn) {
        showAdminBtn.addEventListener('click', function () {
            window.location.href = 'admin/index.html';
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function () {
            await fetch('/api/users/logout', {
                method: 'POST',
                credentials: 'include'
            });
            localStorage.removeItem('user');
            window.location.reload();
        });
    }

    // Initialize cart
    initCart();

    // Set up event listeners for cart actions
    setupCartActions();
});

function initCart() {
    try {
        // Load cart items from localStorage
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem("cart")) || [];
            // Validate cart data
            if (!Array.isArray(cart)) {
                console.error("Invalid cart data found in localStorage");
                cart = [];
                localStorage.setItem("cart", JSON.stringify([]));
            }
        } catch (e) {
            console.error("Error parsing cart data:", e);
            cart = [];
            localStorage.setItem("cart", JSON.stringify([]));
        }

        if (typeof window.updateCartCount === 'function') window.updateCartCount();

        const emptyCartElement = document.getElementById("empty-cart");
        const cartWithItemsElement = document.getElementById("cart-with-items");

        if (!emptyCartElement || !cartWithItemsElement) {
            console.warn("Cart UI elements not found, might be on a different page");
            return;
        }

        // Update cart UI based on cart contents
        if (cart.length === 0) {
            // Show empty cart message
            emptyCartElement.style.display = "block";
            cartWithItemsElement.style.display = "none";
        } else {
            // Show cart with items
            emptyCartElement.style.display = "none";
            cartWithItemsElement.style.display = "flex";

            // Load cart items
            loadCartItems(cart);

            // Calculate and update summary
            updateCartSummary(cart);

            // Set up event listeners
            setupCartEventListeners();
        }

        // Ensure cart count is updated on page load
        updateCartCount();
    } catch (error) {
        console.error("Error initializing cart:", error);
        showNotification("There was an error loading your cart. Please refresh the page.", "error");
    }
}

function loadCartItems(cart) {
    const cartItemsContainer = document.getElementById("cart-items-container");
    cartItemsContainer.innerHTML = "";

    cart.forEach((item, index) => {
        const cartItemElement = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItemElement);
    });
}

function createCartItemElement(item, index) {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.style.animationDelay = `${index * 0.1}s`;

    // Only show product image if item.image exists and is not empty
    let imageHtml = "";
    if (item.image) {
        imageHtml = `<img src="${item.image}" alt="${item.name}">`;
    }

    cartItem.innerHTML = `
    <div class="cart-product">
      <div class="cart-product-image">
        ${imageHtml}
      </div>
      <div class="cart-product-details">
        <h3>${item.name}</h3>
        <div class="product-category">${getCategoryName(item.category)}</div>
        <div class="product-description">${item.description ? item.description.substring(0, 100) + "..." : ""}</div>
      </div>
    </div>
    <div class="cart-price">${formatCurrency(item.price)}</div>
    <div class="cart-quantity">
      <button class="quantity-btn decrease" data-id="${item.id}">-</button>
      <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
      <button class="quantity-btn increase" data-id="${item.id}">+</button>
    </div>
    <div class="cart-total">${formatCurrency(item.price * item.quantity)}</div>
    <button class="cart-remove" data-id="${item.id}">×</button>
  `;

    return cartItem;
}

async function updateCartSummary(cart) {
    // Call backend to get correct totals
    try {
        const shipping = cart.reduce((total, item) => total + item.price * item.quantity, 0) > 100 ? 0 : 10;
        const response = await fetch('/api/orders/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: cart.map(item => ({ price: item.price, quantity: item.quantity })),
                shippingFee: shipping
            })
        });
        if (!response.ok) throw new Error('Failed to get order totals');
        const totals = await response.json();
        document.getElementById("summary-subtotal").textContent = formatCurrency(totals.subtotal);
        document.getElementById("summary-shipping").textContent = formatCurrency(totals.shipping);
        document.getElementById("summary-tax").textContent = formatCurrency(totals.tax) + " (VAT 12%)";
        document.getElementById("summary-total").textContent = formatCurrency(totals.total);
        // Store order summary for checkout
        const orderSummary = {
            subtotal: totals.subtotal,
            shipping: totals.shipping,
            tax: totals.tax,
            total: totals.total,
            items: cart,
        };
        localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
    } catch (e) {
        // fallback to old logic if backend fails
        document.getElementById("summary-subtotal").textContent = formatCurrency(0);
        document.getElementById("summary-shipping").textContent = formatCurrency(0);
        document.getElementById("summary-tax").textContent = formatCurrency(0) + " (VAT 12%)";
        document.getElementById("summary-total").textContent = formatCurrency(0);
        const orderSummary = {
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0,
            items: cart,
        };
        localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
    }
}

function setupCartEventListeners() {
    // Quantity decrease buttons
    document.querySelectorAll(".quantity-btn.decrease").forEach((button) => {
        button.addEventListener("click", function () {
            const id = Number.parseInt(this.getAttribute("data-id"));
            updateItemQuantity(id, "decrease");
        });
    });

    // Quantity increase buttons
    document.querySelectorAll(".quantity-btn.increase").forEach((button) => {
        button.addEventListener("click", function () {
            const id = Number.parseInt(this.getAttribute("data-id"));
            updateItemQuantity(id, "increase");
        });
    });

    // Quantity input changes
    document.querySelectorAll(".quantity-input").forEach((input) => {
        input.addEventListener("change", function () {
            const id = Number.parseInt(this.getAttribute("data-id"));
            const quantity = Number.parseInt(this.value);
            if (quantity > 0) {
                updateItemQuantity(id, "set", quantity);
            } else {
                this.value = 1;
                updateItemQuantity(id, "set", 1);
            }
        });
    });

    // Remove item buttons
    document.querySelectorAll(".cart-remove").forEach((button) => {
        button.addEventListener("click", function () {
            const id = Number.parseInt(this.getAttribute("data-id"));
            removeCartItem(id);
        });
    });

    // Checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            // In a real application, this would redirect to a checkout page
            window.location.href = "checkout.html";
        });
    }
}

function setupCartActions() {
    // Clear cart button
    const clearCartBtn = document.getElementById("clear-cart-btn");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear your cart?")) {
                localStorage.removeItem("cart");
                initCart();
                updateCartCount();
                showNotification("Your cart has been cleared");
            }
        });
    }

    // Update cart button
    const updateCartBtn = document.getElementById("update-cart-btn");
    if (updateCartBtn) {
        updateCartBtn.addEventListener("click", () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            updateCartSummary(cart);
            showNotification("Your cart has been updated");
        });
    }

    // Coupon button
    const couponBtn = document.querySelector(".coupon-btn");
    if (couponBtn) {
        couponBtn.addEventListener("click", () => {
            const couponInput = document.querySelector(".coupon-input");
            const couponCode = couponInput.value.trim();

            if (couponCode) {
                // In a real application, you would validate the coupon code
                showNotification("Coupon code applied successfully!");
                couponInput.value = "";
            } else {
                showNotification("Please enter a valid coupon code", "error");
            }
        });
    }
}

function updateItemQuantity(id, action, value = null) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = cart.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
        if (action === "decrease" && cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else if (action === "increase") {
            cart[itemIndex].quantity++;
        } else if (action === "set" && value !== null) {
            cart[itemIndex].quantity = value;
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        initCart(); // Reload cart UI
        updateCartCount(); // Update cart count in header
    }
}

function removeCartItem(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    initCart(); // Reload cart UI
    updateCartCount(); // Update cart count in header
    showNotification("Item removed from cart");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = count;
        cartCountElement.style.display = count > 0 ? "flex" : "none";
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(amount);
}

function getCategoryName(categoryId) {
    const categories = {
        string: "String Instruments",
        wind: "Wind Instruments",
        percussion: "Percussion",
        keyboard: "Keyboard Instruments",
        electronic: "Electronic Instruments",
        accessories: "Accessories",
    };

    return categories[categoryId] || "Unknown Category";
}

function showNotification(message, type = "success") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    // Create content
    const content = document.createElement("div");
    content.className = "notification-content";

    // Add icon based on type
    const icon = document.createElement("i");
    icon.className = type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle";
    content.appendChild(icon);

    // Add message
    const text = document.createElement("span");
    text.textContent = message;
    content.appendChild(text);

    notification.appendChild(content);

    // Add close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "notification-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", () => {
        notification.classList.remove("show");
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
    notification.appendChild(closeBtn);

    // Add to body
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}