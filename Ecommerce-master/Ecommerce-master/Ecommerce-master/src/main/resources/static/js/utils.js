// Global utility functions

// Format currency to PHP (₱) with thousands separator and 2 decimals
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Get URL parameters as an object
function getUrlParams() {
  const params = {}
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)

  for (const [key, value] of urlParams.entries()) {
    params[key] = value
  }

  return params
}

// Add item to cart
function addToCart(product, quantity = 1) {
  if (!product || !product.id) return false;

  // Check both status and stock count
  if (product.status === 'out-of-stock' || product.inStock === false || (product.stock !== undefined && product.stock <= 0)) {
    showNotification("Sorry, this product is out of stock", "error");
    return false;
  }

  // If trying to add more than available stock
  if (product.stock !== undefined && quantity > product.stock) {
    showNotification(`Sorry, only ${product.stock} units available`, "error");
    return false;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      status: product.status,
      quantity: quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Show notification
  showNotification(`${product.name} added to cart!`, "success");
  return true;
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
}

// Update cart item quantity
function updateCartItemQuantity(productId, quantity) {
  if (quantity < 1) return

  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const item = cart.find((item) => item.id === productId)

  if (item) {
    item.quantity = quantity
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()
  }
}

// Update cart count in header
function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count");
  if (!cartCountElements.length) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  cartCountElements.forEach(element => {
    element.textContent = itemCount;
    element.style.display = itemCount > 0 ? "flex" : "none";
  });

  // Also update the mini cart if it exists
  const miniCart = document.querySelector(".mini-cart");
  if (miniCart) {
    miniCart.style.display = itemCount > 0 ? "block" : "none";
  }
}

// Show notification
function showNotification(message, type = "success") {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">×</button>
    </div>
  `;

  // Add to document
  document.body.appendChild(notification);

  // Add close button functionality
  const closeButton = notification.querySelector('.notification-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      notification.remove();
    });
  }

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification && notification.parentNode) {
      notification.classList.add('animate-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);

  // Add animation class
  requestAnimationFrame(() => {
    notification.classList.add('animate-in');
  });
}

// Get category name from ID
function getCategoryName(categoryId) {
  const categories = {
    string: "String Instruments",
    wind: "Wind Instruments",
    percussion: "Percussion",
    keyboard: "Keyboard Instruments",
    electronic: "Electronic Instruments",
    accessories: "Accessories",
  }

  return categories[categoryId] || "Unknown Category"
}