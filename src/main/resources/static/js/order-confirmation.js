/**
 * Order Confirmation Page JavaScript
 * Handles displaying order details and confirmation information
 */

document.addEventListener("DOMContentLoaded", () => {
    // Load order details from localStorage
    const orderDetails = JSON.parse(localStorage.getItem("orderDetails"))
  
    if (!orderDetails) {
      // If no order details found, redirect to home page
      window.location.href = "index.html"
      return
    }
  
    // Display order information
    displayOrderConfirmation(orderDetails)
  
    // Set up event listeners
    document.getElementById("continue-shopping").addEventListener("click", () => {
      // Clear the order from localStorage
      localStorage.removeItem("orderDetails")
      // Redirect to shop page
      window.location.href = "shop.html"
    })
  
    // Initialize order tracking (placeholder for future implementation)
    initializeOrderTracking(orderDetails.orderId)
  })
  
  /**
   * Displays the order confirmation details
   * @param {Object} order - The order details object
   */
  function displayOrderConfirmation(order) {
    // Set order ID and date
    document.getElementById("order-id").textContent = order.orderId
    document.getElementById("order-date").textContent = new Date(order.orderDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  
    // Calculate and display estimated delivery date (7 days from order date)
    const deliveryDate = new Date(order.orderDate)
    deliveryDate.setDate(deliveryDate.getDate() + 7)
    document.getElementById("delivery-date").textContent = deliveryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  
    // Display shipping address
    const shippingAddressElement = document.getElementById("shipping-address")
    if (shippingAddressElement && order.shippingAddress) {
      shippingAddressElement.innerHTML = `
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
              ${order.shippingAddress.country}
          `
    }
  
    // Display payment method
    const paymentMethodElement = document.getElementById("payment-method")
    if (paymentMethodElement) {
      let paymentMethod = ""
      switch (order.paymentMethod) {
        case "credit-card":
          paymentMethod = `Credit Card (ending in ${order.paymentDetails.cardNumber.slice(-4)})`
          break
        case "paypal":
          paymentMethod = "PayPal"
          break
        case "bank-transfer":
          paymentMethod = "Bank Transfer"
          break
        default:
          paymentMethod = order.paymentMethod
      }
      paymentMethodElement.textContent = paymentMethod
    }
  
    // Display order items
    const orderItemsContainer = document.getElementById("order-items")
    if (orderItemsContainer && order.items) {
      orderItemsContainer.innerHTML = ""
  
      order.items.forEach((item) => {
        const itemElement = document.createElement("div")
        itemElement.className = "order-item"
        itemElement.innerHTML = `
                  <div class="order-item-image">
                      <img src="${item.image || "/placeholder.svg?height=80&width=80"}" alt="${item.name}">
                  </div>
                  <div class="order-item-details">
                      <h4>${item.name}</h4>
                      <p>Category: ${getCategoryName(item.category)}</p>
                      <p>Quantity: ${item.quantity}</p>
                  </div>
                  <div class="order-item-price">
                      ${formatCurrency(item.price * item.quantity)}
                  </div>
              `
        orderItemsContainer.appendChild(itemElement)
      })
    }
  
    // Display order summary
    document.getElementById("subtotal").textContent = formatCurrency(order.subtotal)
    document.getElementById("shipping").textContent = formatCurrency(order.shipping)
    document.getElementById("tax").textContent = formatCurrency(order.tax)
    document.getElementById("total").textContent = formatCurrency(order.total)
  
    // Update order status
    updateOrderStatus(order.status || "processing")
  }
  
  /**
   * Updates the order status display
   * @param {string} status - The current order status
   */
  function updateOrderStatus(status) {
    const statusElement = document.getElementById("order-status")
    const statusSteps = document.querySelectorAll(".status-step")
  
    if (statusElement) {
      statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1)
  
      // Update status class for styling
      statusElement.className = "status-" + status
    }
  
    // Update the status timeline
    if (statusSteps.length) {
      const statusMap = {
        processing: 0,
        confirmed: 1,
        shipped: 2,
        delivered: 3,
      }
  
      const currentStep = statusMap[status] || 0
  
      statusSteps.forEach((step, index) => {
        if (index <= currentStep) {
          step.classList.add("completed")
        } else {
          step.classList.remove("completed")
        }
      })
    }
  }
  
  /**
   * Initializes order tracking functionality (placeholder)
   * @param {string} orderId - The order ID to track
   */
  function initializeOrderTracking(orderId) {
    const trackOrderBtn = document.getElementById("track-order")
  
    if (trackOrderBtn) {
      trackOrderBtn.addEventListener("click", () => {
        // This would typically open a tracking page or modal
        // For now, just show an alert
        alert(`Tracking information for order ${orderId} will be available soon.`)
  
        // In a real application, this would redirect to a tracking page
        // window.location.href = `tracking.html?order=${orderId}`;
      })
    }
  }
  
  /**
   * Gets the formatted category name
   * @param {string} categoryId - The category ID
   * @return {string} The formatted category name
   */
  function getCategoryName(categoryId) {
    const categories = {
      guitars: "Guitars",
      keyboards: "Keyboards & Pianos",
      drums: "Drums & Percussion",
      brass: "Brass & Woodwinds",
      strings: "String Instruments",
      accessories: "Accessories",
    }
  
    return categories[categoryId] || categoryId
  }
  
  /**
   * Formats a number as currency
   * @param {number} amount - The amount to format
   * @return {string} The formatted currency string
   */
  function formatCurrency(amount) {
    return (
      "$" +
      Number.parseFloat(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
    )
  }
  