// Menu Data
const menuItems = [
    { id: 1, name: 'Ayam Crispy Original', price: 25000, category: 'makanan' },
    { id: 2, name: 'Ayam Crispy Pedas', price: 27000, category: 'makanan' },
    { id: 3, name: 'Ayam Crispy Cheese', price: 30000, category: 'makanan' },
    { id: 4, name: 'Paket Ayam + Nasi', price: 32000, category: 'makanan' },
    { id: 5, name: 'Paket Keluarga', price: 95000, category: 'makanan' },
    { id: 6, name: 'Kentang Goreng', price: 15000, category: 'makanan' },
    { id: 7, name: 'Es Teh Manis', price: 5000, category: 'minuman' },
    { id: 8, name: 'Jus Jeruk', price: 12000, category: 'minuman' },
    { id: 9, name: 'Soft Drink', price: 8000, category: 'minuman' }
];

// Cart State
let cart = [];

// Order History State
let orderHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    loadOrderHistory();
    updateCartDisplay();
    displayOrderHistory();
    setupNavigation();
    setupForms();
});

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Setup Forms
function setupForms() {
    // Order Form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Add to Cart
function addToCart(itemId) {
    const menuItem = menuItems.find(item => item.id === itemId);
    
    if (!menuItem) {
        showAlert('Item tidak ditemukan!', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showAlert(`${menuItem.name} ditambahkan ke keranjang!`, 'success');
    
    // Scroll to order section
    setTimeout(() => {
        document.querySelector('#order').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Update Cart Display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-message">Keranjang masih kosong. Silakan pesan menu favorit Anda!</p>';
        cartTotal.textContent = 'Rp 0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Rp ${formatRupiah(item.price)} x ${item.quantity} = Rp ${formatRupiah(subtotal)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="decreaseQuantity(${item.id})">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    cartTotal.textContent = `Rp ${formatRupiah(total)}`;
}

// Increase Quantity
function increaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += 1;
        saveCart();
        updateCartDisplay();
    }
}

// Decrease Quantity
function decreaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            saveCart();
            updateCartDisplay();
        } else {
            removeFromCart(itemId);
        }
    }
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
    showAlert('Item dihapus dari keranjang', 'success');
}

// Handle Order Submit
function handleOrderSubmit(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        showAlert('Keranjang masih kosong! Silakan pesan terlebih dahulu.', 'error');
        return;
    }
    
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const orderNotes = document.getElementById('orderNotes').value;
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order object
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString('id-ID'),
        customer: {
            name: customerName,
            phone: customerPhone,
            address: customerAddress
        },
        items: [...cart],
        notes: orderNotes,
        total: total,
        status: 'Selesai'
    };
    
    // Add to order history
    orderHistory.unshift(order);
    saveOrderHistory();
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartDisplay();
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showAlert('Pesanan berhasil dikirim! Terima kasih telah memesan.', 'success');
    
    // Display updated history
    displayOrderHistory();
    
    // Scroll to history section
    setTimeout(() => {
        document.querySelector('#history').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

// Handle Contact Submit
function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Simulate sending message
    console.log('Pesan Kontak:', { name, email, subject, message });
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showAlert('Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
}

// Display Order History
function displayOrderHistory() {
    const historyContainer = document.getElementById('order-history');
    
    if (!historyContainer) return;
    
    if (orderHistory.length === 0) {
        historyContainer.innerHTML = '<p class="empty-message">Belum ada riwayat pesanan.</p>';
        return;
    }
    
    let html = '';
    
    orderHistory.forEach(order => {
        const itemsList = order.items.map(item => 
            `<li>${item.name} x${item.quantity} - Rp ${formatRupiah(item.price * item.quantity)}</li>`
        ).join('');
        
        html += `
            <div class="history-item">
                <div class="history-header">
                    <h3>Pesanan #${order.id}</h3>
                    <span class="history-status status-completed">${order.status}</span>
                </div>
                <div class="history-details">
                    <p><strong>Tanggal:</strong> ${order.date}</p>
                    <p><strong>Nama:</strong> ${order.customer.name}</p>
                    <p><strong>Telepon:</strong> ${order.customer.phone}</p>
                    <p><strong>Alamat:</strong> ${order.customer.address}</p>
                    ${order.notes ? `<p><strong>Catatan:</strong> ${order.notes}</p>` : ''}
                </div>
                <div class="history-items">
                    <h4>Item Pesanan:</h4>
                    <ul>${itemsList}</ul>
                    <p style="margin-top: 1rem;"><strong>Total: Rp ${formatRupiah(order.total)}</strong></p>
                </div>
            </div>
        `;
    });
    
    historyContainer.innerHTML = html;
}

// Local Storage Functions
function saveCart() {
    localStorage.setItem('crispyChickenCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('crispyChickenCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveOrderHistory() {
    localStorage.setItem('crispyChickenHistory', JSON.stringify(orderHistory));
}

function loadOrderHistory() {
    const savedHistory = localStorage.getItem('crispyChickenHistory');
    if (savedHistory) {
        orderHistory = JSON.parse(savedHistory);
    }
}

// Utility Functions
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

function showAlert(message, type = 'success') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
