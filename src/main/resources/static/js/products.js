// Product data (in a real application, this would come from an API)
const products = [
    {
        id: 1,
        name: 'Classic Acoustic Guitar',
        category: 'string',
        price: 299.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'A beautiful acoustic guitar with rich, warm tones. Perfect for beginners and intermediate players.',
        features: [
            'Solid spruce top',
            'Mahogany back and sides',
            'Rosewood fingerboard',
            'Die-cast tuners',
            '20 frets'
        ],
        inStock: true,
        rating: 4.5,
        reviews: 128
    },
    {
        id: 2,
        name: 'Professional Electric Guitar',
        category: 'string',
        price: 799.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'High-quality electric guitar with versatile sound options. Ideal for professional musicians.',
        features: [
            'Alder body',
            'Maple neck',
            'Rosewood fingerboard',
            'Premium pickups',
            '22 frets'
        ],
        inStock: true,
        rating: 4.8,
        reviews: 95
    },
    {
        id: 3,
        name: 'Concert Grand Piano',
        category: 'keyboard',
        price: 4999.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'Stunning concert grand piano with exceptional sound quality and touch response.',
        features: [
            'Full 88-key keyboard',
            'Spruce soundboard',
            'Premium hammer action',
            'Ebony and ivory keys',
            'Includes bench'
        ],
        inStock: false,
        rating: 5.0,
        reviews: 42
    },
    {
        id: 4,
        name: 'Professional Drum Set',
        category: 'percussion',
        price: 899.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'Complete professional drum set with premium cymbals and hardware.',
        features: [
            '5-piece shell pack',
            'Maple shells',
            'Premium cymbals included',
            'Double-braced hardware',
            'Adjustable throne'
        ],
        inStock: true,
        rating: 4.7,
        reviews: 63
    },
    {
        id: 5,
        name: 'Alto Saxophone',
        category: 'wind',
        price: 649.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'Professional alto saxophone with rich tone and excellent intonation.',
        features: [
            'Brass construction',
            'Gold lacquer finish',
            'High F# key',
            'Adjustable thumb rest',
            'Includes case and mouthpiece'
        ],
        inStock: true,
        rating: 4.6,
        reviews: 37
    },
    {
        id: 6,
        name: 'Digital Keyboard Workstation',
        category: 'electronic',
        price: 1299.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'Advanced digital keyboard with hundreds of sounds, rhythms, and recording capabilities.',
        features: [
            '88 weighted keys',
            '1000+ instrument sounds',
            'Built-in sequencer',
            'USB and MIDI connectivity',
            'LCD display'
        ],
        inStock: true,
        rating: 4.9,
        reviews: 84
    },
    {
        id: 7,
        name: 'Acoustic Violin',
        category: 'string',
        price: 249.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'Beautifully crafted violin with warm, rich tone. Perfect for students and intermediate players.',
        features: [
            'Spruce top',
            'Maple back and sides',
            'Ebony fingerboard',
            'Fine tuners',
            'Includes bow and case'
        ],
        inStock: true,
        rating: 4.3,
        reviews: 52
    },
    {
        id: 8,
        name: 'Electric Bass Guitar',
        category: 'string',
        price: 449.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'Versatile 4-string bass guitar with powerful sound and comfortable playability.',
        features: [
            'Alder body',
            'Maple neck',
            'Rosewood fingerboard',
            'Premium pickups',
            '20 frets'
        ],
        inStock: true,
        rating: 4.6,
        reviews: 41
    },
    {
        id: 9,
        name: 'Professional Trumpet',
        category: 'wind',
        price: 599.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'Professional Bb trumpet with excellent projection and intonation.',
        features: [
            'Brass construction',
            'Gold lacquer finish',
            'Monel valves',
            'Adjustable slide',
            'Includes case and mouthpiece'
        ],
        inStock: true,
        rating: 4.7,
        reviews: 29
    },
    {
        id: 10,
        name: 'Acoustic-Electric Guitar',
        category: 'string',
        price: 399.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'Versatile acoustic-electric guitar with built-in pickup and preamp.',
        features: [
            'Solid spruce top',
            'Mahogany back and sides',
            'Built-in pickup system',
            '3-band EQ',
            'Cutaway design'
        ],
        inStock: true,
        rating: 4.5,
        reviews: 76
    },
    {
        id: 11,
        name: 'Digital Audio Workstation',
        category: 'electronic',
        price: 599.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'Complete digital audio workstation with controllers, software, and interfaces.',
        features: [
            'MIDI controller',
            'Audio interface',
            'Studio monitors',
            'Professional software included',
            'USB connectivity'
        ],
        inStock: false,
        rating: 4.8,
        reviews: 58
    },
    {
        id: 12,
        name: 'Premium Guitar Strings Set',
        category: 'accessories',
        price: 12.99,
        image: '/placeholder.svg?height=300&width=300',
        description: 'High-quality guitar strings for acoustic guitars. Bright tone with excellent durability.',
        features: [
            'Phosphor bronze',
            'Light gauge',
            'Anti-rust coating',
            'Enhanced projection',
            'Long-lasting tone'
        ],
        inStock: true,
        rating: 4.4,
        reviews: 215
    }
];

// Get product by ID
function getProductById(productId) {
    return products.find(product => product.id === parseInt(productId));
}

// Get products by category
function getProductsByCategory(categoryId) {
    if (!categoryId || categoryId === 'all') {
        return products;
    }
    return products.filter(product => product.category === categoryId);
}

// Get featured products (for homepage)
function getFeaturedProducts(limit = 4) {
    // In a real app, you might have a "featured" flag
    // Here we'll just return the first few products
    return products.slice(0, limit);
}

// Get new arrivals (for homepage)
function getNewArrivals(limit = 4) {
    // In a real app, you might sort by date
    // Here we'll just return some products
    return products.slice(4, 4 + limit);
}

// Get best sellers (for homepage)
function getBestSellers(limit = 4) {
    // In a real app, you might sort by sales count
    // Here we'll sort by rating and return
    return [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Search products
function searchProducts(query) {
    query = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
    );
}

// Sort products
function sortProducts(productList, sortBy) {
    const sortedProducts = [...productList];
    
    switch (sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Default sort (featured)
            break;
    }
    
    return sortedProducts;
}

// Filter products by price range
function filterProductsByPrice(productList, minPrice, maxPrice) {
    return productList.filter(product => 
        product.price >= minPrice && 
        (maxPrice === null || product.price <= maxPrice)
    );
}

// Filter products by availability
function filterProductsByAvailability(productList, inStockOnly) {
    if (!inStockOnly) return productList;
    return productList.filter(product => product.inStock);
}
