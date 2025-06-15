document.addEventListener("DOMContentLoaded", () => {
  // Load featured products
  loadFeaturedProducts();

  // Initialize animations
  initAnimations();

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

// ...existing code for addToCart, showNotification, updateCartCount, loadFeaturedProducts, etc...

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

// Update the loadFeaturedProducts function to use the correct image paths
function loadFeaturedProducts() {
  const featuredProductsContainer = document.getElementById("featured-products")
  if (!featuredProductsContainer) return

  // Get featured products (first 4 products from our product data)
  const featuredProducts = products.slice(0, 4)

  // Create product cards
  featuredProducts.forEach((product) => {
    const productCard = createProductCard(product)
    featuredProductsContainer.appendChild(productCard)
  })
}

function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"

  // Get correct image path based on product name
  const imagePath = getProductImagePath(product.name)

  card.innerHTML = `
    <div class="product-image">
      <img src="${imagePath}" alt="${product.name}">
      ${product.inStock ? '<span class="stock in-stock">In Stock</span>' : '<span class="stock out-of-stock">Out of Stock</span>'}
      <div class="product-actions">
        <button class="product-action-btn add-to-cart-btn" data-product-id="${product.id}" title="Add to Cart">
          <i class="fas fa-shopping-cart"></i>
        </button>
        <button class="product-action-btn quick-view-btn" data-product-id="${product.id}" title="Quick View">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${getCategoryName(product.category)}</div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-rating">
        ${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}
        <span class="rating-count">(${product.reviews})</span>
      </div>
      <div class="product-price">${formatCurrency(product.price)}</div>
    </div>
  `

  // Add event listeners
  const addToCartBtn = card.querySelector(".add-to-cart-btn")
  addToCartBtn.addEventListener("click", (e) => {
    e.preventDefault()
    if (product.inStock) {
      addToCart(product)
    } else {
      showNotification("Sorry, this product is out of stock", "error")
    }
  })

  const quickViewBtn = card.querySelector(".quick-view-btn")
  quickViewBtn.addEventListener("click", (e) => {
    e.preventDefault()
    showQuickView(product)
  })

  return card
}

function getProductImagePath(productName) {
  // Map product names to image paths based on your actual files
  const productNameToImage = {
    "Gibson Explorer": "/images/instruments/2007-Gibson-Explorer.jpg",
    "Fender Acoustic Guitar": "/images/instruments/Fender-Acoustic-Guitar.jpg",
    "Fender Electric Guitar": "/images/instruments/Fender Electric Guitar.jpg",
    "Gibson Acoustic Guitar": "/images/instruments/Gibson-Acoustic-Guitar.jpg",
    "Roland Drum Set": "/images/instruments/Roland-Drumset.jpg",
    "Roland Piano": "/images/instruments/Roland-Piano.jpg",
    "Steinway Piano": "/images/instruments/Steinway-Piano.jpg",
    "Yamaha Acoustic Guitar": "/images/instruments/Yamaha-Acoustic-Guitar.jpg",
    "Yamaha RGX A2": "/images/instruments/Yamaha-RGX-A2.jpg",
    "Yamaha RGX White": "/images/instruments/Yamaha-RGX-A2.jpg",
    "Ibanez Premium": "/images/instruments/ibanez-natural.jpg",
    "Ibanez Bass Guitar": "/images/instruments/ibanez-natural.jpg",
    "Yamaha DTX Electronic Drums": "/images/instruments/yamaha-dtx-drums.jpg",
    "Alesis Nitro Mesh Kit": "/images/instruments/Roland-Drumset.jpg",
    "Antique Violin": "/images/instruments/black-violin.jpg",
    "Tower Strings Violin": "/images/instruments/black-violin.jpg",
    "Yamaha Baby Grand Piano": "/images/instruments/yamaha-grand-piano.jpg",
    "Classic Grand Piano": "/images/instruments/black-grand-piano.jpg",
    "Professional Silver Flute": "/images/instruments/silver-flute.jpg",
  }

  // Find a matching image based on product name
  for (const [key, value] of Object.entries(productNameToImage)) {
    if (productName.includes(key)) {
      return value
    }
  }

  // Default image if no match found
  return "/placeholder.svg?height=300&width=300"
}

function showQuickView(product) {
  // Create modal element
  const modal = document.createElement("div")
  modal.className = "modal quick-view-modal"
  modal.style.display = "block"

  // Get correct image path
  const imagePath = getProductImagePath(product.name)

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">${product.name}</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="quick-view-content">
          <div class="quick-view-image">
            <img src="${imagePath}" alt="${product.name}">
          </div>
          <div class="quick-view-details">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <div class="product-rating">
              ${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}
              <span class="rating-count">(${product.reviews} reviews)</span>
            </div>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-features">
              <h4>Features:</h4>
              <ul>
                ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
              </ul>
            </div>
            <div class="product-actions">
              <div class="quantity-selector">
                <button class="quantity-btn decrease">-</button>
                <input type="number" class="quantity-input" value="1" min="1">
                <button class="quantity-btn increase">+</button>
              </div>
              <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  // Add to body
  document.body.appendChild(modal)
  document.body.style.overflow = "hidden"

  // Add event listeners
  const closeBtn = modal.querySelector(".modal-close")
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(modal)
    document.body.style.overflow = ""
  })

  // Quantity buttons
  const decreaseBtn = modal.querySelector(".quantity-btn.decrease")
  const increaseBtn = modal.querySelector(".quantity-btn.increase")
  const quantityInput = modal.querySelector(".quantity-input")

  decreaseBtn.addEventListener("click", () => {
    const quantity = Number.parseInt(quantityInput.value)
    if (quantity > 1) {
      quantityInput.value = quantity - 1
    }
  })

  increaseBtn.addEventListener("click", () => {
    const quantity = Number.parseInt(quantityInput.value)
    quantityInput.value = quantity + 1
  })

  // Add to cart button
  const addToCartBtn = modal.querySelector(".add-to-cart-btn")
  addToCartBtn.addEventListener("click", () => {
    if (product.inStock) {
      const quantity = Number.parseInt(quantityInput.value)

      // Add to cart with specified quantity
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      const existingItem = cart.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: imagePath,
          category: product.category,
          description: product.description,
          features: product.features,
          quantity: quantity,
        })
      }

      localStorage.setItem("cart", JSON.stringify(cart))
      updateCartCount()
      showNotification(`${product.name} added to cart!`)

      // Close modal
      document.body.removeChild(modal)
      document.body.style.overflow = ""
    } else {
      showNotification("Sorry, this product is out of stock", "error")
    }
  })

  // Close when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal)
      document.body.style.overflow = ""
    }
  })
}

function initAnimations() {
  // Fade in elements
  const fadeElements = document.querySelectorAll(".fade-in")
  fadeElements.forEach((element, index) => {
    element.style.opacity = "0"
    element.style.transition = "opacity 0.5s ease"
    element.style.transitionDelay = `${index * 0.2}s`

    setTimeout(() => {
      element.style.opacity = "1"
    }, 100)
  })

  // Slide up elements
  const slideElements = document.querySelectorAll(".slide-up")
  slideElements.forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(20px)"
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease"
  })

  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
  }

  // Animate elements when they come into view
  function checkScroll() {
    slideElements.forEach((element) => {
      if (isInViewport(element)) {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }
    })
  }

  // Check on scroll and initial load
  window.addEventListener("scroll", checkScroll)
  checkScroll()
}

// Product data (in a real application, this would come from an API)
const products = [
  {
    id: 1,
    name: "Yamaha Acoustic Guitar",
    category: "string",
    price: 299.99,
    image: "/images/instruments/Yamaha-Acoustic-Guitar.jpg",
    description: "A beautiful acoustic guitar with rich, warm tones. Perfect for beginners and intermediate players.",
    features: ["Solid spruce top", "Mahogany back and sides", "Rosewood fingerboard", "Die-cast tuners", "20 frets"],
    inStock: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Fender Electric Guitar",
    category: "string",
    price: 799.99,
    image: "/images/instruments/Fender Electric Guitar.jpg",
    description: "High-quality electric guitar with versatile sound options. Ideal for professional musicians.",
    features: ["Alder body", "Maple neck", "Rosewood fingerboard", "Premium pickups", "22 frets"],
    inStock: true,
    rating: 4.8,
    reviews: 95,
  },
  {
    id: 3,
    name: "Steinway Piano",
    category: "keyboard",
    price: 4999.99,
    image: "/images/instruments/Steinway-Piano.jpg",
    description: "Stunning concert grand piano with exceptional sound quality and touch response.",
    features: [
      "Full 88-key keyboard",
      "Spruce soundboard",
      "Premium hammer action",
      "Ebony and ivory keys",
      "Includes bench",
    ],
    inStock: false,
    rating: 5.0,
    reviews: 42,
  },
  {
    id: 4,
    name: "Roland Drum Set",
    category: "percussion",
    price: 899.99,
    image: "/images/instruments/Roland-Drumset.jpg",
    description: "Complete professional drum set with premium cymbals and hardware.",
    features: [
      "5-piece shell pack",
      "Maple shells",
      "Premium cymbals included",
      "Double-braced hardware",
      "Adjustable throne",
    ],
    inStock: true,
    rating: 4.7,
    reviews: 63,
  },
  {
    id: 5,
    name: "Yamaha RGX A2",
    category: "string",
    price: 649.99,
    image: "/images/instruments/Yamaha-RGX-A2.jpg",
    description: "Professional electric guitar with rich tone and excellent playability.",
    features: [
      "Solid body construction",
      "Maple neck",
      "Rosewood fingerboard",
      "High-output pickups",
      "Locking tuners",
    ],
    inStock: true,
    rating: 4.6,
    reviews: 37,
  },
  {
    id: 6,
    name: "Roland Piano",
    category: "electronic",
    price: 1299.99,
    image: "/images/instruments/Roland-Piano.jpg",
    description: "Advanced digital keyboard with hundreds of sounds, rhythms, and recording capabilities.",
    features: [
      "88 weighted keys",
      "1000+ instrument sounds",
      "Built-in sequencer",
      "USB and MIDI connectivity",
      "LCD display",
    ],
    inStock: true,
    rating: 4.9,
    reviews: 84,
  },
  {
    id: 7,
    name: "Gibson Acoustic Guitar",
    category: "string",
    price: 1249.99,
    image: "/images/instruments/Gibson-Acoustic-Guitar.jpg",
    description: "Beautifully crafted acoustic guitar with warm, rich tone. Perfect for professional players.",
    features: [
      "Sitka spruce top",
      "Mahogany back and sides",
      "Ebony fingerboard",
      "Bone nut and saddle",
      "Includes hardshell case",
    ],
    inStock: true,
    rating: 4.8,
    reviews: 52,
  },
  {
    id: 8,
    name: "Fender Acoustic Guitar",
    category: "string",
    price: 449.99,
    image: "/images/instruments/Fender-Acoustic-Guitar.jpg",
    description: "Versatile acoustic guitar with bright tone and comfortable playability.",
    features: ["Solid spruce top", "Mahogany back and sides", "Rosewood fingerboard", "Die-cast tuners", "20 frets"],
    inStock: true,
    rating: 4.6,
    reviews: 41,
  },
  {
    id: 9,
    name: "Gibson Explorer",
    category: "string",
    price: 1599.99,
    image: "/images/instruments/2007-Gibson-Explorer.jpg",
    description: "Iconic electric guitar with powerful sound and distinctive shape.",
    features: [
      "Mahogany body",
      "Rosewood fingerboard",
      "Humbucker pickups",
      "Chrome hardware",
      "Includes hardshell case",
    ],
    inStock: true,
    rating: 4.7,
    reviews: 29,
  },
]

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

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

class FeaturedProducts {
    constructor() {
        this.productGrid = document.querySelector('.product-grid');
        this.loadFeaturedProducts();
    }

    async loadFeaturedProducts() {
        try {
            const response = await fetch('/api/products/featured');
            let products = await response.json();
            // Only use products with valid images
            products = products.filter(p => p.image && p.image.length > 0);
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
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.inStock ? '<span class="stock in-stock">In Stock</span>' : '<span class="stock out-of-stock">Out of Stock</span>'}
                    <div class="product-actions">
                        <button class="product-action-btn add-to-cart-btn" data-product-id="${product.id}" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="product-action-btn quick-view-btn" data-product-id="${product.id}" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        ${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">$${product.price ? product.price.toFixed(2) : ''}</div>
                </div>
            </div>
        `).join('');

        // Add event listeners to buttons
        this.productGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = btn.dataset.productId;
                const product = products.find(p => p.id === parseInt(productId));
                if (product && product.inStock) {
                    addToCart(product);
                } else {
                    showNotification("Sorry, this product is out of stock", "error");
                }
            });
        });

        this.productGrid.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = btn.dataset.productId;
                const product = products.find(p => p.id === parseInt(productId));
                if (product) {
                    showQuickView(product);
                }
            });
        });
    }
}

// Initialize featured products when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeaturedProducts();
});