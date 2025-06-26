const API = {
    async getProducts() {
        const response = await fetch('/api/products');
        return response.json();
    },

    async createProduct(product) {
        const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        return response.json();
    },

    async processCheckout(orderData) {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error processing checkout:", error);
            throw error;
        }
    },

    async getOrderDetails(orderId) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error fetching order details:", error);
            throw error;
        }
    },    async getUserOrders(customerId) {
        try {
            const response = await fetch(`/api/orders/customer/${customerId}`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
                
                // Handle different error cases
                if (response.status === 401) {
                    throw new Error('Not logged in');
                } else if (response.status === 403) {
                    throw new Error('Unauthorized to view these orders');
                } else if (response.status === 404) {
                    return []; // Return empty array for no orders
                }
                
                throw new Error('Failed to fetch orders: ' + errorText);
            }
            
            const orders = await response.json();
            return Array.isArray(orders) ? orders : [];
            
        } catch (error) {
            console.error("Error fetching user orders:", error);
            if (error.message === 'Not logged in') {
                throw error; // Re-throw auth errors
            }
            return []; // Return empty array for other errors
        }
    },

    async getCurrentUser() {
        try {
            const response = await fetch('/api/users/me', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error('Not logged in');
                }
                if (response.status === 404) {
                    throw new Error('User not found');
                }
                if (response.status === 500) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Server error');
                }
                throw new Error('Failed to fetch current user');
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching current user:", error);
            throw error;
        }
    }
};

// Remove export default API; for browser global usage