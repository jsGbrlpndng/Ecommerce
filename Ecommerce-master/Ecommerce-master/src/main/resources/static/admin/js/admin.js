// Session Management
const SessionManager = {
    checkAuth() {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = '../admin-login.html';
            return null;
        }
        return token;
    },
    logout() {
        localStorage.removeItem('adminToken');
        window.location.href = '../index.html';
    },
    setToken(token) {
        localStorage.setItem('adminToken', token);
    }
};

// Data Management
const DataService = {
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    },
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting data:', error);
            return null;
        }
    },
    removeData(key) {
        localStorage.removeItem(key);
    }
};

// Form Validation
const Validator = {
    required(value) {
        if (typeof value === 'string') {
            return value.trim() ? '' : 'This field is required';
        }
        if (value === undefined || value === null) {
            return 'This field is required';
        }
        return '';
    },
    email(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Invalid email format';
    },
    phone(value) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(value) ? '' : 'Invalid phone number';
    },
    price(value) {
        return !isNaN(value) && value >= 0 ? '' : 'Invalid price';
    },
    stock(value) {
        return Number.isInteger(Number(value)) && value >= 0 ? '' : 'Invalid stock quantity';
    },
    validateForm(formData, rules) {
        const errors = {};
        Object.keys(rules).forEach(field => {
            const value = formData[field];
            const fieldRules = rules[field];
            
            fieldRules.forEach(rule => {
                const error = this[rule](value);
                if (error) {
                    errors[field] = error;
                }
            });
        });
        return errors;
    }
};

// UI Components
const UI = {
    showLoading(element) {
        element.classList.add('loading');
        element.disabled = true;
    },
    hideLoading(element) {
        element.classList.remove('loading');
        element.disabled = false;
    },
    showError(message, container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        container.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    },
    showSuccess(message, container) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        container.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 5000);
    },
    confirmAction(message) {
        return window.confirm(message);
    },
    createPagination(totalItems, itemsPerPage, currentPage, onPageChange) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pagination = document.createElement('div');
        pagination.className = 'pagination';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => onPageChange(currentPage - 1);
        pagination.appendChild(prevBtn);

        // Page numbers
        const pageNumbers = document.createElement('div');
        pageNumbers.className = 'page-numbers';
        
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = `page-number${i === currentPage ? ' active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.onclick = () => onPageChange(i);
            pageNumbers.appendChild(pageNumber);
        }
        pagination.appendChild(pageNumbers);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => onPageChange(currentPage + 1);
        pagination.appendChild(nextBtn);

        return pagination;
    }
};

// Search and Filter
const SearchUtil = {
    searchItems(items, query, fields) {
        const searchTerm = query.toLowerCase();
        return items.filter(item => 
            fields.some(field => 
                String(item[field]).toLowerCase().includes(searchTerm)
            )
        );
    },
    filterItems(items, filters) {
        return items.filter(item => 
            Object.entries(filters).every(([key, value]) => 
                value === 'all' || item[key] === value
            )
        );
    },
    sortItems(items, { field, order = 'asc' }) {
        return [...items].sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];
            
            if (typeof aVal === 'string') {
                return order === 'asc' 
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            
            return order === 'asc' ? aVal - bVal : bVal - aVal;
        });
    }
};

// Input Sanitization
const SecurityUtil = {
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    sanitizeObject(obj) {
        const sanitized = {};
        Object.entries(obj).forEach(([key, value]) => {
            sanitized[key] = typeof value === 'string' 
                ? this.sanitizeInput(value)
                : value;
        });
        return sanitized;
    }
};

// Profile Dropdown Handler
function initializeProfileDropdown() {
    const profileBtn = document.getElementById('adminProfileBtn');
    const profileDropdown = document.getElementById('adminProfileDropdown');
    const logoutBtn = document.getElementById('adminLogoutBtn');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('open');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (UI.confirmAction('Are you sure you want to log out?')) {
                SessionManager.logout();
            }
        });
    }
}

// Initialize Admin Features
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    SessionManager.checkAuth();

    // Initialize profile dropdown
    initializeProfileDropdown();

    // Initialize search functionality if present
    const searchInput = document.getElementById('search-customer') || document.getElementById('search-inventory');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // Implement search logic based on page type
            // This will be customized per page
        });
    }
});

// Remove export statement and attach utilities to window for global access
window.SessionManager = SessionManager;
window.DataService = DataService;
window.Validator = Validator;
window.UI = UI;
window.SecurityUtil = SecurityUtil;
