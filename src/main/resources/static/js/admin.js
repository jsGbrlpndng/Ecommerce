document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    setupAdminEventListeners();
    
    // Initialize charts (if needed)
    initializeCharts();
});

// Set up admin event listeners
function setupAdminEventListeners() {
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.select-item');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Individual checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('select-item')) {
            updateSelectAllCheckbox();
        }
    });
    
    // Chart period buttons
    const chartButtons = document.querySelectorAll('.chart-actions button');
    chartButtons.forEach(button => {
        button.addEventListener('click', function() {
            chartButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart data based on selected period
            // This would be implemented with actual chart library
        });
    });
    
    // Date range filter
    const dateRangeSelect = document.getElementById('date-range');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            // Update dashboard data based on selected date range
            // This would be implemented with actual data
        });
    }
    
    // Inventory filters
    const categoryFilter = document.getElementById('category-filter');
    const stockFilter = document.getElementById('stock-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterInventory();
        });
    }
    
    if (stockFilter) {
        stockFilter.addEventListener('change', function() {
            filterInventory();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            filterInventory();
        });
    }
    
    // Action buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn')) {
            const button = e.target.closest('.action-btn');
            const action = button.querySelector('i').className;
            const row = button.closest('tr');
            
            if (action.includes('fa-eye')) {
                // View item
                viewItem(row);
            } else if (action.includes('fa-edit')) {
                // Edit item
                editItem(row);
            } else if (action.includes('fa-trash')) {
                // Delete item
                deleteItem(row);
            }
        }
    });
}

// Update select all checkbox
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('.select-item');
    
    if (selectAllCheckbox && checkboxes.length > 0) {
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        const someChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        
        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = someChecked && !allChecked;
    }
}

// Filter inventory
function filterInventory() {
    // This would be implemented with actual data and filtering logic
    console.log('Filtering inventory...');
}

// View item
function viewItem(row) {
    // This would open a modal or navigate to a detail page
    const itemName = row.querySelector('td:nth-child(3)').textContent;
    alert(`Viewing details for ${itemName}`);
}

// Edit item
function editItem(row) {
    // This would open a modal or navigate to an edit page
    const itemName = row.querySelector('td:nth-child(3)').textContent;
    alert(`Editing ${itemName}`);
}

// Delete item
function deleteItem(row) {
    // This would show a confirmation dialog and then delete the item
    const itemName = row.querySelector('td:nth-child(3)').textContent;
    if (confirm(`Are you sure you want to delete ${itemName}?`)) {
        // Delete the item
        row.remove();
        alert(`${itemName} has been deleted.`);
    }
}

// Initialize charts
function initializeCharts() {
    // This would be implemented with a chart library like Chart.js
    console.log('Initializing charts...');
}
