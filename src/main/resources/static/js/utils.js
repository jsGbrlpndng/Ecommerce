// Global utility functions and data

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
function addToCart(productId, quantity = 1) {
  // Get product data first
  const product = getProductById(productId)
  if (!product) return

  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity,
      description: product.description,
      features: product.features,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()

  // Show notification
  showNotification("Item added to cart")
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
  const cartCountElement = document.getElementById("cart-count")
  if (!cartCountElement) return

  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  cartCountElement.textContent = itemCount
  cartCountElement.style.display = itemCount > 0 ? "flex" : "none"
}

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
    id: 3,\
    name  "22 frets"],
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
]

// Get product by ID
function getProductById(productId) {
  return products.find((product) => product.id === Number.parseInt(productId))
}

// Get products by category
function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === "all") {
    return products
  }
  return products.filter((product) => product.category === categoryId)
}

// Search products
function searchProducts(query) {
  query = query.toLowerCase()
  return products.filter(
    (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
  )
}

// Sort products
function sortProducts(productList, sortBy) {
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

// Filter products by price range
function filterProductsByPrice(productList, minPrice, maxPrice) {
  return productList.filter((product) => product.price >= minPrice && (maxPrice === null || product.price <= maxPrice))
}

// Filter products by availability
function filterProductsByAvailability(productList, inStockOnly) {
  if (!inStockOnly) return productList
  return productList.filter((product) => product.inStock)
}

export {
  getProductById,
  getCategoryName,
  formatCurrency,
  updateCartItemQuantity,
  removeFromCart,
  updateCartCount,
  getUrlParams,
  products,
  getProductsByCategory,
  searchProducts,
  sortProducts,
  filterProductsByPrice,
  filterProductsByAvailability,
  addToCart,
  showNotification,
}
