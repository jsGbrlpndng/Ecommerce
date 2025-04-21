document.addEventListener("DOMContentLoaded", () => {
  // Load order summary from localStorage
  loadOrderSummary()

  // Initialize checkout form
  initCheckoutForm()

  // Set up event listeners
  setupEventListeners()
})

function loadOrderSummary() {
  const orderSummary = JSON.parse(localStorage.getItem("orderSummary"))

  if (!orderSummary) {
    // Redirect to cart if no order summary
    window.location.href = "cart.html"
    return
  }

  // Update summary totals
  document.getElementById("checkout-subtotal").textContent = formatCurrency(orderSummary.subtotal)
  document.getElementById("checkout-shipping").textContent = formatCurrency(orderSummary.shipping)
  document.getElementById("checkout-tax").textContent = formatCurrency(orderSummary.tax)
  document.getElementById("checkout-total").textContent = formatCurrency(orderSummary.total)

  // Load summary items
  const summaryItemsContainer = document.getElementById("summary-items")
  summaryItemsContainer.innerHTML = ""

  orderSummary.items.forEach((item) => {
    const itemElement = document.createElement("div")
    itemElement.className = "summary-item"

    // Use placeholder image if image is missing
    const imageSrc = item.image || "/placeholder.svg?height=50&width=50"

    itemElement.innerHTML = `
      <div class="summary-item-image">
        <img src="${imageSrc}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=50&width=50&text=${encodeURIComponent(item.name)}'">
      </div>
      <div class="summary-item-details">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-meta">Qty: ${item.quantity}</div>
      </div>
      <div class="summary-item-price">${formatCurrency(item.price * item.quantity)}</div>
    `

    summaryItemsContainer.appendChild(itemElement)
  })
}

function initCheckoutForm() {
  // Show first section, hide others
  document.getElementById("shipping-section").classList.remove("hidden")
  document.getElementById("payment-section").classList.add("hidden")
  document.getElementById("review-section").classList.add("hidden")

  // Update progress steps
  updateProgressSteps("shipping")
}

function setupEventListeners() {
  // Next step buttons
  document.querySelectorAll(".next-step").forEach((button) => {
    button.addEventListener("click", function () {
      const nextSection = this.getAttribute("data-next")
      const currentSection = this.closest(".checkout-section").id

      // Validate current section before proceeding
      if (validateSection(currentSection)) {
        // Hide current section, show next section
        document.getElementById(currentSection).classList.add("hidden")
        document.getElementById(nextSection).classList.remove("hidden")

        // Update progress steps
        updateProgressSteps(nextSection.split("-")[0])

        // If moving to review section, populate review data
        if (nextSection === "review-section") {
          populateReviewData()
        }

        // Scroll to top of form
        document.querySelector(".checkout-form-container").scrollIntoView({ behavior: "smooth" })
      }
    })
  })

  // Back step buttons
  document.querySelectorAll(".back-step").forEach((button) => {
    button.addEventListener("click", function () {
      const prevSection = this.getAttribute("data-back")
      const currentSection = this.closest(".checkout-section").id

      // Hide current section, show previous section
      document.getElementById(currentSection).classList.add("hidden")
      document.getElementById(prevSection).classList.remove("hidden")

      // Update progress steps
      updateProgressSteps(prevSection.split("-")[0])

      // Scroll to top of form
      document.querySelector(".checkout-form-container").scrollIntoView({ behavior: "smooth" })
    })
  })

  // Edit buttons in review section
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const sectionToEdit = this.getAttribute("data-section")
      const currentSection = "review-section"

      // Hide current section, show section to edit
      document.getElementById(currentSection).classList.add("hidden")
      document.getElementById(sectionToEdit).classList.remove("hidden")

      // Update progress steps
      updateProgressSteps(sectionToEdit.split("-")[0])

      // Scroll to top of form
      document.querySelector(".checkout-form-container").scrollIntoView({ behavior: "smooth" })
    })
  })

  // Payment method selection
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      // Hide all payment forms
      document.querySelectorAll(".payment-form").forEach((form) => {
        form.classList.add("hidden")
      })

      // Show selected payment form
      document.getElementById(`${this.value}-form`).classList.remove("hidden")
    })
  })

  // Coupon toggle
  const couponToggle = document.querySelector(".coupon-toggle")
  const couponForm = document.querySelector(".coupon-form")

  if (couponToggle && couponForm) {
    couponToggle.addEventListener("click", function () {
      this.classList.toggle("active")
      couponForm.classList.toggle("hidden")
    })
  }

  // Shipping method selection
  document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      // Update shipping cost in summary
      const shippingCost = Number.parseFloat(this.value)
      document.getElementById("checkout-shipping").textContent = formatCurrency(shippingCost)

      // Update total
      updateTotal()
    })
  })

  // Form submission
  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault()

    // Validate final section
    if (validateSection("review-section")) {
      // Process order
      processOrder()
    }
  })
}

function validateSection(sectionId) {
  let isValid = true

  // Remove existing error messages
  document.querySelectorAll(".error-message").forEach((el) => el.remove())
  document.querySelectorAll(".form-control.error").forEach((el) => el.classList.remove("error"))

  // Validate based on section
  if (sectionId === "shipping-section") {
    // Required fields in shipping section
    const requiredFields = ["first-name", "last-name", "email", "phone", "address", "city", "state", "zip", "country"]

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId)
      if (!field.value.trim()) {
        showFieldError(field, "This field is required")
        isValid = false
      }
    })

    // Email validation
    const emailField = document.getElementById("email")
    if (emailField.value.trim() && !isValidEmail(emailField.value)) {
      showFieldError(emailField, "Please enter a valid email address")
      isValid = false
    }

    // Phone validation
    const phoneField = document.getElementById("phone")
    if (phoneField.value.trim() && !isValidPhone(phoneField.value)) {
      showFieldError(phoneField, "Please enter a valid phone number")
      isValid = false
    }

    // ZIP code validation
    const zipField = document.getElementById("zip")
    if (zipField.value.trim() && !isValidZip(zipField.value)) {
      showFieldError(zipField, "Please enter a valid ZIP/postal code")
      isValid = false
    }
  } else if (sectionId === "payment-section") {
    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value

    if (paymentMethod === "credit-card") {
      // Validate credit card fields
      const cardFields = ["card-number", "card-name", "exp-date", "cvv"]

      cardFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId)
        if (!field.value.trim()) {
          showFieldError(field, "This field is required")
          isValid = false
        }
      })

      // Card number validation
      const cardNumberField = document.getElementById("card-number")
      if (cardNumberField.value.trim() && !isValidCardNumber(cardNumberField.value)) {
        showFieldError(cardNumberField, "Please enter a valid card number")
        isValid = false
      }

      // Expiration date validation
      const expDateField = document.getElementById("exp-date")
      if (expDateField.value.trim() && !isValidExpDate(expDateField.value)) {
        showFieldError(expDateField, "Please enter a valid expiration date (MM/YY)")
        isValid = false
      }

      // CVV validation
      const cvvField = document.getElementById("cvv")
      if (cvvField.value.trim() && !isValidCVV(cvvField.value)) {
        showFieldError(cvvField, "Please enter a valid CVV code")
        isValid = false
      }
    }
  } else if (sectionId === "review-section") {
    // Validate terms checkbox
    const termsCheckbox = document.getElementById("terms")
    if (!termsCheckbox.checked) {
      showFieldError(termsCheckbox, "You must agree to the Terms & Conditions")
      isValid = false
    }
  }

  return isValid
}

function showFieldError(field, message) {
  field.classList.add("error")

  const errorMessage = document.createElement("div")
  errorMessage.className = "error-message"
  errorMessage.textContent = message

  field.parentNode.appendChild(errorMessage)
}

function updateProgressSteps(currentStep) {
  const steps = ["shipping", "payment", "review"]
  const currentIndex = steps.indexOf(currentStep)

  // Update step classes
  steps.forEach((step, index) => {
    const stepElement = document.querySelector(`.progress-step:nth-child(${index * 2 + 1})`)

    if (index < currentIndex) {
      stepElement.classList.remove("active")
      stepElement.classList.add("completed")
    } else if (index === currentIndex) {
      stepElement.classList.add("active")
      stepElement.classList.remove("completed")
    } else {
      stepElement.classList.remove("active")
      stepElement.classList.remove("completed")
    }
  })

  // Update progress lines
  document.querySelectorAll(".progress-line").forEach((line, index) => {
    if (index < currentIndex) {
      line.classList.add("active")
    } else {
      line.classList.remove("active")
    }
  })
}

function populateReviewData() {
  // Shipping information review
  const shippingReview = document.getElementById("shipping-review")
  shippingReview.innerHTML = `
    <p><strong>${document.getElementById("first-name").value} ${document.getElementById("last-name").value}</strong></p>
    <p>${document.getElementById("email").value}</p>
    <p>${document.getElementById("phone").value}</p>
    <p>${document.getElementById("address").value}</p>
    <p>${document.getElementById("city").value}, ${document.getElementById("state").value} ${document.getElementById("zip").value}</p>
    <p>${document.getElementById("country").options[document.getElementById("country").selectedIndex].text}</p>
    <p><strong>Shipping Method:</strong> ${document.querySelector('input[name="shipping"]:checked').parentNode.querySelector(".option-title").textContent}</p>
  `

  // Payment information review
  const paymentReview = document.getElementById("payment-review")
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value

  if (paymentMethod === "credit-card") {
    const cardNumber = document.getElementById("card-number").value
    const lastFour = cardNumber.slice(-4)
    paymentReview.innerHTML = `
      <p><strong>Payment Method:</strong> Credit Card</p>
      <p><strong>Card Number:</strong> **** **** **** ${lastFour}</p>
      <p><strong>Name on Card:</strong> ${document.getElementById("card-name").value}</p>
      <p><strong>Expiration Date:</strong> ${document.getElementById("exp-date").value}</p>
    `
  } else if (paymentMethod === "paypal") {
    paymentReview.innerHTML = `
      <p><strong>Payment Method:</strong> PayPal</p>
      <p>You will be redirected to PayPal to complete your payment after placing your order.</p>
    `
  } else if (paymentMethod === "bank-transfer") {
    paymentReview.innerHTML = `
      <p><strong>Payment Method:</strong> Bank Transfer</p>
      <p>Please use the bank details provided to complete your payment after placing your order.</p>
    `
  }

  // Order items review
  const orderItemsReview = document.getElementById("order-items-review")
  const orderSummary = JSON.parse(localStorage.getItem("orderSummary"))

  orderItemsReview.innerHTML = ""

  orderSummary.items.forEach((item) => {
    const itemElement = document.createElement("div")
    itemElement.className = "review-item"

    // Use placeholder image if image is missing
    const imageSrc = item.image || "/placeholder.svg?height=60&width=60"

    itemElement.innerHTML = `
      <div class="review-item-image">
        <img src="${imageSrc}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=60&width=60&text=${encodeURIComponent(item.name)}'">
      </div>
      <div class="review-item-details">
        <div class="review-item-name">${item.name}</div>
        <div class="review-item-meta">Quantity: ${item.quantity}</div>
      </div>
      <div class="review-item-price">${formatCurrency(item.price * item.quantity)}</div>
    `

    orderItemsReview.appendChild(itemElement)
  })
}

function updateTotal() {
  const orderSummary = JSON.parse(localStorage.getItem("orderSummary"))
  const shippingCost = Number.parseFloat(document.querySelector('input[name="shipping"]:checked').value)

  // Calculate new total
  const subtotal = orderSummary.subtotal
  const tax = orderSummary.tax
  const total = subtotal + shippingCost + tax

  // Update summary
  document.getElementById("checkout-shipping").textContent = formatCurrency(shippingCost)
  document.getElementById("checkout-total").textContent = formatCurrency(total)

  // Update order summary in localStorage
  orderSummary.shipping = shippingCost
  orderSummary.total = total
  localStorage.setItem("orderSummary", JSON.stringify(orderSummary))
}

function processOrder() {
  // Get form data
  const formData = new FormData(document.getElementById("checkout-form"))
  const orderData = Object.fromEntries(formData.entries())

  // Get order summary
  const orderSummary = JSON.parse(localStorage.getItem("orderSummary"))

  // Combine order data and summary
  const completeOrder = {
    ...orderData,
    ...orderSummary,
    orderId: generateOrderId(),
    orderDate: new Date().toISOString(),
    status: "Processing",
  }

  // Store complete order in localStorage
  localStorage.setItem("currentOrder", JSON.stringify(completeOrder))

  // Clear cart
  localStorage.removeItem("cart")

  // Redirect to order confirmation page
  window.location.href = "order-confirmation.html"
}

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

function generateOrderId() {
  return "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase()
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^\d{10,15}$/
  return phoneRegex.test(phone.replace(/\D/g, ""))
}

function isValidZip(zip) {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zip)
}

function isValidCardNumber(cardNumber) {
  const cardRegex = /^\d{16}$/
  return cardRegex.test(cardNumber.replace(/\D/g, ""))
}

function isValidExpDate(expDate) {
  const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
  return expRegex.test(expDate)
}

function isValidCVV(cvv) {
  const cvvRegex = /^\d{3,4}$/
  return cvvRegex.test(cvv)
}
