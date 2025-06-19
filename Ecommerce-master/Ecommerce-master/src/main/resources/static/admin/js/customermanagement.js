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

    // Edit customer form submission
    const editForm = document.getElementById('editCustomerForm');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const customerId = document.getElementById('editCustomerId').value;
            try {
                await updateCustomer(customerId);
            } catch (error) {
                console.error('Update error:', error);
                showError('Error updating customer');
            }
        });
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

async function loadCustomers() {
    try {
        const search = document.getElementById('searchCustomer')?.value || '';
        const status = document.getElementById('status-filter')?.value || 'all';
        const sort = document.getElementById('sort-filter')?.value || 'name_az';
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (sort) params.append('sort', sort);
        const response = await fetch(`/api/admin/customers?${params.toString()}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to load customers');
        const customers = await response.json();
        displayCustomers(customers);
    } catch (error) {
        showError('Could not load customers.');
    }
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
        return;
    }

    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="customer-select" value="${customer.id}">
            </td>
            <td>${customer.firstName} ${customer.lastName}</td>
            <td>${customer.email}</td>
            <td>${customer.id}</td>
            <td>
                <span class="badge ${customer.status === 'Active' ? 'badge-success' : 'badge-secondary'}">
                    ${customer.status || 'Active'}
                </span>
            </td>
            <td>
                <button onclick="viewOrders(${customer.id})" class="btn btn-link">
                    View Orders
                </button>
            </td>
            <td>
                <div class="btn-group">
                    <button onclick="editCustomer(${customer.id})" class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="confirmDeleteCustomer(${customer.id})" class="btn btn-sm btn-outline-danger">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterCustomers(searchTerm) {
    const rows = document.querySelectorAll('#customerTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

async function editCustomer(id) {
    try {
        const response = await fetch(`/api/admin/customers/${id}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch customer details');
        }

        const customer = await response.json();
        populateEditForm(customer);
        $('#editCustomerModal').modal('show');
    } catch (error) {
        console.error('Error fetching customer details:', error);
        showNotification('Error fetching customer details', 'error');
    }
}

function populateEditForm(customer) {
    document.getElementById('editCustomerId').value = customer.id;
    document.getElementById('editFirstName').value = customer.firstName;
    document.getElementById('editLastName').value = customer.lastName;
    document.getElementById('editEmail').value = customer.email;
    document.getElementById('editPhone').value = customer.phone || '';
}

async function updateCustomer(id) {
    const customerData = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value
    };

    try {
        const response = await fetch(`/api/admin/customers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(customerData)
        });

        if (!response.ok) {
            throw new Error('Failed to update customer');
        }

        $('#editCustomerModal').modal('hide');
        loadCustomers();
        showNotification('Customer updated successfully', 'success');
    } catch (error) {
        console.error('Error updating customer:', error);
        showNotification('Error updating customer', 'error');
    }
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
            throw new Error('Failed to delete customer');
        }

        loadCustomers();
        showNotification('Customer deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting customer:', error);
        showNotification('Error deleting customer', 'error');
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
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No orders found</td></tr>';
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>
                <select class="order-status-dropdown" data-order-id="${order.orderId}">
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipping" ${order.status === 'Shipping' ? 'selected' : ''}>Shipping</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                </select>
            </td>
            <td id="order-status-msg-${order.orderId}"></td>
        `;
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

function showNotification(message, type) {
    // Assuming you have a notification system
    if (typeof showToast === 'function') {
        showToast(message, type);
    } else {
        alert(message);
    }
}
