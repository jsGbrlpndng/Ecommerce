document.addEventListener("DOMContentLoaded", async () => {
    // Require login and pre-fill customer info
    let customer = null;
    try {
        const res = await fetch('/api/users/me', { credentials: 'include' });
        if (!res.ok) throw new Error('Not logged in');
        customer = await res.json();
        
        // Store minimal user data for order processing
        localStorage.setItem('user', JSON.stringify({
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email
        }));
        
        // Pre-fill form fields with customer info
        document.getElementById("email").value = customer.email || "";
        document.getElementById("first-name").value = customer.firstName || "";
        document.getElementById("last-name").value = customer.lastName || "";
        document.getElementById("phone").value = customer.phone || "";
    } catch {
        // Not logged in - redirect to login
        alert("You must be logged in to checkout.");
        window.location.href = "login.html";
        return;
    }

    loadCart();
    // Initialize checkout form and summary
    loadOrderSummary();
    initCheckoutForm();
    setupEventListeners();
});

function loadCart() {
    let cartItems = [];
    try {
        cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cartItems = [];
    }
    const cartTableBody = document.getElementById('cart-items');
    if (!cartTableBody) return;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        showEmptyCart();
        return;
    }
    let html = '';
    cartItems.forEach(item => {
        // Fallbacks for missing data
        const name = item.name || 'Unknown Product';
        const category = item.category || 'Unknown Category';
        const price = isNaN(Number(item.price)) ? 0 : Number(item.price);
        const quantity = isNaN(Number(item.quantity)) ? 1 : Number(item.quantity);
        const image = item.image && typeof item.image === 'string' && item.image.trim() !== ''
            ? item.image
            : '/Images/instruments/placeholder.png';
        html += `
            <tr data-id="${item.id || ''}">
                <td>
                    <div class="product-info-cell">
                        <img src="${image}" alt="${name}" class="product-image-small" onerror="this.onerror=null;this.src='/Images/instruments/placeholder.png';">
                        <div class="product-details">
                            <div class="product-name">${name}</div>
                            <div class="product-category">${category}</div>
                        </div>
                    </div>
                </td>
                <td class="price-cell">${formatCurrency(price)}</td>
                <td class="quantity-cell">
                    <input type="number" class="quantity-input" value="${quantity}" min="1" max="99">
                </td>
                <td class="price-cell">${formatCurrency(price * quantity)}</td>
                <td>
                    <button class="remove-item" aria-label="Remove item">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    cartTableBody.innerHTML = html;
    updateTotals();
}

function updateTotals() {
    let cartItems = [];
    try {
        cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cartItems = [];
    }
    let subtotal = 0;
    cartItems.forEach(item => {
        const price = isNaN(Number(item.price)) ? 0 : Number(item.price);
        const quantity = isNaN(Number(item.quantity)) ? 1 : Number(item.quantity);
        subtotal += price * quantity;
    });
    const shipping = cartItems.length > 0 ? 10 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shipping').textContent = formatCurrency(shipping);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('total').textContent = formatCurrency(total);
}

function initCheckoutForm() {
    document.getElementById("shipping-section").classList.remove("hidden");
    document.getElementById("payment-section").classList.add("hidden");
    document.getElementById("review-section").classList.add("hidden");
    updateProgressSteps("shipping");
}

function setupEventListeners() {
    document.querySelectorAll(".next-step").forEach((button) => {
        button.addEventListener("click", function() {
            const nextSection = this.getAttribute("data-next");
            const currentSection = this.closest(".checkout-section").id;
            if (validateSection(currentSection)) {
                document.getElementById(currentSection).classList.add("hidden");
                document.getElementById(nextSection).classList.remove("hidden");
                updateProgressSteps(nextSection.split("-")[0]);
                if (nextSection === "review-section") {
                    populateReviewData();
                }
                document.querySelector(".checkout-form-container").scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    document.querySelectorAll(".back-step").forEach((button) => {
        button.addEventListener("click", function() {
            const prevSection = this.getAttribute("data-back");
            const currentSection = this.closest(".checkout-section").id;
            document.getElementById(currentSection).classList.add("hidden");
            document.getElementById(prevSection).classList.remove("hidden");
            updateProgressSteps(prevSection.split("-")[0]);
            document.querySelector(".checkout-form-container").scrollIntoView({ behavior: "smooth" });
        });
    });

    document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", function() {
            const sectionToEdit = this.getAttribute("data-section");
            const currentSection = "review-section";
            document.getElementById(currentSection).classList.add("hidden");
            document.getElementById(sectionToEdit).classList.remove("hidden");
            updateProgressSteps(sectionToEdit.split("-")[0]);
            document.querySelector(".checkout-form-container").scrollIntoView({ behavior: "smooth" });
        });
    });

    document.querySelectorAll('input[name="payment"]').forEach((radio) => {
        radio.addEventListener("change", function() {
            document.querySelectorAll(".payment-form").forEach((form) => {
                form.classList.add("hidden");
            });
            document.getElementById(`${this.value}-form`).classList.remove("hidden");
        });
    });

    const couponToggle = document.querySelector(".coupon-toggle");
    const couponForm = document.querySelector(".coupon-form");
    if (couponToggle && couponForm) {
        couponToggle.addEventListener("click", function() {
            this.classList.toggle("active");
            couponForm.classList.toggle("hidden");
        });
    }

    document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
        radio.addEventListener("change", function() {
            const shippingCost = Number.parseFloat(this.value);
            document.getElementById("checkout-shipping").textContent = formatCurrency(shippingCost);
            updateTotal();
        });
    });

    document.getElementById("checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateSection("review-section")) {
            processOrder();
        }
    });

    // Quantity change handler
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const row = e.target.closest('tr');
            const id = row.dataset.id;
            const quantity = parseInt(e.target.value);
            
            if (quantity < 1) {
                e.target.value = 1;
                return;
            }
            
            updateCartItem(id, quantity);
        }
    });

    // Remove item handler
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-item')) {
            const row = e.target.closest('tr');
            const id = row.dataset.id;
            removeCartItem(id);
        }
    });

    // Proceed to checkout handler
    const checkoutBtn = document.querySelector('.proceed-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            // Proceed to payment/shipping info
            window.location.href = 'payment.html';
        });
    }
}

function updateCartItem(id, quantity) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }
    const itemIndex = cart.findIndex(item => String(item.id) === String(id));
    if (itemIndex > -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function removeCartItem(id) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }
    const newCart = cart.filter(item => String(item.id) !== String(id));
    localStorage.setItem('cart', JSON.stringify(newCart));
    if (newCart.length === 0) {
        showEmptyCart();
    } else {
        loadCart();
    }
}

function showEmptyCart() {
    const container = document.querySelector('.cart-container');
    if (!container) return;
    container.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
        </div>
    `;
}

function loadOrderSummary() {
    const orderSummary = JSON.parse(localStorage.getItem("orderSummary"));
    if (!orderSummary) {
        window.location.href = "cart.html";
        return;
    }
    document.getElementById("checkout-subtotal").textContent = formatCurrency(orderSummary.subtotal);
    document.getElementById("checkout-shipping").textContent = formatCurrency(orderSummary.shipping);
    document.getElementById("checkout-tax").textContent = formatCurrency(orderSummary.tax);
    document.getElementById("checkout-total").textContent = formatCurrency(orderSummary.total);

    const summaryItemsContainer = document.getElementById("summary-items");
    summaryItemsContainer.innerHTML = "";
    orderSummary.items.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "summary-item";
        const imageSrc = item.image || "/placeholder.svg?height=50&width=50";
        itemElement.innerHTML = `
            <div class="summary-item-image">
                <img src="${imageSrc}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=50&width=50&text=${encodeURIComponent(item.name)}'">
            </div>
            <div class="summary-item-details">
                <div class="summary-item-name">${item.name}</div>
                <div class="summary-item-meta">Qty: ${item.quantity}</div>
            </div>
            <div class="summary-item-price">${formatCurrency(item.price * item.quantity)}</div>
        `;
        summaryItemsContainer.appendChild(itemElement);
    });
}

function validateSection(sectionId) {
    let isValid = true;
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document.querySelectorAll(".form-control.error").forEach((el) => el.classList.remove("error"));

    if (sectionId === "shipping-section") {
        const requiredFields = ["first-name", "last-name", "email", "phone", "address", "city", "state", "zip", "country"];
        requiredFields.forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                showFieldError(field, "This field is required");
                isValid = false;
            }
        });
        const emailField = document.getElementById("email");
        if (emailField.value.trim() && !isValidEmail(emailField.value)) {
            showFieldError(emailField, "Please enter a valid email address");
            isValid = false;
        }
        const phoneField = document.getElementById("phone");
        if (phoneField.value.trim() && !isValidPhone(phoneField.value)) {
            showFieldError(phoneField, "Please enter a valid phone number");
            isValid = false;
        }
        const zipField = document.getElementById("zip");
        if (zipField.value.trim() && !isValidZip(zipField.value)) {
            showFieldError(zipField, "Please enter a valid ZIP code");
            isValid = false;
        }
    } else if (sectionId === "payment-section") {
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        if (paymentMethod === "credit-card") {
            const cardFields = ["card-number", "card-name", "exp-date", "cvv"];
            cardFields.forEach((fieldId) => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    showFieldError(field, "This field is required");
                    isValid = false;
                }
            });
            const cardNumberField = document.getElementById("card-number");
            if (cardNumberField.value.trim() && !isValidCardNumber(cardNumberField.value)) {
                showFieldError(cardNumberField, "Please enter a valid card number");
                isValid = false;
            }
            const expDateField = document.getElementById("exp-date");
            if (expDateField.value.trim() && !isValidExpDate(expDateField.value)) {
                showFieldError(expDateField, "Please enter a valid expiration date");
                isValid = false;
            }
            const cvvField = document.getElementById("cvv");
            if (cvvField.value.trim() && !isValidCVV(cvvField.value)) {
                showFieldError(cvvField, "Please enter a valid CVV");
                isValid = false;
            }
        }
    } else if (sectionId === "review-section") {
        const termsCheckbox = document.getElementById("terms");
        if (!termsCheckbox.checked) {
            showFieldError(termsCheckbox, "You must agree to the terms");
            isValid = false;
        }
    }
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add("error");
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent = message;
    field.parentNode.appendChild(errorMessage);
}

function updateProgressSteps(currentStep) {
    const steps = ["shipping", "payment", "review"];
    const currentIndex = steps.indexOf(currentStep);
    steps.forEach((step, index) => {
        const stepElement = document.querySelector(`.progress-step:nth-child(${index * 2 + 1})`);
        if (index < currentIndex) {
            stepElement.classList.remove("active");
            stepElement.classList.add("completed");
        } else if (index === currentIndex) {
            stepElement.classList.add("active");
            stepElement.classList.remove("completed");
        } else {
            stepElement.classList.remove("active");
            stepElement.classList.remove("completed");
        }
    });
    document.querySelectorAll(".progress-line").forEach((line, index) => {
        if (index < currentIndex) {
            line.classList.add("active");
        } else {
            line.classList.remove("active");
        }
    });
}

function populateReviewData() {
    const shippingReview = document.getElementById("shipping-review");
    shippingReview.innerHTML = `
        <p><strong>${document.getElementById("first-name").value} ${document.getElementById("last-name").value}</strong></p>
        <p>${document.getElementById("email").value}</p>
        <p>${document.getElementById("phone").value}</p>
        <p>${document.getElementById("address").value}</p>
        <p>${document.getElementById("city").value}, ${document.getElementById("state").value} ${document.getElementById("zip").value}</p>
        <p>${document.getElementById("country").options[document.getElementById("country").selectedIndex].text}</p>
        <p><strong>Shipping Method:</strong> ${document.querySelector('input[name="shipping"]:checked').parentNode.querySelector(".option-title").textContent}</p>
    `;
    const paymentReview = document.getElementById("payment-review");
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    if (paymentMethod === "credit-card") {
        const cardNumber = document.getElementById("card-number").value;
        const lastFour = cardNumber.slice(-4);
        paymentReview.innerHTML = `
            <p><strong>Payment Method:</strong> Credit Card</p>
            <p><strong>Card Number:</strong> **** **** **** ${lastFour}</p>
            <p><strong>Name on Card:</strong> ${document.getElementById("card-name").value}</p>
            <p><strong>Expiration Date:</strong> ${document.getElementById("exp-date").value}</p>
        `;
    } else if (paymentMethod === "paypal") {
        paymentReview.innerHTML = `
            <p><strong>Payment Method:</strong> PayPal</p>
            <p>You will be redirected to PayPal to complete your payment after placing your order.</p>
        `;
    } else if (paymentMethod === "bank-transfer") {
        paymentReview.innerHTML = `
            <p><strong>Payment Method:</strong> Bank Transfer</p>
            <p>Please use the bank details provided to complete your payment after placing your order.</p>
        `;
    }
    const orderItemsReview = document.getElementById("order-items-review");
    const orderSummary = JSON.parse(localStorage.getItem("orderSummary"));
    orderItemsReview.innerHTML = "";
    orderSummary.items.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "review-item";
        const imageSrc = item.image || "/placeholder.svg?height=60&width=60";
        itemElement.innerHTML = `
            <div class="review-item-image">
                <img src="${imageSrc}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=60&width=60&text=${encodeURIComponent(item.name)}'">
            </div>
            <div class="review-item-details">
                <div class="review-item-name">${item.name}</div>
                <div class="review-item-meta">Quantity: ${item.quantity}</div>
            </div>
            <div class="review-item-price">${formatCurrency(item.price * item.quantity)}</div>
        `;
        orderItemsReview.appendChild(itemElement);
    });
}

function updateTotal() {
    const orderSummary = JSON.parse(localStorage.getItem("orderSummary"));
    const shippingCost = Number.parseFloat(document.querySelector('input[name="shipping"]:checked').value);
    const subtotal = orderSummary.subtotal;
    const tax = orderSummary.tax;
    const total = subtotal + shippingCost + tax;
    document.getElementById("checkout-shipping").textContent = formatCurrency(shippingCost);
    document.getElementById("checkout-total").textContent = formatCurrency(total);
    orderSummary.shipping = shippingCost;
    orderSummary.total = total;
    localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
}

async function processOrder() {
    const formData = new FormData(document.getElementById("checkout-form"));
    const orderData = Object.fromEntries(formData.entries());
    const orderSummary = JSON.parse(localStorage.getItem("orderSummary"));
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData || !userData.id) {
        alert("You must be logged in to place an order.");
        window.location.href = "login.html";
        return;
    }

    if (!orderSummary) {
        alert("Could not retrieve order summary. Please return to the cart and try again.");
        return;
    }

    const orderId = generateOrderId();

    // Build order object to send to backend
    const completeOrder = {
        ...orderData,
        ...orderSummary,
        customerId: userData.id,
        orderId: orderId,
        orderDate: new Date().toISOString(),
        status: "Processing",
        items: orderSummary.items
    };

    try {
        // Send order to backend API
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(completeOrder)
        });
        
        if (response.ok) {
            // Clear cart and order data after successful order
            localStorage.removeItem("cart");
            localStorage.removeItem("orderSummary");
            // Save order info and redirect to order status page
            handleCheckoutSuccess(completeOrder);
        } else {
            const errorData = await response.text();
            alert("There was an error processing your order: " + errorData);
        }
    } catch (error) {
        console.error("Error processing order:", error);
        alert("There was an error processing your order. Please try again.");
    }
}

// Process order and save complete information
function handleCheckoutSuccess() {
    const now = new Date();
    const orderId = 'ORD-' + now.getTime();
    // Get cart items with complete product information
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]').map(item => ({
        ...item,
        totalPrice: Number(item.price * (item.quantity || 1)).toFixed(2)
    }));
    // Calculate order totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = parseFloat(document.querySelector('input[name="shipping"]:checked').value || 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    // Create new order object with complete product and order information
    const newOrder = {
        orderId: orderId,
        orderDate: now.toISOString(),
        status: 'Processing',
        items: cartItems,  // Save full product information
        shipping: {
            method: document.querySelector('input[name="shipping"]:checked').parentElement.querySelector('.option-title').textContent,
            cost: shipping.toFixed(2)
        },
        payment: {
            method: 'Cash on Delivery'
        },
        products: cartItems,
        totals: {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        },
        customer: {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value
        }
    };
    // Get existing orders and add new one
    const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    existingOrders.unshift(newOrder); // Add new order at the beginning
    localStorage.setItem('userOrders', JSON.stringify(existingOrders));
    // Clear cart
    localStorage.removeItem('cart');
    // Redirect to order status page
    window.location.href = 'order-status.html';
}

// Helper functions
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(amount);
}

function generateOrderId() {
    return "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
}

function isValidZip(zip) {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
}

function isValidCardNumber(cardNumber) {
    const cardRegex = /^\d{16}$/;
    return cardRegex.test(cardNumber.replace(/\D/g, ""));
}

function isValidExpDate(expDate) {
    const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return expRegex.test(expDate);
}

function isValidCVV(cvv) {
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(cvv);
}

function calculateSubtotal(cartItems) {
    return cartItems.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + price * quantity;
    }, 0);
}

function calculateTax(cartItems) {
    const subtotal = calculateSubtotal(cartItems);
    return subtotal * 0.1;
}

function calculateTotal(cartItems) {
    const subtotal = calculateSubtotal(cartItems);
    const shipping = document.querySelector('input[name="shipping"]:checked');
    const shippingCost = shipping ? parseFloat(shipping.value) : 0;
    const tax = calculateTax(cartItems);
    return subtotal + shippingCost + tax;
}