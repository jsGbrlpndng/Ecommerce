document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display logged-in user info in dropdown, handle login/register/logout
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
    showAdminBtn.addEventListener('click', function() {
      window.location.href = 'admin/index.html';
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function() {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('user');
      window.location.reload();
    });
  }

  // Category navigation for homepage
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const text = this.querySelector('h3').textContent.trim();
      let category = '';
      switch (text) {
        case 'Strings': category = 'Strings'; break;
        case 'Percussion': category = 'Percussion'; break;
        case 'Wind Instruments': category = 'Wind'; break;
        case 'Keyboard': category = 'Keyboard'; break;
        case 'Electronics': category = 'Electronics'; break;
        default: category = '';
      }
      if (category) {
        window.location.href = `/shop.html?category=${encodeURIComponent(category)}`;
      }
    });
  });
});

// ...existing code for addToCart, showNotification, updateCartCount, etc...

function addToCart(product) {
  console.log("Adding to cart:", product)
  // Implement your cart logic here
}

function showNotification(message, type = "success") {
  console.log("Notification:", message, type)
  // Implement your notification logic here
}

function updateCartCount() {
  console.log("Updating cart count")
  // Implement your cart count update logic here
}

const categories = {
    string: "String Instruments",
    wind: "Wind Instruments",
    percussion: "Percussion",
    keyboard: "Keyboard Instruments",
    electronic: "Electronic Instruments",
    accessories: "Accessories",
}

function getCategoryName(categoryId) {
  return categories[categoryId] || "Unknown Category"
}

class FeaturedProducts {
    constructor() {
        this.productGrid = document.querySelector('.products-grid');
        if (this.productGrid) this.loadFeaturedProducts();
    }

    async loadFeaturedProducts() {
        try {
            const response = await fetch('/api/products');
            let products = await response.json();
            if (!Array.isArray(products)) throw new Error('Invalid response');
            // Only use products with valid images
            products = products.filter(p => p.image && p.image.length > 0);
            // Show only the first 3
            products = products.slice(0, 3);
            this.renderProducts(products);
        } catch (error) {
            console.error('Error loading featured products:', error);
            this.renderProducts([]);
        }
    }

    renderProducts(products) {
        if (!this.productGrid) return;
        if (!products.length) {
            this.productGrid.innerHTML = '<div style="padding:18px;text-align:center;color:#888;font-size:1rem;">No featured products available.</div>';
            return;
        }
        this.productGrid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}" style="cursor:pointer;">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='Images/placeholder.png'">
                    ${product.stock > 0 ? '<span class="stock in-stock">In Stock</span>' : '<span class="stock out-of-stock">Out of Stock</span>'}
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">₱${product.price ? Number(product.price).toLocaleString('en-PH', {minimumFractionDigits:2}) : ''}</div>
                </div>
            </div>
        `).join('');
        // Add click event to each card to go to product detail
        this.productGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                if (id) window.location.href = `product-detail.html?id=${id}`;
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.products-grid')) new FeaturedProducts();
});