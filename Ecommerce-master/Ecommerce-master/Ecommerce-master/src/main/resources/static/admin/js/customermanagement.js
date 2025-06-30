// Customer Management JavaScript

document.addEventListener('DOMContentLoaded', async function() {
    try {
        await checkAdminSession();
        await loadCustomers();
        setupEventListeners();
        setupProfileDropdown();
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize the page. Please try logging in again.');
    }
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchCustomer');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(loadCustomers, 300));
    }

    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', loadCustomers);
    }

    // Sort functionality
    const sortSelect = document.getElementById('sort-filter');
    if (sortSelect) {
        sortSelect.addEventListener('change', loadCustomers);
    }

    // Add customer button
    const addCustomerBtn = document.querySelector('.btn-add-customer');
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', function() {
            // Reset form
            const form = document.getElementById('addCustomerForm');
            if (form) form.reset();
            // Show modal
            $('#addCustomerModal').modal('show');
        });
    }

    // Debounce function for search
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

function setupProfileDropdown() {
    const profileBtn = document.getElementById('adminProfileBtn');
    const dropdown = document.getElementById('adminProfileDropdown');
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (profileBtn && dropdown) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const content = dropdown.querySelector('.dropdown-content');
            if (content) {
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
            }
        });
        document.addEventListener('click', function() {
            const content = dropdown.querySelector('.dropdown-content');
            if (content) content.style.display = 'none';
        });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
            window.location.href = '/admin/admin-login.html';
        });
    }
}

async function checkAdminSession() {
    const response = await fetch('/api/admin/check-session', {
        credentials: 'include'
    });
    if (!response.ok) {
        window.location.href = '/admin/admin-login.html';
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.right = '20px';
    errorDiv.style.zIndex = '1000';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

let currentPage = 1;
let customersData = [];
const PAGE_SIZE = 10;

async function loadCustomers(page = 1) {
    try {
        const search = document.getElementById('searchCustomer')?.value || '';
        const status = document.getElementById('status-filter')?.value || 'all';
        const sort = document.getElementById('sort-filter')?.value || 'name_az';
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (sort) params.append('sort', sort);
        // Always fetch all customers for search
        const response = await fetch(`/api/admin/customers?${params.toString()}`, { credentials: 'include' });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to load customers:', response.status, errorText);
            showError(`Could not load customers. (${response.status}) ${errorText}`);
            return;
        }
        customersData = await response.json();
        // Filter in JS for search
        let filtered = customersData;
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = customersData.filter(c =>
                (`${c.firstName} ${c.lastName}`.toLowerCase().includes(searchLower) ||
                 c.email.toLowerCase().includes(searchLower) ||
                 String(c.id).includes(searchLower))
            );
        }
        currentPage = 1;
        displayCustomers(filtered.slice(0, PAGE_SIZE));
        renderPagination(filtered.length);
    } catch (error) {
        console.error('Could not load customers (exception):', error);
        showError('Could not load customers. ' + (error.message || ''));
    }
}

function getPaginatedCustomers() {
    const start = (currentPage - 1) * PAGE_SIZE;
    return customersData.slice(start, start + PAGE_SIZE);
}

function renderPagination(totalCount) {
    const totalPages = Math.ceil((totalCount !== undefined ? totalCount : customersData.length) / PAGE_SIZE) || 1;
    let html = '';
    html += `<button class="pagination-btn" id="prevPageBtn" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="pagination-btn" id="nextPageBtn" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
    let container = document.getElementById('paginationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'paginationContainer';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.margin = '30px 0 10px 0';
        container.style.width = '100%';
        container.style.position = 'relative';
        document.getElementById('customerTableBody').parentElement.appendChild(container);
    }
    container.innerHTML = html;
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.margin = '30px 0 10px 0';
    // Add event listeners
    document.getElementById('prevPageBtn').onclick = () => {
        if (currentPage > 1) changePage(currentPage - 1);
    };
    document.getElementById('nextPageBtn').onclick = () => {
        const totalPages = Math.ceil(customersData.length / PAGE_SIZE) || 1;
        if (currentPage < totalPages) changePage(currentPage + 1);
    };
    container.querySelectorAll('.page-btn').forEach(btn => {
        btn.onclick = (e) => {
            const page = parseInt(e.target.getAttribute('data-page'));
            if (page !== currentPage) changePage(page);
        };
    });
}

function changePage(page) {
    const search = document.getElementById('searchCustomer')?.value || '';
    let filtered = customersData;
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = customersData.filter(c =>
            (`${c.firstName} ${c.lastName}`.toLowerCase().includes(searchLower) ||
             c.email.toLowerCase().includes(searchLower) ||
             String(c.id).includes(searchLower))
        );
    }
    currentPage = page;
    displayCustomers(filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
    renderPagination(filtered.length);
}

function formatDateCreated(dateString) {
    if (!dateString) return '<span style="color:#aaa;">N/A</span>';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '<span style="color:#aaa;">N/A</span>';
    // Format as YYYY-MM-DD
    return date.toLocaleDateString('en-CA');
}

function displayCustomers(customers) {
    const tbody = document.getElementById('customerTableBody');
    if (!tbody) {
        console.error('Customer table body element not found');
        showError('Error displaying customers: Table not found');
        return;
    }
    tbody.innerHTML = '';
    if (!customers || customers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No customers found</td>';
        tbody.appendChild(row);
        renderPagination();
        return;
    }
    customers.forEach(customer => {
        const row = document.createElement('tr');
        // Status toggle button
        const isStatus = customer.status === true || customer.status === 1;
        row.innerHTML = `
            <td>${customer.firstName} ${customer.lastName}</td>
            <td>${customer.email}</td>
            <td>${customer.id}</td>
            <td>
                <button class="status-toggle-btn badge ${isStatus ? 'badge-success' : 'badge-secondary'}" data-id="${customer.id}" data-status="${isStatus}" title="Toggle status">
                    ${isStatus ? 'Active' : 'Inactive'}
                </button>
            </td>
            <td>${formatDateCreated(customer.createdAt)}</td>
            <td><span class="order-count">${customer.orders ?? 0}</span> <button onclick="viewOrders(${customer.id})" class="btn btn-link view-orders-btn">View Orders</button></td>
            <td><div class="btn-group">
                <button onclick="confirmDeleteCustomer(${customer.id})" class="btn btn-sm btn-outline-danger" title="Delete"><i class="fas fa-trash"></i></button>
            </div></td>
        `;
        tbody.appendChild(row);
    });
    // Attach status toggle event listeners
    tbody.querySelectorAll('.status-toggle-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const customerId = this.getAttribute('data-id');
            const currentStatus = this.getAttribute('data-status') === 'true';
            const newStatus = !currentStatus;
            // Optimistically update UI
            this.textContent = newStatus ? 'Active' : 'Inactive';
            this.classList.toggle('badge-success', newStatus);
            this.classList.toggle('badge-secondary', !newStatus);
            this.setAttribute('data-status', newStatus);
            try {
                const response = await fetch(`/api/admin/customers/${customerId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ status: newStatus })
                });
                if (!response.ok) throw new Error('Failed to update status');
            } catch (err) {
                // Revert UI on error
                this.textContent = currentStatus ? 'Active' : 'Inactive';
                this.classList.toggle('badge-success', currentStatus);
                this.classList.toggle('badge-secondary', !currentStatus);
                this.setAttribute('data-status', currentStatus);
                showError('Could not update status. Please try again.');
            }
        });
    });
}

function filterCustomers(searchTerm) {
    const rows = document.querySelectorAll('#customerTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function confirmDeleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        deleteCustomer(id);
    }
}

async function deleteCustomer(id) {
    try {
        const response = await fetch(`/api/admin/customers/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            // Try to get backend error message
            let errorText = 'Failed to delete customer';
            try {
                errorText = await response.text();
            } catch (e) {}
            // Show specific warning if undelivered orders
            if (errorText && errorText.toLowerCase().includes('undelivered')) {
                showNotification(errorText, 'warning');
            } else {
                showNotification(errorText, 'error');
            }
            throw new Error(errorText);
        }

        loadCustomers();
        showNotification('Customer deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting customer:', error);
        // showNotification already called above
    }
}

async function viewOrders(customerId) {
    try {
        const response = await fetch(`/api/admin/customers/${customerId}/orders`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch customer orders');
        }

        const orders = await response.json();
        displayOrders(orders);
        $('#customerOrdersModal').modal('show');
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        showNotification('Error fetching customer orders', 'error');
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = '';

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No orders found.</td></tr>';
        return;
    }

    orders.forEach(order => {
        const total = (typeof order.total === 'number') ? order.total : (order.totals?.total ?? 0);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            <td>${formatCurrency(total)}</td>
            <td>
                <select class="order-status-dropdown" data-order-id="${order.orderId}">
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipping" ${order.status === 'Shipping' ? 'selected' : ''}>Shipping</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                </select>
            </td>
            <td id="order-status-msg-${order.orderId}"></td>
        `;
        row.classList.add('admin-order-row');
        row.style.cursor = 'pointer';
        row.addEventListener('click', async function(e) {
            // Prevent status dropdown click from triggering row click
            if (e.target.classList.contains('order-status-dropdown')) return;
            try {
                const response = await fetch(`/api/admin/orders/${order.orderId}`, { credentials: 'include' });
                if (!response.ok) throw new Error('Failed to fetch order details');
                const orderDetails = await response.json();
                showAdminOrderDetailsModal(orderDetails);
            } catch (err) {
                showNotification('Could not load order details', 'error');
            }
        });
        tbody.appendChild(row);
    });

    // Add event listeners for status dropdowns
    const dropdowns = tbody.querySelectorAll('.order-status-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', async function(e) {
            const orderId = e.target.getAttribute('data-order-id');
            const newStatus = e.target.value;
            e.target.disabled = true;
            const msgCell = document.getElementById(`order-status-msg-${orderId}`);
            msgCell.textContent = 'Updating...';
            try {
                const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ status: newStatus })
                });
                if (!response.ok) {
                    throw new Error('Failed to update order status');
                }
                msgCell.textContent = 'Updated!';
                showNotification('Order status updated', 'success');
            } catch (error) {
                msgCell.textContent = 'Error!';
                showNotification('Error updating order status', 'error');
                // Optionally revert dropdown to previous value
            } finally {
                setTimeout(() => { msgCell.textContent = ''; e.target.disabled = false; }, 1200);
            }
        });
    });
}

// Admin order details modal rendering
function showAdminOrderDetailsModal(order) {
    const modalBody = document.getElementById('adminOrderDetailsBody');
    if (!modalBody) return;
    modalBody.innerHTML = generateAdminOrderCardHTML(order);
    $('#adminOrderDetailsModal').modal('show');
}

function generateAdminOrderCardHTML(order) {
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

// Helper functions for admin modal (copied from user side or adapted)
function getStatusBadgeClass(status) {
    switch ((status || '').toLowerCase()) {
        case 'completed': return 'badge-success';
        case 'pending': return 'badge-warning';
        case 'cancelled': return 'badge-danger';
        case 'processing': return 'badge-info';
        default: return 'badge-secondary';
    }
}
function getStatusIcon(status) {
    switch ((status || '').toLowerCase()) {
        case 'completed': return 'fa-check-circle';
        case 'pending': return 'fa-hourglass-half';
        case 'cancelled': return 'fa-times-circle';
        case 'processing': return 'fa-sync-alt';
        default: return 'fa-question-circle';
    }
}
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
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
                                </div>
                            </div>
                        </td>
                        <td>₱${product.price}</td>
                        <td>${product.quantity}</td>
                        <td>₱${(product.price * product.quantity).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
function generateOrderSummaryHTML(order) {
    // Always use backend-calculated values for subtotal, shipping, tax, and total. Never recalculate on the frontend.
    const subtotal = Number(order.totals && order.totals.subtotal) || 0;
    const shipping = Number(order.totals && order.totals.shipping) || 0;
    const tax = Number(order.totals && order.totals.tax) || 0;
    const total = Number(order.totals && order.totals.total) || 0;
    return `
        <div class="order-summary">
            <div><span>Subtotal:</span> <span>${formatCurrency(subtotal)}</span></div>
            <div><span>Shipping:</span> <span>${formatCurrency(shipping)}</span></div>
            <div><span>Tax:</span> <span>${formatCurrency(tax)}</span></div>
            <div class="order-summary-total"><span>Total:</span> <span>${formatCurrency(total)}</span></div>
        </div>
    `;
}
function validateProductData(product) {
    if (!product || !product.name) return null;
    return product;
}
function showNotification(message, type) {
    // Assuming you have a notification system
    if (typeof showToast === 'function') {
        showToast(message, type);
    } else {
        alert(message);
    }
}

// Currency formatting for PHP Peso, matching customer view
function formatCurrency(amount) {
    if (!amount && amount !== 0) return '₱0.00';
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Always use backend-calculated totals for display
function renderOrderTotals(order) {
    const subtotal = order.totals?.subtotal ?? 0;
    const shipping = order.totals?.shipping ?? 0;
    const tax = order.totals?.tax ?? 0;
    const total = order.totals?.total ?? 0;
    document.querySelector('.subtotal').textContent = formatCurrency(subtotal);
    document.querySelector('.shipping').textContent = formatCurrency(shipping);
    document.querySelector('.tax').textContent = formatCurrency(tax);
    document.querySelector('.total').textContent = formatCurrency(total);
}
