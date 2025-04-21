document.addEventListener("DOMContentLoaded", () => {
  // Load products
  loadProducts()

  // Initialize filters
  initFilters()

  // Initialize search
  initSearch()

  // Update cart count
  updateCartCount()
})

// Product data
const productsData = [
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
  {
    id: 10,
    name: "Yamaha RGX White",
    category: "string",
    price: 729.99,
    image: "/images/instruments/Yamaha-RGX-A2.jpg", // Using similar image since exact one isn't available
    description: "Sleek white electric guitar with precision craftsmanship and exceptional tone quality.",
    features: ["Solid alder body", "Maple neck", "Rosewood fingerboard", "Dual humbuckers", "Locking tuners"],
    inStock: true,
    rating: 4.8,
    reviews: 47,
  },
  {
    id: 11,
    name: "Ibanez Premium",
    category: "string",
    price: 1199.99,
    image: "/images/instruments/ibanez-natural.jpg",
    description: "Premium Ibanez electric guitar with natural wood finish and superior playability.",
    features: [
      "Flame maple top",
      "Wizard neck profile",
      "Ebony fingerboard",
      "DiMarzio pickups",
      "Edge tremolo system",
    ],
    inStock: true,
    rating: 4.9,
    reviews: 63,
  },
  {
    id: 12,
    name: "Ibanez Bass Guitar",
    category: "string",
    price: 849.99,
    image: "/images/instruments/ibanez-natural.jpg", // Using similar image since exact one isn't available
    description: "Professional bass guitar with deep, rich tones and comfortable playability.",
    features: ["4-string design", "Solid ash body", "Maple neck", "Active electronics", "Premium hardware"],
    inStock: true,
    rating: 4.7,
    reviews: 38,
  },
  {
    id: 13,
    name: "Yamaha DTX Electronic Drums",
    category: "percussion",
    price: 1299.99,
    image: "/images/instruments/yamaha-dtx-drums.jpg",
    description: "Professional electronic drum kit with realistic feel and premium sound module.",
    features: [
      "DTX sound module",
      "Natural response pads",
      "3-zone snare",
      "Real hi-hat controller",
      "Includes rack system",
    ],
    inStock: true,
    rating: 4.8,
    reviews: 52,
  },
  {
    id: 14,
    name: "Alesis Nitro Mesh Kit",
    category: "percussion",
    price: 499.99,
    image: "/images/instruments/Roland-Drumset.jpg", // Using similar image since exact one isn't available
    description: "Complete electronic drum kit with mesh heads for quiet practice and performance.",
    features: ["Mesh drum heads", "Nitro drum module", "385 sounds", "40 kits", "USB/MIDI connection"],
    inStock: true,
    rating: 4.5,
    reviews: 87,
  },
  {
    id: 15,
    name: "Antique Violin",
    category: "string",
    price: 2499.99,
    image: "/images/instruments/black-violin.jpg",
    description: "Beautifully crafted antique violin with rich, warm tone and exceptional craftsmanship.",
    features: [
      "Hand-carved spruce top",
      "Maple back and sides",
      "Ebony fingerboard",
      "Fine tuners",
      "Aged wood for superior resonance",
    ],
    inStock: true,
    rating: 4.9,
    reviews: 31,
  },
  {
    id: 16,
    name: "Tower Strings Violin",
    category: "string",
    price: 349.99,
    image: "/images/instruments/black-violin.jpg",
    description: "Modern black violin with complete accessories kit, perfect for students and intermediate players.",
    features: [
      "Ebony fingerboard",
      "Maple body",
      "Includes case",
      "Bow and rosin included",
      "Available in multiple sizes",
    ],
    inStock: true,
    rating: 4.4,
    reviews: 65,
  },
  {
    id: 17,
    name: "Yamaha Baby Grand Piano",
    category: "keyboard",
    price: 7999.99,
    image: "/images/instruments/yamaha-grand-piano.jpg",
    description: "Exquisite baby grand piano with rich tone and responsive action, perfect for serious musicians.",
    features: [
      "Solid spruce soundboard",
      "Premium hammer action",
      "Rich mahogany finish",
      "Includes bench",
      "Professional tuning",
    ],
    inStock: true,
    rating: 5.0,
    reviews: 28,
  },
  {
    id: 18,
    name: "Classic Grand Piano",
    category: "keyboard",
    price: 8999.99,
    image: "/images/instruments/black-grand-piano.jpg",
    description: "Elegant black grand piano with exceptional sound quality and premium craftsmanship.",
    features: [
      "Full 88-key keyboard",
      "Solid spruce soundboard",
      "Ebony finish",
      "Responsive action",
      "Includes matching bench",
    ],
    inStock: true,
    rating: 5.0,
    reviews: 23,
  },
  {
    id: 19,
    name: "Professional Silver Flute",
    category: "wind",
    price: 899.99,
    image: "/images/instruments/silver-flute.jpg",
    description: "Professional silver-plated flute with exceptional tone quality and precise intonation.",
    features: ["Silver-plated body", "Closed hole design", "C foot", "Offset G key", "Includes case and cleaning kit"],
    inStock: true,
    rating: 4.7,
    reviews: 42,
  },
]

const addToWishlist = (product) => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
  const existingItem = wishlist.find((item) => item.id === product.id)

  if (!existingItem) {
    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      features: product.features,
    })
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }
}

function loadProducts() {
  const productsContainer = document.getElementById("products-container")
  if (!productsContainer) return

  // Clear existing products
  productsContainer.innerHTML = ""

  // Get filtered products
  const filteredProducts = getFilteredProducts()

  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = '<div class="no-products">No products found matching your criteria.</div>'
    updateProductCount(0)
    return
  }

  // Update product count
  updateProductCount(filteredProducts.length)

  // Create product cards
  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product)
    productsContainer.appendChild(productCard)
  })
}

function updateProductCount(count) {
  const productCountElement = document.getElementById("product-count")
  if (productCountElement) {
    productCountElement.textContent = `${count} products found`
  }
}

function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"

  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
      ${
        product.inStock
          ? '<span class="stock in-stock">In Stock</span>'
          : '<span class="stock out-of-stock">Out of Stock</span>'
      }
      <div class="product-actions">
        <button class="product-action-btn add-to-cart-btn" data-product-id="${product.id}" title="Add to Cart">
          <i class="fas fa-shopping-cart"></i>
        </button>
        <button class="product-action-btn quick-view-btn" data-product-id="${product.id}" title="Quick View">
          <i class="fas fa-eye"></i>
        </button>
        <button class="product-action-btn wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
          <i class="fas fa-heart"></i>
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
    e.stopPropagation()
    if (product.inStock) {
      addToCart(product)
      showNotification(`${product.name} added to cart!`)
    } else {
      showNotification("Sorry, this product is out of stock", "error")
    }
  })

  const quickViewBtn = card.querySelector(".quick-view-btn")
  quickViewBtn.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    showQuickView(product)
  })

  const wishlistBtn = card.querySelector(".wishlist-btn")
  wishlistBtn.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToWishlist(product)
    showNotification(`${product.name} added to wishlist!`)
  })

  // Make the whole card clickable to view product details
  card.addEventListener("click", () => {
    window.location.href = `product-detail.html?id=${product.id}`
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

function getFilteredProducts() {
  // Start with all products
  let filtered = [...productsData]

  // Apply category filter if active
  const activeCategory = document.querySelector(".category-link.active")
  if (activeCategory) {
    const category = activeCategory.getAttribute("data-category")
    if (category && category !== "all") {
      filtered = filtered.filter((product) => product.category === category)
    }
  }

  // Apply price filter
  const minPriceInput = document.getElementById("min-price")
  const maxPriceInput = document.getElementById("max-price")

  if (minPriceInput && maxPriceInput) {
    const minPrice = Number.parseFloat(minPriceInput.value) || 0
    const maxPrice = Number.parseFloat(maxPriceInput.value) || 10000
    filtered = filtered.filter((product) => product.price >= minPrice && product.price <= maxPrice)
  }

  // Apply brand filter
  const selectedBrands = []
  document.querySelectorAll(".brand-checkbox:checked").forEach((checkbox) => {
    selectedBrands.push(checkbox.value.toLowerCase())
  })

  if (selectedBrands.length > 0) {
    filtered = filtered.filter((product) => {
      const productBrand = product.name.split(" ")[0].toLowerCase()
      return selectedBrands.includes(productBrand)
    })
  }

  // Apply sort
  const sortSelect = document.getElementById("sort-select")
  if (sortSelect) {
    const sortBy = sortSelect.value
    filtered = sortProductsHelper(filtered, sortBy)
  }

  return filtered
}

function filterProductsByCategory(category) {
  // Update UI to show the category is selected
  document.querySelectorAll(".category-link").forEach((link) => {
    if (link.getAttribute("data-category") === category) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })

  // Reload products with the filter applied
  loadProducts()
}

function filterProductsByPrice(min, max) {
  // Update input fields with the values
  document.getElementById("min-price").value = min
  document.getElementById("max-price").value = max

  // Reload products with the filter applied
  loadProducts()
}

function filterProductsByBrand() {
  // Reload products with the filter applied
  loadProducts()
}

function sortProductsHelper(productList, sortBy) {
  const sortedProducts = [...productList]

  switch (sortBy) {
    case "price-low":
      sortedProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      sortedProducts.sort((a, b) => b.price - a.price)
      break
    case "name-asc":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "name-desc":
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
      break
    case "rating":
      sortedProducts.sort((a, b) => b.rating - a.rating)
      break
    default:
      // Default sort (featured)
      break
  }

  return sortedProducts
}

function initFilters() {
  // Category filters
  const categoryLinks = document.querySelectorAll(".category-link")
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const category = this.getAttribute("data-category")

      // Update active class
      categoryLinks.forEach((l) => l.classList.remove("active"))
      this.classList.add("active")

      // Reload products with the filter applied
      loadProducts()
    })
  })

  // Price range filter
  const applyPriceBtn = document.querySelector(".apply-price-btn")
  if (applyPriceBtn) {
    applyPriceBtn.addEventListener("click", () => {
      loadProducts()
    })
  }

  // Brand filters
  const brandCheckboxes = document.querySelectorAll(".brand-checkbox")
  brandCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      loadProducts()
    })
  })

  // Sort functionality
  const sortSelect = document.getElementById("sort-select")
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      loadProducts()
    })
  }
}

function initSearch() {
  const searchForm = document.querySelector(".search-form")
  const searchInput = document.querySelector(".search-input")

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const searchTerm = searchInput.value.trim().toLowerCase()

      if (searchTerm) {
        // Filter products by search term
        const searchResults = productsData.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm),
        )

        // Display search results
        displaySearchResults(searchResults, searchTerm)
      }
    })
  }
}

function displaySearchResults(results, searchTerm) {
  const productsContainer = document.getElementById("products-container")
  if (!productsContainer) return

  // Clear existing products
  productsContainer.innerHTML = ""

  // Update product count and search term
  updateProductCount(results.length)

  if (results.length === 0) {
    productsContainer.innerHTML = '<div class="no-products">No products found matching your search.</div>'
    return
  }

  // Create product cards for search results
  results.forEach((product) => {
    const productCard = createProductCard(product)
    productsContainer.appendChild(productCard)
  })
}

function customShowNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `

  // Add styles
  notification.style.position = "fixed"
  notification.style.bottom = "20px"
  notification.style.right = "20px"
  notification.style.backgroundColor = type === "success" ? "#4caf50" : "#f44336"
  notification.style.color = "white"
  notification.style.padding = "1rem"
  notification.style.borderRadius = "8px"
  notification.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
  notification.style.display = "flex"
  notification.style.alignItems = "center"
  notification.style.justifyContent = "space-between"
  notification.style.zIndex = "1000"
  notification.style.transform = "translateY(100px)"
  notification.style.opacity = "0"
  notification.style.transition = "all 0.3s ease"

  // Add to body
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.style.transform = "translateY(0)"
    notification.style.opacity = "1"
  }, 10)

  // Close button
  const closeButton = notification.querySelector(".notification-close")
  closeButton.addEventListener("click", () => {
    hideNotification(notification)
  })

  // Auto hide after 3 seconds
  setTimeout(() => {
    hideNotification(notification)
  }, 3000)
}

function hideNotification(notification) {
  notification.style.transform = "translateY(100px)"
  notification.style.opacity = "0"

  setTimeout(() => {
    document.body.removeChild(notification)
  }, 300)
}

// Initialize on page load
updateCartCount()

function showQuickView(product) {
  // Create modal element
  const modal = document.createElement("div")
  modal.className = "modal quick-view-modal"
  modal.style.display = "block"

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">${product.name}</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="quick-view-content">
        <div class="quick-view-image">
          <img src="${product.image}" alt="${product.name}">
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
          image: product.image,
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

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      features: product.features,
      quantity: 1,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const count = cart.reduce((total, item) => total + item.quantity, 0)

  const cartCountElement = document.querySelector(".cart-count")
  if (cartCountElement) {
    cartCountElement.textContent = count
    cartCountElement.style.display = count > 0 ? "flex" : "none"
  }
}

function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `

  // Add to body
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Close button
  const closeButton = notification.querySelector(".notification-close")
  closeButton.addEventListener("click", () => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  })

  // Auto hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

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
