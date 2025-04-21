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
function addToCart(productId, quantity = 1) {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: productId,
      quantity: quantity,
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
  updateCartCount()
  initMobileMenu()
  initHeaderScroll()

  // Initialize search
  const searchForm = document.querySelector(".search-form")
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const searchInput = this.querySelector(".search-input")
      const searchTerm = searchInput.value.trim()

      if (searchTerm) {
        // Redirect to shop page with search query
        window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`
      }
    })
  }

  // Initialize profile dropdown
  const profileButton = document.querySelector(".profile-button")
  const dropdownContent = document.querySelector(".dropdown-content")

  if (profileButton && dropdownContent) {
    profileButton.addEventListener("click", (e) => {
      e.stopPropagation()
      dropdownContent.classList.toggle("active")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!profileButton.contains(e.target) && !dropdownContent.contains(e.target)) {
        dropdownContent.classList.remove("active")
      }
    })
  }

  // Initialize login form
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("dropdown-email").value
      const password = document.getElementById("dropdown-password").value

      // Here you would typically send a request to your authentication endpoint
      console.log("Login attempt:", email)

      // For demo purposes, show success message
      showNotification("Login successful!", "success")

      // Close dropdown
      dropdownContent.classList.remove("active")
    })
  }

  // Initialize FAQ accordions
  const faqItems = document.querySelectorAll(".faq-item")
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
      question.addEventListener("click", () => {
        // Toggle current item
        item.classList.toggle("active")

        // Close other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active")
          }
        })
      })
    })

    // Open first FAQ item by default
    faqItems[0].classList.add("active")
  }
})
