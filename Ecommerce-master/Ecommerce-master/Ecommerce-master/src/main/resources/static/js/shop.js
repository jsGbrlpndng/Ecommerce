// State management (declare only once at the top!)
let state = {
  products: [],
  filteredProducts: [],
  currentCategory: 'all',
  sortBy: 'featured',
  filters: {
    minPrice: null,
    maxPrice: null,
    inStockOnly: false
  },
  currentPage: 1,
  productsPerPage: 8,
  totalPages: 1
};

function getProductImagePath(image) {
  if (!image) return 'Images/instruments/placeholder.png';
  if (image.startsWith('/uploads/')) return image;
  // If it's just a filename, prepend the correct path
  return '/uploads/images/instruments/' + image.replace(/^\/+/,'');
}

function formatCurrencyPHP(price) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(price);
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-image product-link" style="cursor:pointer;" data-id="${product.id}">
      <img src="${getProductImagePath(product.image)}" alt="${product.name}" onerror="this.src='Images/instruments/placeholder.png'">
    </div>
    <div class="product-info">
      <h3 class="product-link" style="cursor:pointer;" data-id="${product.id}">${product.name}</h3>
      <div class="product-price">${formatCurrencyPHP(product.price)}</div>
      <div class="product-status">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
      <button class="add-to-cart-btn" ${product.stock <= 0 ? 'disabled' : ''} style="margin: 0 auto; display: block;">Add to Cart</button>
    </div>
  `;
  // Remove view details link
  // Add click event to image and name to go to product detail
  card.querySelectorAll('.product-link').forEach(el => {
    el.addEventListener('click', () => {
      window.location.href = `product-detail.html?id=${product.id}`;
    });
  });
  // Add to cart event
  card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => addToCart(product));
  return card;
}

async function loadProducts() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;
  try {
    productsGrid.innerHTML = '<div class="loading">Loading products...</div>';
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    const products = await response.json();
    state.products = products;
    renderProducts();
    updateProductCount();
  } catch (error) {
    productsGrid.innerHTML = '<div class="error">Failed to load products. Please try again later.</div>';
  }
}

function filterProducts() {
  return state.products.filter(product => {
    // Category filter
    if (state.currentCategory !== 'all' && product.category !== state.currentCategory) {
      return false;
    }
    // Price filter
    if (state.filters.minPrice && product.price < state.filters.minPrice) {
      return false;
    }
    if (state.filters.maxPrice && product.price > state.filters.maxPrice) {
      return false;
    }
    // Stock filter
    if (state.filters.inStockOnly && product.stock <= 0) {
      return false;
    }
    return true;
  });
}

function sortProducts(products) {
  const sorted = [...products];
  switch (state.sortBy) {
    case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
    case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
    case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'name-desc': sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
  }
  return sorted;
}

function renderProducts() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;
  let filtered = filterProducts();
  filtered = sortProducts(filtered); // Ensure sorting is always applied
  // Pagination logic
  const totalPages = Math.ceil(filtered.length / state.productsPerPage) || 1;
  state.totalPages = totalPages;
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  const startIdx = (state.currentPage - 1) * state.productsPerPage;
  const endIdx = startIdx + state.productsPerPage;
  const pageProducts = filtered.slice(startIdx, endIdx);
  productsGrid.innerHTML = '';
  if (pageProducts.length === 0) {
    productsGrid.innerHTML = '<div class="no-products">No products found.</div>';
  } else {
    pageProducts.forEach(product => {
      productsGrid.appendChild(createProductCard(product));
    });
  }
  renderPagination();
}

function renderPagination() {
  const paginationBar = document.getElementById('pagination-bar');
  if (!paginationBar) return;
  paginationBar.innerHTML = '';
  if (state.totalPages <= 1) return;
  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Prev';
  prevBtn.className = 'pagination-btn';
  prevBtn.disabled = state.currentPage === 1;
  prevBtn.onclick = () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderProducts();
    }
  };
  paginationBar.appendChild(prevBtn);
  // Page numbers
  for (let i = 1; i <= state.totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = 'pagination-btn' + (i === state.currentPage ? ' active' : '');
    pageBtn.onclick = () => {
      state.currentPage = i;
      renderProducts();
    };
    paginationBar.appendChild(pageBtn);
  }
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.className = 'pagination-btn';
  nextBtn.disabled = state.currentPage === state.totalPages;
  nextBtn.onclick = () => {
    if (state.currentPage < state.totalPages) {
      state.currentPage++;
      renderProducts();
    }
  };
  paginationBar.appendChild(nextBtn);
}

// When filters or sorts change, reset to page 1
function resetToFirstPageAndRender() {
  state.currentPage = 1;
  renderProducts();
}

function updateProductCount() {
  const countElement = document.getElementById('product-count');
  if (countElement) {
    const filteredCount = filterProducts().length;
    countElement.textContent = `${filteredCount} products found`;
  }
}

function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  if (typeof window.updateCartCount === 'function') window.updateCartCount();
  showToast('Added to cart!');
}

function setupEventListeners() {
  document.querySelectorAll('.category-link').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.category-link').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = btn.dataset.category;
      state.currentPage = 1;
      renderProducts();
      updateProductCount();
    });
  });
  const applyPriceBtn = document.getElementById('apply-price');
  if (applyPriceBtn) {
    applyPriceBtn.addEventListener('click', () => {
      state.filters.minPrice = parseFloat(document.getElementById('min-price').value) || null;
      state.filters.maxPrice = parseFloat(document.getElementById('max-price').value) || null;
      state.currentPage = 1;
      renderProducts();
      updateProductCount();
    });
  }
  const stockCheckbox = document.querySelector('input[value="in-stock"]');
  if (stockCheckbox) {
    stockCheckbox.addEventListener('change', () => {
      state.filters.inStockOnly = stockCheckbox.checked;
      state.currentPage = 1;
      renderProducts();
      updateProductCount();
    });
  }
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sortBy = sortSelect.value;
      resetToFirstPageAndRender();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupEventListeners();
  updateCartCount();

  // User info logic (unchanged)
  fetch('/api/users/me', { credentials: 'include' })
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

  // Login form handler (unchanged)
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

  // Admin Login button (unchanged)
  const showAdminBtn = document.getElementById('show-admin-login');
  if (showAdminBtn) {
    showAdminBtn.addEventListener('click', function() {
      window.location.href = 'admin/index.html';
    });
  }

  // Logout button (unchanged)
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

  // View switching (grid/list)
  const viewButtons = document.querySelectorAll('.view-controls button');
  const productsGrid = document.getElementById('products-grid');
  let currentView = 'grid';

  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.classList.contains('grid-view') ? 'grid' : 'list';
      if (currentView === view) return;

      currentView = view;
      viewButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      productsGrid.classList.toggle('list-view', currentView === 'list');
      
      // Trigger re-render of products to adjust layout
      if (state.filteredProducts.length > 0) {
        renderProducts(getCurrentPageProducts());
      }
    });
  });

  // Load initial products
  loadProducts();

  // Initialize filters
  initFilters();
  updateCartCount();

  // Category filter from URL param
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam) {
    // Normalize mapping for sidebar
    const map = {
      'Strings': 'string',
      'Percussion': 'percussion',
      'Wind': 'wind',
      'Keyboard': 'keyboard',
      'Electronics': 'electronic'
    };
    const sidebarCat = map[catParam] || catParam.toLowerCase();
    document.querySelectorAll('.category-link').forEach(link => {
      if (link.dataset.category === sidebarCat) {
        link.click();
      }
    });
  }

  // Polling for product updates
  async function showProductsUpdatedNotification() {
    let notif = document.getElementById('products-updated-notification');
    if (!notif) {
      notif = document.createElement('div');
      notif.id = 'products-updated-notification';
      notif.style.position = 'fixed';
      notif.style.top = '0';
      notif.style.left = '0';
      notif.style.width = '100%';
      notif.style.background = '#6a5acd';
      notif.style.color = '#fff';
      notif.style.textAlign = 'center';
      notif.style.padding = '12px 0';
      notif.style.zIndex = '9999';
      notif.style.fontWeight = 'bold';
      notif.style.fontSize = '1.1rem';
      notif.style.boxShadow = '0 2px 8px rgba(106,90,205,0.08)';
      notif.textContent = 'Products updated!';
      document.body.appendChild(notif);
    } else {
      notif.textContent = 'Products updated!';
      notif.style.display = 'block';
    }
    setTimeout(() => {
      notif.style.display = 'none';
    }, 2500);
  }

  async function pollProducts(interval = 10000) {
    let lastProductsJson = JSON.stringify(state.products);
    setInterval(async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) return;
        const products = await response.json();
        const newProductsJson = JSON.stringify(products);
        if (newProductsJson !== lastProductsJson) {
          state.products = products;
          renderProducts();
          updateProductCount && updateProductCount();
          lastProductsJson = newProductsJson;
          showProductsUpdatedNotification();
        }
      } catch (e) { /* ignore errors for polling */ }
    }, interval);
  }

  // Call polling after initial load
  window.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    pollProducts();
  });
});

// Initialize filters and event listeners
function initFilters() {
  // Category filters
  const categoryLinks = document.querySelectorAll('.category-link');
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.target.dataset.category;
      state.currentPage = 1; // Reset to first page when filtering
      loadProducts(category);
    });
  });

  // Availability filters
  const availabilityCheckboxes = document.querySelectorAll('.availability-checkbox');
  availabilityCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      console.log('Availability filters:', Array.from(availabilityCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value));
      loadProducts();
    });
  });

  // Price range filters
  const applyPriceBtn = document.querySelector('.apply-price-btn');
  if (applyPriceBtn) {
    applyPriceBtn.addEventListener('click', () => {
      const minPrice = parseFloat(document.getElementById('min-price').value);
      const maxPrice = parseFloat(document.getElementById('max-price').value);
      console.log('Price range filter:', { minPrice, maxPrice });
      loadProducts();
    });
  }

  // Brand filters
  const brandCheckboxes = document.querySelectorAll('.brand-checkbox');
  brandCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      console.log('Brand filters:', Array.from(brandCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value));
      loadProducts();
    });
  });

  // Sort options
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      console.log('Sort by:', sortSelect.value);
      loadProducts();
    });
  }
}