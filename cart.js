// Sistema de Carrito de Compras
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartUI();
    }

    // Cargar carrito desde localStorage
    loadCart() {
        const savedCart = localStorage.getItem('pitayaCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('pitayaCart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    // Agregar producto al carrito
    addToCart(productId, quantity = 1) {
        const productManager = window.productManager || new ProductManager();
        const product = productManager.getProduct(productId);
        
        if (!product) {
            alert('Producto no encontrado');
            return;
        }

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
                quantity: quantity,
                category: product.category
            });
        }

        this.saveCart();
        this.showCartNotification();
    }

    // Eliminar producto del carrito
    removeFromCart(productId) {
        const numProductId = Number(productId);
        if (isNaN(numProductId)) return;
        
        this.cart = this.cart.filter(item => item.id !== numProductId);
        this.saveCart();
        this.renderCart();
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, quantity) {
        const numQuantity = Number(quantity);
        if (isNaN(numQuantity) || numQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = numQuantity;
            this.saveCart();
            this.renderCart();
        }
    }

    // Obtener cantidad total de items
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtener total del carrito
    getTotal() {
        return this.cart.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    }

    // Limpiar carrito
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
    }

    // Actualizar UI del carrito (contador, etc.)
    updateCartUI() {
        const cartCount = this.getTotalItems();
        const cartCountElements = document.querySelectorAll('.cart-count');
        const cartIcon = document.querySelector('.cart-icon');
        
        cartCountElements.forEach(el => {
            el.textContent = cartCount;
            el.style.display = cartCount > 0 ? 'block' : 'none';
        });

        if (cartIcon) {
            cartIcon.classList.toggle('has-items', cartCount > 0);
        }
    }

    // Mostrar notificación de producto agregado
    showCartNotification() {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = '✓ Producto agregado al carrito';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Renderizar carrito en el modal
    renderCart() {
        const cartModal = document.getElementById('cartModal');
        if (!cartModal) return;

        const cartContent = document.getElementById('cartContent');
        const cartTotal = document.getElementById('cartTotal');
        const cartEmpty = document.getElementById('cartEmpty');

        if (this.cart.length === 0) {
            if (cartContent) cartContent.innerHTML = '';
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartTotal) cartTotal.textContent = '$0';
            return;
        }

        if (cartEmpty) cartEmpty.style.display = 'none';

        if (!cartContent) return;

        cartContent.innerHTML = this.cart.map(item => {
            const formattedPrice = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(item.price);

            const itemTotal = Number(item.price) * Number(item.quantity);
            const formattedTotal = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(itemTotal);

            const imageSrc = item.image || 'img/pitayaprinci.png';
            
            return `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${imageSrc}" alt="${item.name}" onerror="this.src='img/pitayaprinci.png'">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">${formattedPrice}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn quantity-decrease" data-product-id="${item.id}" type="button">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn quantity-increase" data-product-id="${item.id}" type="button">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        <p class="item-total-price">${formattedTotal}</p>
                        <button class="remove-item-btn" data-product-id="${item.id}" type="button" aria-label="Eliminar">
                            <span>×</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Los event listeners ya están configurados en DOMContentLoaded
        // No necesitamos agregarlos de nuevo

        const total = this.getTotal();
        const formattedTotal = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(total);

        if (cartTotal) {
            cartTotal.textContent = formattedTotal;
        }
    }


    // Abrir modal del carrito
    openCart() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.renderCart();
            // Asegurar que los event listeners estén activos
            this.ensureEventListeners();
        }
    }

    // Asegurar que los event listeners estén configurados
    ensureEventListeners() {
        const cartContent = document.getElementById('cartContent');
        if (!cartContent || cartContent.hasAttribute('data-listeners-attached')) return;

        cartContent.setAttribute('data-listeners-attached', 'true');
        cartContent.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const productId = parseInt(target.getAttribute('data-product-id'));
            if (!productId || isNaN(productId)) return;

            if (target.classList.contains('quantity-decrease')) {
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            } else if (target.classList.contains('quantity-increase')) {
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            } else if (target.classList.contains('remove-item-btn')) {
                this.removeFromCart(productId);
            }
        });
    }

    // Cerrar modal del carrito
    closeCart() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Procesar compra (simulado)
    checkout() {
        if (this.cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        const total = this.getTotal();
        const confirmMessage = `¿Confirmar compra por ${new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(total)}?`;

        if (confirm(confirmMessage)) {
            alert('¡Compra realizada con éxito! Gracias por tu compra.');
            this.clearCart();
            this.closeCart();
        }
    }
}

// Inicializar carrito
let cartManager;
document.addEventListener('DOMContentLoaded', function() {
    cartManager = new CartManager();
    
    // Event listeners para el carrito
    const cartIcon = document.querySelector('.cart-icon');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartContent = document.getElementById('cartContent');

    if (cartIcon) {
        cartIcon.addEventListener('click', () => cartManager.openCart());
    }

    if (cartClose) {
        cartClose.addEventListener('click', () => cartManager.closeCart());
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => cartManager.closeCart());
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => cartManager.checkout());
    }

    // Los event listeners se configurarán cuando se abra el carrito por primera vez
    // Esto se hace en ensureEventListeners() para evitar duplicados

    // Hacer cartManager disponible globalmente
    window.cartManager = cartManager;
});

// Función global para agregar al carrito (para compatibilidad)
function addToCart(productId) {
    if (window.cartManager) {
        window.cartManager.addToCart(productId);
    }
}

window.addToCart = addToCart;

