document.addEventListener("DOMContentLoaded", () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
  
    if (productId) {
        // Load product details
        loadProductDetails(productId);
    } else {
        // Redirect to shop page if no product ID
        window.location.href = "shop.html";
    }
});

// Detailed description mapping for products
const productDetailedDescriptions = {
    "2007 Gibson Explorer": `The 2007 Gibson Explorer is a true icon for rock and metal enthusiasts, boasting a bold, angular body and a sound that’s as powerful as its presence. With its legendary tonewoods and high-output pickups, this guitar is built for players who want to make a statement on stage and in the studio. Whether you’re shredding solos or laying down heavy rhythms, the Explorer’s unique design and uncompromising performance will inspire you to push musical boundaries.`,
    "Black Grand Piano": `The Black Grand Piano is a masterpiece of craftsmanship and style, designed to be the centerpiece of any performance space. Its glossy finish and graceful curves exude sophistication, while the responsive action and resonant soundboard deliver a rich, full-bodied tone. Ideal for concert halls and elegant living rooms alike, this piano invites both virtuosos and aspiring musicians to create unforgettable musical moments.`,
    "Black Violin": `Striking in both appearance and sound, the Black Violin offers a fresh take on a classic instrument. Its modern, all-black finish turns heads, while its carefully selected tonewoods produce a warm, expressive sound. Perfect for soloists and ensemble players who want to stand out, this violin blends tradition with bold innovation for a truly memorable performance experience.`,
    "Fender Electric Guitar": `The Fender Electric Guitar is the quintessential choice for musicians seeking versatility, reliability, and that unmistakable Fender sparkle. With its sleek design, comfortable neck, and legendary pickups, it’s ready to tackle everything from blues and rock to pop and jazz. Whether you’re gigging on stage or recording in the studio, this guitar adapts to your style and delivers consistent, inspiring sound.`,
    "Fender Acoustic Guitar": `Classic and comfortable, the Fender Acoustic Guitar is crafted for musicians who appreciate warm, resonant tones and effortless playability. Its balanced sound makes it perfect for strumming chords, fingerpicking, or songwriting sessions. With a timeless look and dependable build, this guitar is your trusted companion for musical creativity anywhere.`,
    "Gibson Acoustic Guitar": `Step into a world of rich, vintage sound with the Gibson Acoustic Guitar, renowned for its lush tones and impeccable craftsmanship. The guitar’s classic design and premium materials provide both comfort and character, making every note resonate with warmth and depth. It’s the ideal instrument for those who cherish tradition and want to create music that stands the test of time.`,
    "Ibanez Premium": `The Ibanez Premium is engineered for players who demand precision, speed, and style. Featuring advanced hardware, a fast neck, and eye-catching finishes, this guitar is perfect for shredders and modern musicians alike. Its versatile electronics let you explore a wide range of tones, empowering you to innovate and perform at your best.`,
    "Roland Drum Set": `The Roland Drum Set brings the power of digital percussion to your fingertips, combining realistic drum sounds with cutting-edge technology. Its responsive pads and customizable kits make it suitable for any genre, from jazz to rock to electronic music. Practice quietly with headphones or perform live with confidence—Roland delivers the versatility and quality every drummer needs.`,
    "Roland Piano": `Blending authentic piano touch with modern digital features, the Roland Piano is perfect for musicians who want the best of both worlds. Its weighted keys and expressive sound engine capture the feel of a grand piano, while built-in learning tools and connectivity options make it a smart choice for home, studio, or stage.`,
    "Silver Flute": `The Silver Flute offers a brilliant, clear tone and elegant design, making it a favorite for both students and professionals. Its lightweight construction ensures comfort during long performances, while precise keywork allows for fast, accurate playing. Whether you’re performing solo or in an orchestra, this flute will help you shine.`,
    "Steinway Piano": `The Steinway Piano is the ultimate symbol of musical excellence, handcrafted for those who demand nothing but the best. Its legendary action and unrivaled tonal richness have made it the choice of concert pianists for generations. Owning a Steinway is more than having a piano—it’s possessing a piece of musical history.`,
    "Yamaha Acoustic Guitar": `The Yamaha Acoustic Guitar is renowned for its reliability, rich sound, and comfortable playability. Built with quality materials and attention to detail, it’s ideal for beginners, hobbyists, and seasoned players alike. Take it anywhere and enjoy consistent performance, whether you’re practicing at home or playing around a campfire.`,
    "Yamaha DTX Electronic Drums": `Yamaha DTX Electronic Drums are designed for drummers who want power, portability, and versatility. With a wide range of high-quality drum sounds and responsive pads, this kit is perfect for practice, recording, or live performance. Compact and easy to set up, it’s your all-in-one solution for drumming anywhere.`,
    "Yamaha Grand Piano": `The Yamaha Grand Piano combines timeless elegance with concert-quality sound, making it a stunning addition to any space. Its responsive action and rich, resonant tone inspire greatness in every performance, from intimate recitals to grand concerts. This piano is built to impress and endure.`,
    "Yamaha RGX A2": `The Yamaha RGX A2 stands out with its lightweight design, innovative construction, and bold aesthetics. Engineered for performance, it offers fast playability and versatile tone options, making it perfect for guitarists who want to make a statement on stage and explore new musical horizons.`
};

// Load product details
async function loadProductDetails(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }
        const product = await response.json();
        
        if (!product) {
            window.location.href = "shop.html";
            return;
        }

        // Update page title
        document.title = `${product.name} - MelodyMatrix`;

        // Update breadcrumb
        document.getElementById("product-breadcrumb-name").textContent = product.name;

        // Update product info
        document.getElementById("product-name").textContent = product.name || 'N/A';
        document.getElementById("product-price").textContent = formatCurrency(product.price);
        // Use new detailed description
        const mappedDetailedDesc = productDetailedDescriptions[product.name] || 'No description available.';
        document.getElementById("product-description").textContent = mappedDetailedDesc;
        document.getElementById("product-stock").textContent = product.stock;
        document.getElementById("product-availability").textContent = product.stock > 0 ? "In Stock" : "Out of Stock";
        document.getElementById("product-availability").className = product.stock > 0
            ? "availability-status in-stock"
            : "availability-status out-of-stock";
        document.getElementById("product-sku").textContent = `MM-${product.id.toString().padStart(6, '0')}`;
        
        // Fix image path logic: use DB path as-is, fallback to placeholder
        const productImage = document.getElementById("product-main-image");
        const imageMessage = document.getElementById("product-image-message");
        let imgUrl = product.imageUrl || product.image || product.imageurl;
        let hasImage = true;
        if (!imgUrl || imgUrl === '' || imgUrl === 'null') {
            imgUrl = '/admin/img/placeholder.png';
            hasImage = false;
        }
        // Remove leading slash if present (so it matches static resource path)
        if (imgUrl.startsWith('/')) imgUrl = imgUrl.substring(1);
        if (productImage) {
            productImage.src = imgUrl;
            productImage.alt = product.name;
            productImage.onerror = function() {
                this.src = '/admin/img/placeholder.png';
                if (imageMessage) imageMessage.textContent = 'No image available for this product.';
            };
        }
        if (imageMessage) {
            imageMessage.textContent = hasImage ? '' : 'No image available for this product.';
        }

        // Add extra info to left column (category, brand, features)
        const productDetailsBox = document.getElementById('product-extra-info');
        if (productDetailsBox) {
            let html = '';
            html += `<div class='product-category'><strong>Category:</strong> ${product.category || 'N/A'}</div>`;
            if (product.brand) {
                html += `<div class='product-brand'><strong>Brand:</strong> ${product.brand}</div>`;
            }
            if (product.features && Array.isArray(product.features) && product.features.length > 0) {
                html += `<ul class='product-features'><strong>Features:</strong>`;
                product.features.forEach(f => {
                    html += `<li>${f}</li>`;
                });
                html += `</ul>`;
            }
            productDetailsBox.innerHTML = html;
        }

        // Add a short description/tagline under the image
        const shortDescBox = document.getElementById('product-short-description');
        if (shortDescBox) {
            let shortDesc = mappedDetailedDesc;
            if (shortDesc.length > 120) shortDesc = shortDesc.substring(0, 117) + '...';
            shortDescBox.textContent = shortDesc ? shortDesc : 'Discover the unique features of this product!';
        }

        // Set up quantity selector maximum
        const quantityInput = document.getElementById("quantity");
        if (quantityInput) {
            quantityInput.max = product.stock;
            quantityInput.value = "1";
        }

        // Enable/disable add to cart button based on stock
        const addToCartBtn = document.getElementById("add-to-cart-btn");
        if (addToCartBtn) {
            addToCartBtn.disabled = product.stock <= 0;
        }

        // Start polling for updates
        startProductPolling(productId);

    } catch (error) {
        console.error('Error loading product:', error);
        // Show error message to user
        const productContainer = document.querySelector('.product-container');
        if (productContainer) {
            productContainer.innerHTML = `
                <div class="error-message">
                    <h2>Error Loading Product</h2>
                    <p>Sorry, we couldn't load the product information. Please try again later.</p>
                    <a href="shop.html" class="btn btn-primary">Return to Shop</a>
                </div>
            `;
        }
    }
}

function formatCurrency(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Poll for product updates
function startProductPolling(productId) {
    setInterval(() => {
        checkProductUpdates(productId);
    }, 10000); // Check every 10 seconds
}

async function checkProductUpdates(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) return;
        
        const product = await response.json();
        
        // Update stock-sensitive elements
        document.getElementById("product-stock").textContent = product.stock;
        document.getElementById("product-availability").textContent = product.stock > 0 ? "In Stock" : "Out of Stock";
        document.getElementById("product-availability").className = product.stock > 0
            ? "availability-status in-stock"
            : "availability-status out-of-stock";
            
        const quantityInput = document.getElementById("quantity");
        if (quantityInput) {
            quantityInput.max = product.stock;
            if (parseInt(quantityInput.value) > product.stock) {
                quantityInput.value = product.stock;
            }
        }

        const addToCartBtn = document.getElementById("add-to-cart-btn");
        if (addToCartBtn) {
            addToCartBtn.disabled = product.stock <= 0;
        }

    } catch (error) {
        console.error('Error checking product updates:', error);
    }
}

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElem = document.querySelector('.cart-count');
    if (cartCountElem) cartCountElem.textContent = count;
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

function handleAddToCart() {
    const quantityInput = document.getElementById("quantity");
    const quantity = parseInt(quantityInput.value);
    const productId = new URLSearchParams(window.location.search).get("id");
    if (!productId || isNaN(quantity) || quantity < 1) {
        showNotification('Invalid quantity.', 'error');
        return;
    }
    // Get product info from page
    const name = document.getElementById("product-name").textContent;
    const price = parseFloat(document.getElementById("product-price").textContent.replace(/[^\d.]/g, ''));
    const image = document.getElementById("product-main-image").src;
    const stock = parseInt(document.getElementById("product-stock").textContent);
    if (quantity > stock) {
        showNotification('Cannot add more than available stock.', 'error');
        return;
    }
    let cart = getCart();
    const existing = cart.find(item => item.id == productId);
    if (existing) {
        if (existing.quantity + quantity > stock) {
            showNotification('Cannot add more than available stock.', 'error');
            return;
        }
        existing.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name,
            price,
            image,
            quantity,
            stock
        });
    }
    setCart(cart);
    updateCartCount();
    showNotification('Product added to cart successfully! <a href="cart.html" style="color:#fff;text-decoration:underline;">View Cart</a>', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
