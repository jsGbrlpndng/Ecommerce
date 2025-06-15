document.addEventListener("DOMContentLoaded", () => {
    // Initialize search functionality
    initSearch()
  })
  
  // Mock functions and data for demonstration purposes
  // In a real application, these would be imported or defined elsewhere
  const productsData = [] // Initialize productsData as an empty array
  function getCategoryName(category) {
    return category // Replace with actual implementation if needed
  }
  function formatCurrency(price) {
    return `$${price.toFixed(2)}` // Replace with actual implementation if needed
  }
  function addToCart(product) {
    console.log("Added to cart:", product) // Replace with actual implementation if needed
  }
  function showNotification(message, type) {
    console.log(`${type}: ${message}`) // Replace with actual implementation if needed
  }
  
  function initSearch() {
    // Get search form
    const searchForm = document.querySelector(".search-form")
    const searchInput = document.querySelector(".search-input")
  
    if (searchForm && searchInput) {
      // Handle search form submission
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const searchTerm = searchInput.value.trim()
  
        if (searchTerm) {
          // Redirect to shop page with search query
          window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`
        }
      })
  
      // Check if we're on the shop page and have a search query
      if (window.location.pathname.includes("shop.html")) {
        const urlParams = new URLSearchParams(window.location.search)
        const searchQuery = urlParams.get("search")
  
        if (searchQuery) {
          // Set the search input value
          searchInput.value = searchQuery
  
          // Perform search
          performSearch(searchQuery)
        }
      }
    }
  }
  
  function performSearch(query) {
    // In a real application, this would fetch data from your backend
    // For now, we'll use the products array from shop.js if available
  
    if (typeof productsData !== "undefined") {
      // Filter products by search query
      const results = productsData.filter((product) => {
        const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase()
        return searchableText.includes(query.toLowerCase())
      })
  
      // Update product count
      const productCountElement = document.getElementById("product-count")
      if (productCountElement) {
        productCountElement.textContent = `${results.length} products found for "${query}"`
      }
  
      // Display results
      const productsContainer = document.getElementById("products-container")
      if (productsContainer) {
        // Clear container
        productsContainer.innerHTML = ""
  
        if (results.length === 0) {
          // No results found
          productsContainer.innerHTML = `
            <div class="no-results">
              <div class="no-results-icon">
                <i class="fas fa-search"></i>
              </div>
              <h2>No results found</h2>
              <p>We couldn't find any products matching "${query}". Please try a different search term or browse our categories.</p>
              <a href="shop.html" class="btn btn-primary">View All Products</a>
            </div>
          `
        } else {
          // Create product cards for each result
          results.forEach((product) => {
            const productCard = createProductCard(product)
            productsContainer.appendChild(productCard)
          })
        }
      }
    }
  }
  
  // This function should match the one in shop.js
  function createProductCard(product) {
    const card = document.createElement("div")
    card.className = "product-card"
  
    // Use placeholder image if image is missing
    const imageSrc = product.image || "/placeholder.svg?height=300&width=300"
  
    card.innerHTML = `
      <div class="product-image">
        <img src="${imageSrc}" alt="${product.name}">
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
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
  
        if (product.inStock) {
          // Add product to cart
          addToCart(product)
          showNotification(`${product.name} added to cart!`, "success")
        } else {
          showNotification("Sorry, this product is out of stock", "error")
        }
      })
    }
  
    return card
  }
  