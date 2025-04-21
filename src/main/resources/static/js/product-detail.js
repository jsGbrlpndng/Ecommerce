document.addEventListener("DOMContentLoaded", () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const productId = urlParams.get("id")
  
    if (productId) {
      // Load product details
      loadProductDetails(productId)
    } else {
      // Redirect to shop page if no product ID
      window.location.href = "shop.html"
    }
  
    // Initialize tabs
    initTabs()
  
    // Initialize rating selector
    initRatingSelector()
  })
  
  // Load product details
  function loadProductDetails(productId) {
    // In a real application, this would fetch data from an API
    // For now, we'll use the mock product data
    const product = getProductById(Number.parseInt(productId))
  
    if (!product) {
      // Product not found, redirect to shop page
      window.location.href = "shop.html"
      return
    }
  
    // Update page title
    document.title = `${product.name} - Harmony Haven`
  
    // Update breadcrumb
    document.getElementById("product-breadcrumb-name").textContent = product.name
  
    // Update product info
    document.getElementById("product-category").textContent = getCategoryName(product.category)
    document.getElementById("product-name").textContent = product.name
    document.getElementById("product-price").textContent = formatCurrency(product.price)
    document.getElementById("product-description").textContent = product.description
    document.getElementById("product-availability").textContent = product.inStock ? "In Stock" : "Out of Stock"
    document.getElementById("product-availability").className = product.inStock
      ? "availability-status in-stock"
      : "availability-status out-of-stock"
    document.getElementById("product-sku").textContent = `MH-${product.id}${product.id}${product.id}`
  
    // Update rating
    updateRatingStars(document.getElementById("product-rating"), product.rating)
    document.getElementById("product-reviews").textContent = `(${product.reviews} reviews)`
  
    // Update full description
    document.getElementById("full-description").innerHTML = `
      <p>${product.description}</p>
      <p>Whether you're playing blues, rock, jazz, or metal, this instrument delivers the sound and performance you need. The comfortable neck profile and smooth fretboard make it a joy to play for hours.</p>
      <p>Crafted with premium materials and attention to detail, this ${product.name.toLowerCase()} is designed to inspire creativity and musical excellence.</p>
    `
  
    // Update features list
    const featuresList = document.getElementById("features-list")
    featuresList.innerHTML = ""
    product.features.forEach((feature) => {
      const li = document.createElement("li")
      li.textContent = feature
      featuresList.appendChild(li)
    })
  
    // Update specifications
    const specificationsTable = document.getElementById("specifications-table")
    specificationsTable.innerHTML = `
      <tr>
        <th>Brand</th>
        <td>${getBrandFromName(product.name)}</td>
      </tr>
      <tr>
        <th>Model</th>
        <td>${getModelFromName(product.name)}</td>
      </tr>
      <tr>
        <th>Category</th>
        <td>${getCategoryName(product.category)}</td>
      </tr>
      <tr>
        <th>Color</th>
        <td>${getRandomColor()}</td>
      </tr>
      <tr>
        <th>Weight</th>
        <td>${getRandomWeight(product.category)} kg</td>
      </tr>
      <tr>
        <th>Dimensions</th>
        <td>${getRandomDimensions(product.category)}</td>
      </tr>
      <tr>
        <th>Warranty</th>
        <td>2 Years</td>
      </tr>
    `
  
    // Update reviews
    updateReviews(product)
  
    // Update product images
    updateProductImages(product)
  
    // Update related products
    loadRelatedProducts(product)
  
    // Update recently viewed products
    updateRecentlyViewed(product)
  
    // Initialize add to cart button
    initAddToCart(product)
  
    // Initialize product gallery
    initProductGallery()
  }
  
  // Initialize tabs
  function initTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn")
    const tabPanels = document.querySelectorAll(".tab-panel")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons and panels
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabPanels.forEach((panel) => panel.classList.remove("active"))
  
        // Add active class to clicked button and corresponding panel
        button.classList.add("active")
        const tabId = button.getAttribute("data-tab")
        document.getElementById(`${tabId}-panel`).classList.add("active")
      })
    })
  }
  
  // Initialize rating selector
  function initRatingSelector() {
    const ratingStars = document.querySelectorAll(".rating-selector i")
  
    ratingStars.forEach((star) => {
      star.addEventListener("click", () => {
        const rating = Number.parseInt(star.getAttribute("data-rating"))
  
        // Update stars
        ratingStars.forEach((s) => {
          const starRating = Number.parseInt(s.getAttribute("data-rating"))
          if (starRating <= rating) {
            s.classList.remove("far")
            s.classList.add("fas")
            s.classList.add("active")
          } else {
            s.classList.remove("fas")
            s.classList.add("far")
            s.classList.remove("active")
          }
        })
      })
    })
  }
  
  // Update rating stars
  function updateRatingStars(container, rating) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
  
    container.innerHTML = ""
  
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      const star = document.createElement("i")
      star.className = "fas fa-star"
      container.appendChild(star)
    }
  
    // Add half star if needed
    if (hasHalfStar) {
      const halfStar = document.createElement("i")
      halfStar.className = "fas fa-star-half-alt"
      container.appendChild(halfStar)
    }
  
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      const emptyStar = document.createElement("i")
      emptyStar.className = "far fa-star"
      container.appendChild(emptyStar)
    }
  }
  
  // Update reviews
  function updateReviews(product) {
    // Update average rating
    document.getElementById("average-rating").textContent = product.rating.toFixed(1)
    document.getElementById("total-reviews").textContent = `Based on ${product.reviews} reviews`
  
    // Generate mock reviews
    const reviewsList = document.getElementById("reviews-list")
    reviewsList.innerHTML = ""
  
    const reviewsCount = Math.min(product.reviews, 5) // Show up to 5 reviews
  
    for (let i = 0; i < reviewsCount; i++) {
      const reviewRating = getRandomRating(product.rating)
      const reviewDate = getRandomDate()
  
      const reviewItem = document.createElement("div")
      reviewItem.className = "review-item"
      reviewItem.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <h4>Customer ${getRandomName()}</h4>
            <div class="review-date">${reviewDate}</div>
          </div>
          <div class="review-rating">
            ${"★".repeat(reviewRating)}${"☆".repeat(5 - reviewRating)}
          </div>
        </div>
        <h3 class="review-title">${getRandomReviewTitle(product.name, reviewRating)}</h3>
        <div class="review-content">
          <p>${getRandomReviewContent(product.name, reviewRating)}</p>
        </div>
      `
  
      reviewsList.appendChild(reviewItem)
    }
  }
  
  // Update product images
  function updateProductImages(product) {
    const mainImageWrapper = document.getElementById("main-image-wrapper")
    const thumbnailWrapper = document.getElementById("thumbnail-wrapper")
  
    // Clear existing images
    mainImageWrapper.innerHTML = ""
    thumbnailWrapper.innerHTML = ""
  
    // Add main product image
    const mainSlide = document.createElement("div")
    mainSlide.className = "swiper-slide"
    mainSlide.innerHTML = `<img src="${product.image}" alt="${product.name}">`
    mainImageWrapper.appendChild(mainSlide)
  
    // Add thumbnail
    const thumbSlide = document.createElement("div")
    thumbSlide.className = "swiper-slide"
    thumbSlide.innerHTML = `<img src="${product.image}" alt="${product.name}">`
    thumbnailWrapper.appendChild(thumbSlide)
  
    // Add additional images (mock)
    for (let i = 0; i < 3; i++) {
      const additionalMainSlide = document.createElement("div")
      additionalMainSlide.className = "swiper-slide"
      additionalMainSlide.innerHTML = `<img src="/placeholder.svg?height=500&width=500" alt="${product.name} - View ${i + 2}">`
      mainImageWrapper.appendChild(additionalMainSlide)
  
      const additionalThumbSlide = document.createElement("div")
      additionalThumbSlide.className = "swiper-slide"
      additionalThumbSlide.innerHTML = `<img src="/placeholder.svg?height=100&width=100" alt="${product.name} - View ${i + 2}">`
      thumbnailWrapper.appendChild(additionalThumbSlide)
    }
  }
  
  // Initialize product gallery
  function initProductGallery() {
    // Check if Swiper is already defined
    if (typeof Swiper === "undefined") {
      console.error("Swiper is not defined. Make sure to include the Swiper library.")
      return
    }
  
    const thumbsSwiper = new Swiper(".product-thumbnail-slider", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    })
  
    const mainSwiper = new Swiper(".product-main-slider", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: thumbsSwiper,
      },
    })
  }
  
  // Load related products
  function loadRelatedProducts(product) {
    const relatedProductsContainer = document.getElementById("related-products")
    relatedProductsContainer.innerHTML = ""
  
    // Get products in the same category
    const relatedProducts = getProductsByCategory(product.category)
      .filter((p) => p.id !== product.id)
      .slice(0, 4)
  
    relatedProducts.forEach((relatedProduct) => {
      const productCard = createProductCard(relatedProduct)
      relatedProductsContainer.appendChild(productCard)
    })
  }
  
  // Update recently viewed products
  function updateRecentlyViewed(product) {
    // Get recently viewed products from localStorage
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || []
  
    // Add current product to the beginning of the array
    recentlyViewed = [product.id, ...recentlyViewed.filter((id) => id !== product.id)].slice(0, 4)
  
    // Save to localStorage
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed))
  
    // Display recently viewed products
    const recentlyViewedContainer = document.getElementById("recently-viewed-products")
    recentlyViewedContainer.innerHTML = ""
  
    const recentProducts = recentlyViewed
      .filter((id) => id !== product.id)
      .map((id) => getProductById(id))
      .filter((p) => p) // Filter out null values
  
    if (recentProducts.length === 0) {
      // Hide section if no recently viewed products
      document.querySelector(".recently-viewed").style.display = "none"
      return
    }
  
    recentProducts.forEach((recentProduct) => {
      const productCard = createProductCard(recentProduct)
      recentlyViewedContainer.appendChild(productCard)
    })
  }
  
  // Initialize add to cart button
  function initAddToCart(product) {
    const addToCartBtn = document.getElementById("add-to-cart-btn")
    const quantityInput = document.querySelector(".quantity-input")
    const decreaseBtn = document.querySelector(".quantity-btn.decrease")
    const increaseBtn = document.querySelector(".quantity-btn.increase")
  
    // Disable button if product is out of stock
    if (!product.inStock) {
      addToCartBtn.disabled = true
      addToCartBtn.classList.add("disabled")
      addToCartBtn.innerHTML = '<i class="fas fa-times"></i> Out of Stock'
    }
  
    // Quantity buttons
    decreaseBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value)
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1
      }
    })
  
    increaseBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value)
      quantityInput.value = currentValue + 1
    })
  
    // Add to cart button
    addToCartBtn.addEventListener("click", () => {
      if (!product.inStock) return
  
      const quantity = Number.parseInt(quantityInput.value)
  
      // Add to cart
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
          quantity: quantity,
        })
      }
  
      localStorage.setItem("cart", JSON.stringify(cart))
  
      // Update cart count
      updateCartCount()
  
      // Show notification
      showNotification(`${product.name} added to cart!`)
    })
  }
  
  // Create product card
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
  
    // Make the whole card clickable
    card.addEventListener("click", () => {
      window.location.href = `product-detail.html?id=${product.id}`
    })
  
    // Add event listeners for action buttons
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
  
    return card
  }
  
  // Helper functions
  function getProductById(productId) {
    return products.find((product) => product.id === productId)
  }
  
  function getProductsByCategory(category) {
    return products.filter((product) => product.category === category)
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
  
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }
  
  function getBrandFromName(name) {
    const firstWord = name.split(" ")[0]
    return firstWord
  }
  
  function getModelFromName(name) {
    const words = name.split(" ")
    if (words.length > 1) {
      return words.slice(1).join(" ")
    }
    return "Standard Model"
  }
  
  function getRandomColor() {
    const colors = ["Black", "Natural", "Sunburst", "Cherry Red", "Vintage White", "Blue", "Silver"]
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  function getRandomWeight(category) {
    switch (category) {
      case "string":
        return (2 + Math.random() * 3).toFixed(1)
      case "percussion":
        return (10 + Math.random() * 15).toFixed(1)
      case "keyboard":
        return (15 + Math.random() * 25).toFixed(1)
      case "wind":
        return (1 + Math.random() * 2).toFixed(1)
      case "electronic":
        return (5 + Math.random() * 10).toFixed(1)
      default:
        return (1 + Math.random() * 5).toFixed(1)
    }
  }
  
  function getRandomDimensions(category) {
    switch (category) {
      case "string":
        return `${Math.floor(90 + Math.random() * 20)} x ${Math.floor(30 + Math.random() * 10)} x ${Math.floor(5 + Math.random() * 5)} cm`
      case "percussion":
        return `${Math.floor(120 + Math.random() * 30)} x ${Math.floor(120 + Math.random() * 30)} x ${Math.floor(80 + Math.random() * 20)} cm`
      case "keyboard":
        return `${Math.floor(120 + Math.random() * 30)} x ${Math.floor(40 + Math.random() * 10)} x ${Math.floor(15 + Math.random() * 5)} cm`
      case "wind":
        return `${Math.floor(50 + Math.random() * 20)} x ${Math.floor(10 + Math.random() * 5)} x ${Math.floor(10 + Math.random() * 5)} cm`
      case "electronic":
        return `${Math.floor(80 + Math.random() * 20)} x ${Math.floor(30 + Math.random() * 10)} x ${Math.floor(10 + Math.random() * 5)} cm`
      default:
        return `${Math.floor(50 + Math.random() * 50)} x ${Math.floor(20 + Math.random() * 30)} x ${Math.floor(10 + Math.random() * 10)} cm`
    }
  }
  
  function getRandomRating(baseRating) {
    // Generate a random rating close to the base rating
    const min = Math.max(1, Math.floor(baseRating) - 1)
    const max = Math.min(5, Math.ceil(baseRating) + 1)
    return Math.floor(min + Math.random() * (max - min + 1))
  }
  
  function getRandomDate() {
    const now = new Date()
    const pastDate = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000) // Random date within past 180 days
    return pastDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }
  
  function getRandomName() {
    const names = ["John", "Sarah", "Michael", "Emily", "David", "Jessica", "Robert", "Jennifer", "William", "Elizabeth"]
    return names[Math.floor(Math.random() * names.length)]
  }
  
  function getRandomReviewTitle(productName, rating) {
    if (rating >= 4) {
      const goodTitles = [
        `Excellent ${productName}!`,
        "Highly Recommended",
        "Exceeded My Expectations",
        "Worth Every Penny",
        "Fantastic Quality",
      ]
      return goodTitles[Math.floor(Math.random() * goodTitles.length)]
    } else if (rating >= 3) {
      const averageTitles = [
        "Good, but not great",
        "Decent product",
        "Satisfied with my purchase",
        "Pretty good overall",
        "Good value for money",
      ]
      return averageTitles[Math.floor(Math.random() * averageTitles.length)]
    } else {
      const poorTitles = [
        "Disappointed",
        "Not what I expected",
        "Needs improvement",
        "Wouldn't recommend",
        "Overpriced for the quality",
      ]
      return poorTitles[Math.floor(Math.random() * poorTitles.length)]
    }
  }
  
  function getRandomReviewContent(productName, rating) {
    if (rating >= 4) {
      const goodReviews = [
        `I'm extremely happy with my ${productName}. The sound quality is exceptional and it's beautifully crafted. Would definitely recommend to both beginners and professionals.`,
        `This ${productName} exceeded all my expectations. The tone is rich and warm, and the build quality is outstanding. Shipping was fast and it arrived in perfect condition.`,
        `After trying several different options, this ${productName} is by far the best. The playability is smooth and the sound is incredible. Customer service was also excellent.`,
        `I've been playing for over 20 years and this ${productName} is one of the best I've owned. The attention to detail is impressive and the sound is exactly what I was looking for.`,
        `The ${productName} arrived well-packaged and in perfect condition. It sounds even better than I expected and looks stunning. Definitely worth the investment.`,
      ]
      return goodReviews[Math.floor(Math.random() * goodReviews.length)]
    } else if (rating >= 3) {
      const averageReviews = [
        `The ${productName} is good for the price. It's not professional quality, but it's perfect for beginners or casual players. Sound is decent but could be better.`,
        `Overall satisfied with my ${productName}. There are a few minor issues with the finish, but nothing that affects the sound. Good value for the price.`,
        `This ${productName} is pretty good. Not amazing, but definitely not bad either. It does the job and sounds decent. Shipping was quick and packaging was good.`,
        `The ${productName} is a solid instrument for the price range. It has a few imperfections, but the sound quality is good enough for practice and casual playing.`,
        `Decent ${productName} for the money. It's not going to blow you away, but it's reliable and sounds good enough for what I need.`,
      ]
      return averageReviews[Math.floor(Math.random() * averageReviews.length)]
    } else {
      const poorReviews = [
        `I was disappointed with this ${productName}. The quality is not what I expected for the price, and there were several issues with the finish.`,
        `The ${productName} arrived with a few scratches and the sound quality is mediocre at best. I expected better for the price I paid.`,
        `I wouldn't recommend this ${productName}. It doesn't stay in tune and the overall build quality feels cheap. I'll be returning it.`,
        `Not happy with my purchase. The ${productName} has several flaws and doesn't sound as described. Customer service was also unhelpful when I reported the issues.`,
        `Save your money and look elsewhere. This ${productName} is overpriced for the quality you get. I regret not spending a bit more for a better brand.`,
      ]
      return poorReviews[Math.floor(Math.random() * poorReviews.length)]
    }
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
  
  // Mock product data
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
  