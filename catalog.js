// Renderizar catálogo de productos
if (typeof renderCatalog === 'undefined') {
    window.renderCatalog = renderCatalog;
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('catalogContent')) {
        renderCatalog();
    }
});

function renderCatalog() {
    const catalogContent = document.getElementById('catalogContent');
    if (!catalogContent) return;

    const categories = [
        { title: 'CREMOSAS', category: 'cremosa', class: 'cremosa' },
        { title: 'RELLENAS', category: 'rellena', class: 'rellena' },
        { title: 'EXCLUSIVAS', category: 'exclusiva', class: 'exclusiva' }
    ];

    let html = '';
    
    categories.forEach(({ title, category, class: categoryClass }) => {
        const products = productManager.getProductsByCategory(category);
        
        html += `
            <div class="category-section">
                <h3 class="category-title">${title}</h3>
                <div class="product-grid">
        `;

        if (products.length === 0) {
            html += '<p style="text-align: center; grid-column: 1/-1; color: var(--dark-gray);">No hay productos en esta categoría.</p>';
        } else {
            products.forEach(product => {
                html += createProductCard(product, categoryClass);
            });
        }

        html += `
                </div>
            </div>
        `;
    });

    catalogContent.innerHTML = html;
}

function createProductCard(product, categoryClass) {
    const formattedPrice = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(product.price);

    // Obtener primera imagen si existe
    const hasImage = product.images && product.images.length > 0 && product.images[0];
    const imageStyle = hasImage 
        ? `background-image: url('${product.images[0]}'); background-size: cover; background-position: center;`
        : '';

    return `
        <div class="product-card" onclick="window.location.href='product-detail-standalone.html?id=${product.id}'" style="cursor: pointer;">
            <div class="product-image-placeholder ${categoryClass}" style="${imageStyle}">
                ${!hasImage ? '' : ''}
            </div>
            <h3>${product.name}</h3>
            <p>${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
            <p class="price">${formattedPrice}</p>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                Agregar al Carrito
            </button>
            <a href="product-detail-standalone.html?id=${product.id}" class="view-details" onclick="event.stopPropagation()">
                Ver Detalles
            </a>
        </div>
    `;
}

