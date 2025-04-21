document.addEventListener("DOMContentLoaded", () => {
    // Initialize contact form
    initContactForm()
  
    // Initialize FAQ accordions
    initFAQAccordions()
  })
  
  function initContactForm() {
    const contactForm = document.getElementById("contactForm")
  
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault()
  
        // Get form data
        const formData = new FormData(this)
        const formValues = Object.fromEntries(formData.entries())
  
        // Validate form
        if (validateContactForm(formValues)) {
          // In a real application, you would send this data to your server
          console.log("Form submission:", formValues)
  
          // Show success message
          showNotification("Your message has been sent successfully! We'll get back to you soon.", "success")
  
          // Reset form
          contactForm.reset()
        }
      })
    }
  }
  
  function validateContactForm(formValues) {
    let isValid = true
    const errors = {}
  
    // Validate name
    if (!formValues.name || formValues.name.trim() === "") {
      errors.name = "Name is required"
      isValid = false
    }
  
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formValues.email || !emailRegex.test(formValues.email)) {
      errors.email = "Valid email is required"
      isValid = false
    }
  
    // Validate subject
    if (!formValues.subject || formValues.subject.trim() === "") {
      errors.subject = "Subject is required"
      isValid = false
    }
  
    // Validate message
    if (!formValues.message || formValues.message.trim() === "") {
      errors.message = "Message is required"
      isValid = false
    }
  
    // Display errors if any
    if (!isValid) {
      let errorMessage = "Please correct the following errors:\n"
      Object.values(errors).forEach((error) => {
        errorMessage += `- ${error}\n`
      })
  
      showNotification(errorMessage, "error")
    }
  
    return isValid
  }
  
  function initFAQAccordions() {
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
  
    // Auto hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 5000)
  }
  