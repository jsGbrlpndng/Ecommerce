function formatCurrency(amount) {
    if (!amount && amount !== 0) return '₱0.00';
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function getStatusBadgeClass(status) {
    status = (status || '').toLowerCase();
    switch (status) {
        case 'pending':
        case 'processing':
        case 'shipped':
        case 'delivered':
        case 'cancelled':
            return status;
        default:
            return 'pending';
    }
}

function getStatusIcon(status) {
    status = (status || '').toLowerCase();
    switch (status) {
        case 'pending':
            return 'fa-clock';
        case 'processing':
            return 'fa-cog fa-spin';
        case 'shipped':
            return 'fa-truck';
        case 'delivered':
            return 'fa-check-circle';
        case 'cancelled':
            return 'fa-times-circle';
        default:
            return 'fa-clock';
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatProductPrice(price, quantity = 1) {
    const numericPrice = parseFloat(price);
    return isNaN(numericPrice) ? '₱0.00' : formatCurrency(numericPrice * quantity);
}

function validateProductData(item) {
    if (!item) return null;
    return {
        id: item.id || item.productId || 'N/A',
        name: item.name || item.productName || 'Product Name Not Available',
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: item.image || item.productImage || '/Images/instruments/placeholder.png',
        category: item.category || item.productCategory || '',
        description: item.description || ''
    };
}

function displayEmptyOrdersMessage() {
    return `
        <div class="empty-orders">
            <i class="fas fa-shopping-bag"></i>
            <h3>No Orders Found</h3>
            <p>You haven't placed any orders yet.</p>
            <br>
            <a href="shop.html" class="btn btn-primary">Start Shopping</a>
        </div>
    `;
}

function displayLoginPrompt() {
    return `
        <div class="order-status-card">
            <p style="text-align: center; padding: 32px;">
                Please log in to view your orders. 
                <br><br>
                <a href="login.html?redirect=${encodeURIComponent(window.location.href)}" class="btn btn-primary">Log In</a>
            </p>
        </div>
    `;
}

function handleProductImage(imgElement, product) {
    const defaultImage = '/images/instruments/placeholder.png'; // fixed path: lowercase 'images'
    imgElement.onerror = function() {
        this.onerror = null;
        this.src = defaultImage;
        this.classList.add('error');
    };
    
    // If product has an image path, use it; otherwise, try to construct from ID
    const imagePath = product.image || `/images/instruments/${product.id}.jpg`; // fixed path: lowercase 'images'
    imgElement.src = imagePath;
    imgElement.classList.remove('error');
}

async function loadOrderStatus() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const ordersTableContainer = document.getElementById('orders-table-container');
    const ordersTableBody = document.getElementById('orders-table-body');

    try {
        // Show loading state
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        if (ordersTableContainer) ordersTableContainer.style.display = 'none';
        if (ordersTableBody) ordersTableBody.innerHTML = '';

        // Check authenticated user data from API
        const customer = await API.getCurrentUser();
        if (!customer || !customer.id) {
            throw new Error('Not logged in');
        }

        // Update UI with user info
        updateHeaderUserInfo(customer);

        // Fetch orders for the authenticated user
        const orders = await API.getUserOrders(customer.id);

        // Display orders in table preview
        if (!orders || !orders.length) {
            if (ordersTableContainer) ordersTableContainer.style.display = 'none';
            // Show empty message in errorMessage for visibility
            if (errorMessage) {
                errorMessage.innerHTML = displayEmptyOrdersMessage();
                errorMessage.style.display = 'block';
            }
        } else {
            if (ordersTableContainer) ordersTableContainer.style.display = '';
            if (errorMessage) errorMessage.style.display = 'none';
            renderOrdersTable(orders);
        }

        // Show total orders count
        const totalOrdersDiv = document.getElementById('total-orders-count');
        const totalOrdersValue = document.getElementById('totalOrdersValue');
        if (totalOrdersDiv && totalOrdersValue) {
            let count = 0;
            if (typeof customer.orders === 'number') {
                count = customer.orders;
            } else if (orders && Array.isArray(orders)) {
                count = orders.length;
            }
            totalOrdersValue.textContent = count;
            totalOrdersDiv.style.display = '';
        }
    } catch (error) {
        console.error('Error in order-status.js:', error);
        if (errorMessage) {
            if (error.message === 'Not logged in' || error.message === 'User not found') {
                errorMessage.innerHTML = displayLoginPrompt();
            } else if (error.message && error.message.toLowerCase().includes('server error')) {
                errorMessage.innerHTML = `<div class="order-status-card"><p style="text-align: center; color: #e74c3c; padding: 32px;"><i class="fas fa-exclamation-circle"></i> Server error. Please try again later.</p></div>`;
            } else {
                errorMessage.innerHTML = `<div class="order-status-card"><p style="text-align: center; color: #e74c3c; padding: 32px;"><i class="fas fa-exclamation-circle"></i> ${error.message || 'Error loading orders. Please try again later.'}</p></div>`;
            }
            errorMessage.style.display = 'block';
        }
        if (ordersTableContainer) ordersTableContainer.style.display = 'none';
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    }
}

// Render orders in table preview
function renderOrdersTable(orders) {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';
    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.classList.add('order-preview-row');
        tr.innerHTML = `
            <td>${order.orderId || order.id || 'N/A'}</td>
            <td><span class="order-status-badge ${getStatusBadgeClass(order.status)}">${order.status || 'Processing'}</span></td>
            <td>${formatDate(order.orderDate || order.date)}</td>
            <td>${formatCurrency(order.totals?.total ?? 0)}</td>
        `;
        tr.addEventListener('click', () => showOrderModal(order));
        tbody.appendChild(tr);
    });
}

// Show modal with full order details
function showOrderModal(order) {
    const modal = document.getElementById('order-modal');
    const modalBody = document.getElementById('order-modal-body');
    modalBody.innerHTML = generateOrderCardHTML(order);
    modal.style.display = 'block';
}

// Hide modal logic
function hideOrderModal() {
    document.getElementById('order-modal').style.display = 'none';
}

document.getElementById('order-modal-close').addEventListener('click', hideOrderModal);
document.getElementById('order-modal-overlay').addEventListener('click', hideOrderModal);

function updateHeaderUserInfo(customer) {
    const elements = {
        username: document.getElementById('dropdown-username'),
        email: document.getElementById('dropdown-email'),
        userInfo: document.getElementById('user-info-section'),
        logout: document.getElementById('logout-btn'),
        login: document.getElementById('dropdown-login-form'),
        register: document.getElementById('register-link-section')
    };

    if (elements.username) {
        elements.username.textContent = customer.username || `${customer.firstName} ${customer.lastName}`;
    }
    if (elements.email) {
        elements.email.textContent = customer.email;
    }
    if (elements.userInfo) {
        elements.userInfo.style.display = '';
    }
    if (elements.logout) {
        elements.logout.style.display = '';
    }
    if (elements.login) {
        elements.login.style.display = 'none';
    }
    if (elements.register) {
        elements.register.style.display = 'none';
    }
}

function generateCustomerInfoHTML(customer) {
    return `
        <h2>Customer Information</h2>
        <div class="order-status-card">
            <div class="order-details">
                <p><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Phone:</strong> ${customer.phone || 'Not provided'}</p>
            </div>
        </div>
    `;
}

// Remove or update generateOrdersListHTML to not render cards in main list
function generateOrdersListHTML(orders) {
    return '';
}

function generateOrderCardHTML(order) {
    const items = Array.isArray(order.items) ? order.items.map(validateProductData).filter(Boolean) : [];
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-meta">
                    <h3>Order #${order.orderId || 'N/A'}</h3>
                    <span class="status-badge ${getStatusBadgeClass(order.status)}">
                        <i class="fas ${getStatusIcon(order.status)}"></i> 
                        ${order.status || 'Processing'}
                    </span>
                </div>
                <div class="order-date">
                    <i class="far fa-calendar-alt"></i> 
                    ${formatDate(order.orderDate)}
                </div>
            </div>
            <div class="order-user-info">
                <h3>Shipping & Contact Info</h3>
                <p><strong>Name:</strong> ${order.firstName || ''} ${order.lastName || ''}</p>
                <p><strong>Email:</strong> ${order.email || ''}</p>
                <p><strong>Phone:</strong> ${order.phone || ''}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod || ''}</p>
                <p><strong>Shipping Method:</strong> ${order.shippingMethod || ''}</p>
                <p><strong>Address:</strong> ${order.address || ''}</p>
            </div>
            <div class="order-products">
                ${generateProductsListHTML(items)}
            </div>
            <div class="order-footer">
                ${generateOrderSummaryHTML(order)}
            </div>
        </div>
    `;
}

function generateProductsListHTML(products) {
    if (!products || products.length === 0) {
        return '<p class="empty-products">No products in this order</p>';
    }

    return `
        <table class="products-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th style="width: 100px">Price</th>
                    <th style="width: 100px">Quantity</th>
                    <th style="width: 120px">Total</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>
                            <div class="product-cell">
                                <img class="product-image" 
                                     alt="${product.name}"
                                     onload="this.classList.remove('error')"
                                     src="${product.image || `/Images/instruments/${product.id}.jpg`}">
                                <div class="product-info">
                                    <h4>${product.name}</h4>
                                    ${product.description ? `<p>${product.description}</p>` : ''}
                                </div>
                            </div>
                        </td>
                        <td>${formatCurrency(product.price)}</td>
                        <td>${product.quantity}</td>
                        <td>${formatCurrency(product.price * product.quantity)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generateOrderSummaryHTML(order) {
    return `
        <div class="summary-details">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>${formatCurrency(order.totals?.subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${formatCurrency(order.totals?.shipping)}</span>
            </div>
            <div class="summary-row">
                <span>Tax:</span>
                <span>${formatCurrency(order.totals?.tax)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>${formatCurrency(order.totals?.total)}</span>
            </div>
        </div>
    `;
}

function handleLoadError(error, _, ordersElem) {
    // Clear any stale user data
    localStorage.removeItem('user');
    
    // Reset UI elements
    if (ordersElem) {
        ordersElem.innerHTML = error.message === 'Not logged in' 
            ? displayLoginPrompt()
            : `
                <div class="order-status-card">
                    <p style="text-align: center; color: #e74c3c; padding: 32px;">
                        <i class="fas fa-exclamation-circle"></i> 
                        Error loading orders. Please try again later.
                    </p>
                </div>
            `;
    }

    // Update header to show guest view
    const elements = {
        username: document.getElementById('dropdown-username'),
        email: document.getElementById('dropdown-email'),
        userInfo: document.getElementById('user-info-section'),
        logout: document.getElementById('logout-btn'),
        login: document.getElementById('dropdown-login-form')
    };

    if (elements.username) elements.username.textContent = "Guest";
    if (elements.email) elements.email.textContent = "";
    if (elements.userInfo) elements.userInfo.style.display = '';
    if (elements.logout) elements.logout.style.display = 'none';
    if (elements.login) elements.login.style.display = '';
}

// Always use backend-calculated totals for all order displays
// In all table and modal rendering, use order.totals.subtotal, order.totals.shipping, order.totals.tax, order.totals.total

// Initialize order status page
document.addEventListener('DOMContentLoaded', loadOrderStatus);