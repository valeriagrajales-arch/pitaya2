// Página de detalle del producto
document.addEventListener('DOMContentLoaded', function() {
    renderProductDetail();
});

function renderProductDetail() {
    // Obtener ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        document.getElementById('productDetailContent').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2>Producto no encontrado</h2>
                <a href="catalogo-standalone.html" class="cta-button">Volver al catálogo</a>
            </div>
        `;
        return;
    }

    const product = productManager.getProduct(productId);
    
    if (!product) {
        document.getElementById('productDetailContent').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2>Producto no encontrado</h2>
                <a href="catalogo-standalone.html" class="cta-button">Volver al catálogo</a>
            </div>
        `;
        return;
    }

    // Obtener imágenes del producto (si no tiene, usar placeholder)
    const images = product.images && product.images.length > 0 
        ? product.images 
        : [null]; // Array con null para mostrar placeholder

    const formattedPrice = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(product.price);

    const categoryLabels = {
        cremosa: { text: 'CREMOSA', class: 'category-cremosa' },
        rellena: { text: 'RELLENA', class: 'category-rellena' },
        exclusiva: { text: 'EXCLUSIVA', class: 'category-exclusiva' }
    };

    const categoryInfo = categoryLabels[product.category] || categoryLabels.cremosa;

    // Obtener color de fondo según categoría
    const categoryColors = {
        cremosa: 'linear-gradient(135deg, var(--secondary-yellow-light) 0%, var(--primary-yellow) 100%)',
        rellena: 'linear-gradient(135deg, var(--secondary-green) 0%, var(--primary-green) 100%)',
        exclusiva: 'linear-gradient(135deg, var(--secondary-magenta) 0%, var(--primary-magenta) 100%)'
    };

    const mainImageUrl = images[0];
    const mainImageStyle = mainImageUrl 
        ? `background-image: url('${mainImageUrl}'); background-size: cover; background-position: center;`
        : `background: ${categoryColors[product.category]};`;

    let thumbnailsHTML = '';
    images.forEach((img, index) => {
        if (!img) return; // Saltar imágenes nulas en thumbnails
        const thumbStyle = `background-image: url('${img}'); background-size: cover; background-position: center;`;
        
        thumbnailsHTML += `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                 onclick="changeMainImage('${img}', ${index})"
                 style="${thumbStyle}">
            </div>
        `;
    });
    
    // Llenar hasta 4 thumbnails si hay menos
    const validImages = images.filter(img => img);
    while (validImages.length < 4 && thumbnailsHTML.split('</div>').length - 1 < 4) {
        thumbnailsHTML += `
            <div class="thumbnail" 
                 style="background: ${categoryColors[product.category]}; opacity: 0.5; cursor: not-allowed;">
                <div class="image-placeholder">Vacío</div>
            </div>
        `;
    }

    const html = `
        <div class="product-detail-content">
            <div class="product-images" style="position: relative;">
                <div class="main-image" 
                     id="mainProductImage"
                     onclick="${mainImageUrl ? 'openLightbox(\'' + mainImageUrl + '\')' : ''}"
                     style="${mainImageStyle}; cursor: ${mainImageUrl ? 'pointer' : 'default'};">
                    ${!mainImageUrl ? '<div class="image-placeholder" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.7);">Sin imagen disponible</div>' : ''}
                </div>
                
                <div class="thumbnail-images">
                    ${thumbnailsHTML}
                </div>
            </div>

            <div class="product-info">
                <span class="product-category-badge ${categoryInfo.class}">${categoryInfo.text}</span>
                <h1 class="product-title">${product.name}</h1>
                <p class="product-price">${formattedPrice}</p>
                <p class="product-description">${product.description}</p>
                
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        Agregar al Carrito
                    </button>
                    <button class="btn-wishlist" onclick="addToWishlist(${product.id})">
                        ♥ Agregar a Favoritos
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('productDetailContent').innerHTML = html;
}

// Cambiar imagen principal
function changeMainImage(imageUrl, index) {
    if (!imageUrl) return;
    
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Actualizar imagen principal
    mainImage.style.backgroundImage = `url('${imageUrl}')`;
    mainImage.style.backgroundSize = 'cover';
    mainImage.style.backgroundPosition = 'center';
    mainImage.onclick = () => openLightbox(imageUrl);
    mainImage.style.cursor = 'pointer';
    
    // Remover placeholder si existe
    const placeholder = mainImage.querySelector('.image-placeholder');
    if (placeholder) placeholder.remove();
    
    // Actualizar thumbnails activos
    thumbnails.forEach((thumb, i) => {
        if (thumb.style.backgroundImage) {
            thumb.classList.toggle('active', i === index);
        }
    });
}

// Abrir lightbox
function openLightbox(imageUrl) {
    if (!imageUrl) return;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = imageUrl;
    lightbox.classList.add('active');
}

// Cerrar lightbox
function closeLightbox(event) {
    if (event && event.target.id !== 'lightbox' && event.target.id !== 'lightboxImage') {
        return;
    }
    document.getElementById('lightbox').classList.remove('active');
}

// Agregar al carrito
function addToCart(productId) {
    if (window.cartManager) {
        window.cartManager.addToCart(productId);
    } else {
        // Si el carrito aún no está cargado, esperar un momento
        setTimeout(() => {
            if (window.cartManager) {
                window.cartManager.addToCart(productId);
            } else {
                alert('Error: El carrito no está disponible. Por favor, recarga la página.');
            }
        }, 500);
    }
}

// Agregar a favoritos
function addToWishlist(productId) {
    alert('Producto agregado a favoritos');
    // Aquí puedes agregar la lógica de favoritos
}

// Exportar funciones globales
window.changeMainImage = changeMainImage;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;

