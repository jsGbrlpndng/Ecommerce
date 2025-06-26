// Global utility functions and event handlers

// Format currency to USD
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
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

  // Get current cart
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
      description: product.description || "",
      quantity: quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
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
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  // Update all cart count badges
  const badgeEls = document.querySelectorAll('.cart-count-badge, #cart-count');
  badgeEls.forEach(el => {
    if (count > 0) {
      el.textContent = count;
      el.style.display = '';
    } else {
      el.textContent = '';
      el.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', updateCartCount);

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Hide and remove notification
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
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

// Initialize mobile menu
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")
      document.body.classList.toggle("menu-open")
    })
  }
}

// Initialize header scroll effect
function initHeaderScroll() {
  const header = document.querySelector("header")
  if (!header) return

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })
}

// Document ready function
document.addEventListener("DOMContentLoaded", () => {
  const profileButton = document.querySelector('.profile-button');
  const dropdownContent = document.querySelector('.dropdown-content');
  const loginForm = document.getElementById('dropdown-login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const showAdminBtn = document.getElementById('show-admin-login');

  // Check authentication status on page load
  fetch('/api/users/me', {
    credentials: 'include'
  })
    .then(res => {
      if (!res.ok) throw new Error('Not logged in');
      return res.json();
    })
    .then(data => {
      // Store minimal user data
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      }));
      
      const usernameElem = document.getElementById('dropdown-username');
      const emailElem = document.getElementById('dropdown-email');
      if (usernameElem) usernameElem.textContent = data.username;
      if (emailElem) emailElem.textContent = data.email;
      document.getElementById('user-info-section').style.display = '';
      document.getElementById('logout-btn').style.display = '';
      document.getElementById('dropdown-login-form').style.display = 'none';
      document.getElementById('register-link-section').style.display = 'none';
      document.getElementById('profileDropdown').style.display = 'flex';
    })
    .catch(() => {
      // Not logged in - show guest view
      localStorage.removeItem('user'); // Clear any stale user data
      const usernameElem = document.getElementById('dropdown-username');
      const emailElem = document.getElementById('dropdown-email');
      if (usernameElem) usernameElem.textContent = "Guest";
      if (emailElem) emailElem.textContent = "";
      document.getElementById('user-info-section').style.display = '';
      document.getElementById('logout-btn').style.display = 'none';
      document.getElementById('dropdown-login-form').style.display = '';
      document.getElementById('register-link-section').style.display = '';
      document.getElementById('profileDropdown').style.display = 'none';
    });

  // Profile dropdown toggle (unique variable names to avoid redeclaration)
  const navProfileButton = document.getElementById('profileBtn');
  const navDropdownContent = document.querySelector('#profileDropdown .dropdown-content');
  if (navProfileButton && navDropdownContent) {
    navProfileButton.addEventListener('click', function(e) {
      e.stopPropagation();
      navDropdownContent.classList.toggle('show');
    });
  }
  // Close dropdown when clicking outside
  window.addEventListener('click', function(e) {
    if (!e.target.matches('.profile-button') && !e.target.closest('.dropdown-content')) {
      const dropdowns = document.getElementsByClassName('dropdown-content');
      for (let dropdown of dropdowns) {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      }
    }
  });

  // Login form handler
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
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
          const data = await response.json();
          // Store minimal user data
          localStorage.setItem('user', JSON.stringify({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email
          }));
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

  // Logout handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function() {
      try {
        const response = await fetch('/api/users/logout', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (response.ok) {
          // Clear all user-related data from localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('customerId');
          localStorage.removeItem('cart');
          localStorage.removeItem('orderSummary');
          
          window.location.reload();
        } else {
          console.error('Logout failed:', await response.text());
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    });
  }

  // Admin login
  if (showAdminBtn) {
    showAdminBtn.addEventListener('click', function() {
      window.location.href = 'admin/index.html';
    });
  }
})
