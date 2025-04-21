document.addEventListener("DOMContentLoaded", () => {
  // Initialize cart
  initCart()

  // Set up event listeners for cart actions
  setupCartActions()
})

function initCart() {
  // Load cart items from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Update cart UI based on cart contents
  if (cart.length === 0) {
    // Show empty cart message
    document.getElementById("empty-cart").style.display = "block"
    document.getElementById("cart-with-items").style.display = "none"
  } else {
    // Show cart with items
    document.getElementById("empty-cart").style.display = "none"
    document.getElementById("cart-with-items").style.display = "flex"

    // Load cart items
    loadCartItems(cart)

    // Calculate and update summary
    updateCartSummary(cart)

    // Set up event listeners
    setupCartEventListeners()
  }
}

function loadCartItems(cart) {
  const cartItemsContainer = document.getElementById("cart-items-container")
  cartItemsContainer.innerHTML = ""

  cart.forEach((item, index) => {
    const cartItemElement = createCartItemElement(item, index)
    cartItemsContainer.appendChild(cartItemElement)
  })
}

function createCartItemElement(item, index) {
  const cartItem = document.createElement("div")
  cartItem.className = "cart-item"
  cartItem.style.animationDelay = `${index * 0.1}s`

  // Use placeholder image if image is missing
  const imageSrc = item.image || "/placeholder.svg?height=80&width=80"

  cartItem.innerHTML = `
    <div class="cart-product">
      <div class="cart-product-image">
        <img src="${imageSrc}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=80&width=80&text=${encodeURIComponent(item.name)}'">
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
  `

  return cartItem
}

function updateCartSummary(cart) {
  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate shipping (free for orders over $100)
  const shipping = subtotal > 100 ? 0 : 10

  // Calculate tax (8%)
  const tax = subtotal * 0.08

  // Calculate total
  const total = subtotal + shipping + tax

  // Update summary in UI
  document.getElementById("summary-subtotal").textContent = formatCurrency(subtotal)
  document.getElementById("summary-shipping").textContent = formatCurrency(shipping)
  document.getElementById("summary-tax").textContent = formatCurrency(tax)
  document.getElementById("summary-total").textContent = formatCurrency(total)

  // Store order summary for checkout
  const orderSummary = {
    subtotal,
    shipping,
    tax,
    total,
    items: cart,
  }
  localStorage.setItem("orderSummary", JSON.stringify(orderSummary))
}

function setupCartEventListeners() {
  // Quantity decrease buttons
  document.querySelectorAll(".quantity-btn.decrease").forEach((button) => {
    button.addEventListener("click", function () {
      const id = Number.parseInt(this.getAttribute("data-id"))
      updateItemQuantity(id, "decrease")
    })
  })

  // Quantity increase buttons
  document.querySelectorAll(".quantity-btn.increase").forEach((button) => {
    button.addEventListener("click", function () {
      const id = Number.parseInt(this.getAttribute("data-id"))
      updateItemQuantity(id, "increase")
    })
  })

  // Quantity input changes
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      const id = Number.parseInt(this.getAttribute("data-id"))
      const quantity = Number.parseInt(this.value)
      if (quantity > 0) {
        updateItemQuantity(id, "set", quantity)
      } else {
        this.value = 1
        updateItemQuantity(id, "set", 1)
      }
    })
  })

  // Remove item buttons
  document.querySelectorAll(".cart-remove").forEach((button) => {
    button.addEventListener("click", function () {
      const id = Number.parseInt(this.getAttribute("data-id"))
      removeCartItem(id)
    })
  })

  // Checkout button
  const checkoutBtn = document.getElementById("checkout-btn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // In a real application, this would redirect to a checkout page
      window.location.href = "checkout.html"
    })
  }
}

function setupCartActions() {
  // Clear cart button
  const clearCartBtn = document.getElementById("clear-cart-btn")
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        localStorage.removeItem("cart")
        initCart()
        updateCartCount()
        showNotification("Your cart has been cleared")
      }
    })
  }

  // Update cart button
  const updateCartBtn = document.getElementById("update-cart-btn")
  if (updateCartBtn) {
    updateCartBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      updateCartSummary(cart)
      showNotification("Your cart has been updated")
    })
  }

  // Coupon button
  const couponBtn = document.querySelector(".coupon-btn")
  if (couponBtn) {
    couponBtn.addEventListener("click", () => {
      const couponInput = document.querySelector(".coupon-input")
      const couponCode = couponInput.value.trim()

      if (couponCode) {
        // In a real application, you would validate the coupon code
        showNotification("Coupon code applied successfully!")
        couponInput.value = ""
      } else {
        showNotification("Please enter a valid coupon code", "error")
      }
    })
  }
}

function updateItemQuantity(id, action, value = null) {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const itemIndex = cart.findIndex((item) => item.id === id)

  if (itemIndex !== -1) {
    if (action === "decrease" && cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity--
    } else if (action === "increase") {
      cart[itemIndex].quantity++
    } else if (action === "set" && value !== null) {
      cart[itemIndex].quantity = value
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    initCart() // Reload cart UI
    updateCartCount() // Update cart count in header
  }
}

function removeCartItem(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  cart = cart.filter((item) => item.id !== id)
  localStorage.setItem("cart", JSON.stringify(cart))
  initCart() // Reload cart UI
  updateCartCount() // Update cart count in header
  showNotification("Item removed from cart")
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

function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  // Create content
  const content = document.createElement("div")
  content.className = "notification-content"

  // Add icon based on type
  const icon = document.createElement("i")
  icon.className = type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle"
  content.appendChild(icon)

  // Add message
  const text = document.createElement("span")
  text.textContent = message
  content.appendChild(text)

  notification.appendChild(content)

  // Add close button
  const closeBtn = document.createElement("button")
  closeBtn.className = "notification-close"
  closeBtn.innerHTML = "&times;"
  closeBtn.addEventListener("click", () => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification)
      }
    }, 300)
  })
  notification.appendChild(closeBtn)

  // Add to body
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

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
