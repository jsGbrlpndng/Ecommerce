// --- Admin Session Check (Backend) ---
async function checkAdminSession() {
    try {
        const response = await fetch('/api/admin/check-session', { credentials: 'include' });
        if (!response.ok) {
            window.location.href = '/admin/admin-login.html';
        }
    } catch (e) {
        window.location.href = '/admin/admin-login.html';
    }
}

// Run session check before anything else
document.addEventListener('DOMContentLoaded', async function() {
    await checkAdminSession();
    SessionManager.checkAuth();
    loadProducts();
});
// inventory.js - Admin Inventory Management
// Handles fetching, adding, editing, and monitoring products for the admin panel

const API_BASE = '/api/products';

// --- CSRF Protection ---
function getCsrfHeaders() {
    const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
    const header = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
    if (token && header) {
        return { [header]: token };
    }
    // If missing, return an empty object
    return {};
}

// --- DOM Elements for Table and Modals ---
const productTableBody = document.querySelector('.inventory-table tbody');
const addProductBtn = document.querySelector('.btn.btn-primary');
const addProductModal = document.getElementById('add-product-modal');
const addProductForm = document.getElementById('add-product-form');
const editProductModal = document.getElementById('edit-product-modal');
const editProductForm = document.getElementById('edit-product-form');

// --- Render Product Table ---
function renderProductTable(products) {
    productTableBody.innerHTML = '';
    if (!products.length) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="10" style="text-align:center;color:#aaa;">No products found.</td>`;
        productTableBody.appendChild(tr);
        return;
    }
    products.forEach(product => {
        const status = product.stock === 0 ? 'out-of-stock' : (product.stock < 5 ? 'low-stock' : 'in-stock');
        const statusLabel = status === 'out-of-stock' ? 'Out of Stock' : (status === 'low-stock' ? 'Low Stock' : 'In Stock');
        let imageUrl = product.image && product.image.trim() ? SecurityUtil.sanitizeInput(product.image) : '/admin/img/placeholder.png';
        // If it starts with 'Images/', add leading slash
        if (imageUrl && imageUrl.startsWith('Images/')) {
            imageUrl = '/' + imageUrl;
        }
        // If it doesn't start with '/', 'Images/', or 'http', prepend '/Images/instruments/'
        if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('Images/') && !imageUrl.startsWith('http')) {
            imageUrl = '/Images/instruments/' + imageUrl.replace(/^\/+/, '');
        }
        const tr = document.createElement('tr');
        tr.setAttribute('role', 'row');
        tr.innerHTML = `
            <td><img src="${imageUrl}" class="product-thumbnail" alt="Product Image for ${SecurityUtil.sanitizeInput(product.name)}"></td>
            <td>${SecurityUtil.sanitizeInput(product.name)}</td>
            <td>${SecurityUtil.sanitizeInput(product.sku)}</td>
            <td>${SecurityUtil.sanitizeInput(product.category)}</td>
            <td>${SecurityUtil.sanitizeInput(product.description || '')}</td>
            <td>₱${SecurityUtil.sanitizeInput(product.price)}</td>
            <td>${SecurityUtil.sanitizeInput(product.stock)}</td>
            <td><span class="status-badge ${status}" aria-label="${statusLabel}">${statusLabel}</span></td>
            <td>${formatDateCreated(product.createdAt)}</td>
            <td class="table-actions">
                <button class="action-btn edit-btn" data-id="${product.id}" aria-label="Edit product ${SecurityUtil.sanitizeInput(product.name)}"><i class="fas fa-edit" aria-hidden="true"></i></button>
                <button class="action-btn delete-btn" data-id="${product.id}" style="color:#e53935;" aria-label="Delete product ${SecurityUtil.sanitizeInput(product.name)}"><i class="fas fa-trash-alt" aria-hidden="true"></i></button>
            </td>
        `;
        productTableBody.appendChild(tr);
    });
    // Attach edit handlers
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });
    // Attach delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteProduct(btn.dataset.id));
    });
}

// --- Filtering and Sorting Logic ---
const categoryFilter = document.getElementById('category-filter') || document.querySelector('select[name="category"]');
const stockFilter = document.getElementById('stock-filter') || document.querySelector('select[name="stock-status"]');
const sortFilter = document.getElementById('sort-filter') || document.querySelector('select[name="sort"]');
const searchInput = document.getElementById('search-input') || document.querySelector('input[type="search"], input[name="search"]');

let allProducts = [];
let currentPage = 1;
const PAGE_SIZE = 9;

function renderPagination(totalCount) {
    const pagination = document.querySelector('.pagination');
    const pageNumbers = pagination.querySelector('.page-numbers');
    const prevBtn = pagination.querySelectorAll('.pagination-btn')[0];
    const nextBtn = pagination.querySelectorAll('.pagination-btn')[1];
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const span = document.createElement('span');
        span.className = 'page-number' + (i === currentPage ? ' active' : '');
        span.textContent = i;
        span.onclick = () => {
            if (currentPage !== i) {
                currentPage = i;
                applyFilters();
            }
        };
        pageNumbers.appendChild(span);
    }
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            applyFilters();
        }
    };
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            applyFilters();
        }
    };
}

function applyFilters() {
    let filtered = [...allProducts];
    // Category filter
    if (categoryFilter && categoryFilter.value && categoryFilter.value.toLowerCase() !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter.value);
    }
    // Stock status filter (case-insensitive, matches HTML values)
    if (stockFilter && stockFilter.value && stockFilter.value.toLowerCase() !== 'all') {
        const val = stockFilter.value.toLowerCase();
        if (val === 'in-stock') filtered = filtered.filter(p => p.stock > 0);
        if (val === 'low-stock') filtered = filtered.filter(p => p.stock > 0 && p.stock < 5);
        if (val === 'out-of-stock') filtered = filtered.filter(p => p.stock === 0);
    }
    // Search
    if (searchInput && searchInput.value.trim()) {
        const q = searchInput.value.trim().toLowerCase();
        filtered = filtered.filter(p =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.sku && p.sku.toLowerCase().includes(q))
        );
    }
    // Sort
    if (sortFilter && sortFilter.value) {
        switch (sortFilter.value) {
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'stock-low':
                filtered.sort((a, b) => a.stock - b.stock);
                break;
            case 'stock-high':
                filtered.sort((a, b) => b.stock - a.stock);
                break;
        }
    }
    // Pagination logic
    const totalCount = filtered.length;
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    renderProductTable(filtered.slice(start, end));
    renderPagination(totalCount);
}

// --- UI/UX Improvements: Loading, Error, and Success States ---
function showTableLoading() {
    productTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#8f5cf7;font-weight:600;">
        <span class="loading-spinner" style="display:inline-block;width:28px;height:28px;border:4px solid #e0e0ff;border-top:4px solid #8f5cf7;border-radius:50%;animation:spin 1s linear infinite;vertical-align:middle;"></span>
        Loading products...
    </td></tr>`;
}

function showTableError(msg) {
    productTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#e53935;font-weight:600;">${msg}</td></tr>`;
}

// --- Load Products on Page Load (with filter support) ---
async function loadProducts() {
    showTableLoading();
    try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Network error');
        allProducts = await res.json();
        console.log('Fetched products for inventory:', allProducts); // DEBUG LOG
        if (!Array.isArray(allProducts) || allProducts.length === 0) {
            console.warn('No products fetched or data is not an array.');
        }
        applyFilters();
    } catch (err) {
        showTableError('Failed to load products.');
        UI.showError('Failed to load products.', document.body);
        console.error('Error fetching products:', err);
    }
}

// --- Add Product Modal Logic ---
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        if (addProductModal) addProductModal.style.display = 'block';
    });
}

// --- Add Product Form Submission ---
if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addProductForm);
        formData.delete('image');
        const product = Object.fromEntries(formData.entries());
        const errors = Validator.validateForm(product, {
            name: ['required'],
            sku: ['required'],
            category: ['required'],
            price: ['required', 'price'],
            stock: ['required', 'stock'],
            description: []
        });
        if (Object.keys(errors).length) {
            UI.showError(Object.values(errors).join('<br>'), addProductForm);
            return;
        }
        try {
            UI.showLoading(addProductForm.querySelector('button[type="submit"]'));
            const response = await fetch(API_BASE, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to add product');
            if (addProductModal) addProductModal.style.display = 'none';
            addProductForm.reset();
            await loadProducts();
            UI.showSuccess('Product added successfully!', document.body);
        } catch (err) {
            UI.showError('Failed to add product.', addProductForm);
        } finally {
            UI.hideLoading(addProductForm.querySelector('button[type="submit"]'));
        }
    });
}

// --- Edit Product Modal Logic ---
async function openEditModal(productId) {
    try {
        const res = await fetch(`${API_BASE}/${productId}`);
        const product = await res.json();
        Object.keys(product).forEach(key => {
            if (editProductForm && editProductForm.elements[key]) {
                editProductForm.elements[key].value = product[key];
            }
        });
        // Ensure the hidden input for product ID is set
        if (editProductForm && editProductForm.elements['id']) {
            editProductForm.elements['id'].value = product.id;
            document.getElementById('edit-product-id').value = product.id;
        }
        // Set description if present
        if (editProductForm && editProductForm.elements['description']) {
            editProductForm.elements['description'].value = product.description || '';
        }
        // Set category dropdown
        if (editProductForm && editProductForm.elements['category']) {
            editProductForm.elements['category'].value = product.category || '';
        }
        if (editProductModal) editProductModal.style.display = 'block';
    } catch (err) {
        UI.showError('Failed to load product details.', document.body);
    }
}

// --- Edit Product Form Submission ---
if (editProductForm) {
    editProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Debug: log hidden input value before extracting form data
        console.log('Hidden input edit-product-id value:', document.getElementById('edit-product-id').value);
        const formData = new FormData(editProductForm);
        const product = Object.fromEntries(formData.entries());
        // Debug: log product object after extraction
        console.log('Product object from form:', product);
        // Convert numeric fields to proper types
        product.id = parseInt(product.id, 10);
        product.price = parseFloat(product.price);
        product.stock = parseInt(product.stock, 10);
        // Debug: log product.id after conversion
        console.log('Parsed product.id:', product.id);
        // Debug: log product.id and fallback if missing
        if (!product.id || isNaN(product.id)) {
            // Try to get from modal (in case form is missing hidden input)
            const modalId = document.getElementById('edit-product-id')?.value;
            if (modalId && !isNaN(parseInt(modalId, 10))) {
                product.id = parseInt(modalId, 10);
            }
        }
        console.log('Edit Product Debug - product.id:', product.id);
        if (!product.id || isNaN(product.id)) {
            UI.showError('Invalid or missing product ID. Please check the form and try again.', editProductForm);
            return;
        }

        const errors = Validator.validateForm(product, {
            name: ['required'],
            sku: ['required'],
            category: ['required'],
            price: ['required', 'price'],
            stock: ['required', 'stock']
        });

        if (Object.keys(errors).length) {
            UI.showError(Object.values(errors).join('<br>'), editProductForm);
            return;
        }

        try {
            const saveBtn = editProductForm.querySelector('button[type="submit"]');
            if (saveBtn) {
                saveBtn.disabled = true;
                UI.showLoading(saveBtn);
            }

            // Remove any _method field to prevent backend from interpreting as PUT
            if (editProductForm.querySelector('input[name="_method"]')) {
                editProductForm.querySelector('input[name="_method"]').remove();
            }
            // Use FormData for POST (edit) as well
            const formData = new FormData(editProductForm);
            formData.delete('image');
            // Send as multipart/form-data, do not set Content-Type
            const response = await fetch(`${API_BASE}/${product.id}/update`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Update error:', response.status, errorData);
                throw new Error('Failed to update product');
            }

            if (editProductModal) editProductModal.style.display = 'none';
            await loadProducts();
            UI.showSuccess('Product updated successfully!', document.body);
        } catch (err) {
            console.error('Update error:', err);
            UI.showError(err.message || 'Failed to update product.', editProductForm);
        } finally {
            const saveBtn = editProductForm.querySelector('button[type="submit"]');
            if (saveBtn) {
                saveBtn.disabled = false;
                UI.hideLoading(saveBtn);
            }
        }
    });
}

// --- Delete Product (Single) ---
async function handleDeleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
        const response = await fetch(`${API_BASE}/${productId}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete error:', response.status, errorText);
            throw new Error('Failed to delete product.');
        }
        loadProducts();
        UI.showSuccess('Product deleted successfully.', document.body);
    } catch (err) {
        UI.showError('Failed to delete product.', document.body);
    }
}

// --- Import/Export Functionality ---
// (Removed import/export functionality as per requirements)

// --- Attach filter/sort/search events ---
if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
if (stockFilter) stockFilter.addEventListener('change', applyFilters);
if (sortFilter) sortFilter.addEventListener('change', applyFilters);
if (searchInput) searchInput.addEventListener('input', applyFilters);

// --- Modal Close Logic (Optional) ---
window.addEventListener('click', (e) => {
    if (addProductModal && e.target === addProductModal) addProductModal.style.display = 'none';
    if (editProductModal && e.target === editProductModal) editProductModal.style.display = 'none';
});

// --- Initial Load now handled in DOMContentLoaded above ---

// --- Add global spinner animation ---
const style = document.createElement('style');
style.innerHTML = `@keyframes spin { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }`;
document.head.appendChild(style);

// --- Accessibility and Code Cleanup Enhancements ---
// 1. Add ARIA labels and roles to table and buttons for accessibility
function renderProductTable(products) {
    productTableBody.innerHTML = '';
    if (!products.length) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="10" style="text-align:center;color:#aaa;">No products found.</td>`;
        productTableBody.appendChild(tr);
        return;
    }
    products.forEach(product => {
        const status = product.stock === 0 ? 'out-of-stock' : (product.stock < 5 ? 'low-stock' : 'in-stock');
        const statusLabel = status === 'out-of-stock' ? 'Out of Stock' : (status === 'low-stock' ? 'Low Stock' : 'In Stock');
        let imageUrl = product.image && product.image.trim() ? SecurityUtil.sanitizeInput(product.image) : '/admin/img/placeholder.png';
        // If it starts with 'Images/', add leading slash
        if (imageUrl && imageUrl.startsWith('Images/')) {
            imageUrl = '/' + imageUrl;
        }
        // If it doesn't start with '/', 'Images/', or 'http', prepend '/Images/instruments/'
        if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('Images/') && !imageUrl.startsWith('http')) {
            imageUrl = '/Images/instruments/' + imageUrl.replace(/^\/+/, '');
        }
        const tr = document.createElement('tr');
        tr.setAttribute('role', 'row');
        tr.innerHTML = `
            <td><img src="${imageUrl}" class="product-thumbnail" alt="Product Image for ${SecurityUtil.sanitizeInput(product.name)}"></td>
            <td>${SecurityUtil.sanitizeInput(product.name)}</td>
            <td>${SecurityUtil.sanitizeInput(product.sku)}</td>
            <td>${SecurityUtil.sanitizeInput(product.category)}</td>
            <td>${SecurityUtil.sanitizeInput(product.description || '')}</td>
            <td>₱${SecurityUtil.sanitizeInput(product.price)}</td>
            <td>${SecurityUtil.sanitizeInput(product.stock)}</td>
            <td><span class="status-badge ${status}" aria-label="${statusLabel}">${statusLabel}</span></td>
            <td>${formatDateCreated(product.createdAt)}</td>
            <td class="table-actions">
                <button class="action-btn edit-btn" data-id="${product.id}" aria-label="Edit product ${SecurityUtil.sanitizeInput(product.name)}"><i class="fas fa-edit" aria-hidden="true"></i></button>
                <button class="action-btn delete-btn" data-id="${product.id}" style="color:#e53935;" aria-label="Delete product ${SecurityUtil.sanitizeInput(product.name)}"><i class="fas fa-trash-alt" aria-hidden="true"></i></button>
            </td>
        `;
        productTableBody.appendChild(tr);
    });
    // Attach edit handlers
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });
    // Attach delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteProduct(btn.dataset.id));
    });
}

// 2. Add ARIA roles to table (run once on page load)
const inventoryTable = document.querySelector('.inventory-table');
if (inventoryTable) {
    inventoryTable.setAttribute('role', 'table');
    const thead = inventoryTable.querySelector('thead');
    if (thead) thead.setAttribute('role', 'rowgroup');
    const tbody = inventoryTable.querySelector('tbody');
    if (tbody) tbody.setAttribute('role', 'rowgroup');
    const ths = inventoryTable.querySelectorAll('th');
    ths.forEach(th => th.setAttribute('role', 'columnheader'));
}

// 3. Ensure all buttons are keyboard accessible (already true for <button> elements)
// 4. Add focus style for action buttons
const focusStyle = document.createElement('style');
focusStyle.innerHTML = `.action-btn:focus { outline: 2px solid #8f5cf7; outline-offset: 2px; }`;
document.head.appendChild(focusStyle);

// --- CSRF Token Helper ---
function getCsrfHeaders() {
    const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
    const header = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
    if (token && header) {
        return { [header]: token };
    }
    // If missing, return an empty object
    return {};
}

// --- Image Path Handling ---
function normalizeImagePath(imagePath) {
    if (!imagePath) return '';
    
    // Remove leading slashes and normalize path
    imagePath = imagePath.replace(/^\/+/, '');
    
    // If path already starts with 'Images/', return as is
    if (imagePath.startsWith('Images/')) {
        return imagePath;
    }
    
    // If path starts with 'instruments/', prepend 'Images/'
    if (imagePath.startsWith('instruments/')) {
        return `Images/${imagePath}`;
    }
    
    // If path doesn't include 'Images/instruments/', add it
    if (!imagePath.includes('Images/instruments/')) {
        return `Images/instruments/${imagePath}`;
    }
    
    return imagePath;
}

function getDisplayImageUrl(imagePath) {
    if (!imagePath) return '/Images/instruments/placeholder.png';
    return '/' + normalizeImagePath(imagePath);
}

// Helper function to format date
function formatDateCreated(dateString) {
    if (!dateString) return '<span style="color:#aaa;">N/A</span>';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '<span style="color:#aaa;">N/A</span>';
    // Format as YYYY-MM-DD
    return date.toLocaleDateString('en-CA');
}

// --- Polling for Real-Time Inventory Updates ---
// --- Polling removed: Products now only reload on page refresh or after add/edit/delete ---
