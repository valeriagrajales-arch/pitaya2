// Panel de administración - CRUD
let editingProductId = null;

document.addEventListener('DOMContentLoaded', function() {
    renderProductsTable();
    updateStats();
});

// Abrir formulario de producto
function openProductForm(productId = null) {
    editingProductId = productId;
    const formOverlay = document.getElementById('formOverlay');
    const formTitle = document.getElementById('formTitle');
    const form = document.getElementById('productForm');

    // Limpiar imágenes
    clearImagesContainer();

    if (productId) {
        // Modo edición
        const product = productManager.getProduct(productId);
        if (product) {
            formTitle.textContent = 'Editar Producto';
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            form.querySelector('button[type="submit"]').textContent = 'Actualizar Producto';
            
            // Cargar imágenes existentes
            if (product.images && product.images.length > 0) {
                product.images.forEach(imageData => {
                    // Detectar si es base64 (empieza con data:) o URL
                    if (imageData.startsWith('data:')) {
                        addImageInput(imageData);
                    } else {
                        addImageUrlInput(imageData);
                    }
                });
            } else {
                addImageInput(); // Al menos un campo vacío
            }
        }
    } else {
        // Modo creación
        formTitle.textContent = 'Nuevo Producto';
        form.reset();
        form.querySelector('button[type="submit"]').textContent = 'Crear Producto';
        addImageInput(); // Al menos un campo vacío
    }

    formOverlay.classList.add('active');
}

// Cerrar formulario
function closeProductForm() {
    const formOverlay = document.getElementById('formOverlay');
    formOverlay.classList.remove('active');
    editingProductId = null;
    document.getElementById('productForm').reset();
    clearImagesContainer();
}

// Agregar input para subir archivo
function addImageInput(imageData = null) {
    const container = document.getElementById('imagesContainer');
    const imageId = 'image_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const div = document.createElement('div');
    div.id = imageId;
    div.className = 'image-upload-item';
    div.style.cssText = 'margin-bottom: 15px; padding: 15px; border: 2px dashed var(--secondary-yellow-light); border-radius: 10px; background-color: var(--cream);';
    
    let previewHTML = '';
    if (imageData) {
        previewHTML = `
            <div class="image-preview" style="margin-bottom: 10px;">
                <img src="${imageData}" alt="Preview" style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover;">
            </div>
        `;
    }
    
    div.innerHTML = `
        ${previewHTML}
        <div style="display: flex; gap: 10px; align-items: center;">
            <input type="file" 
                   class="image-file-input" 
                   accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                   onchange="handleImageUpload(this, '${imageId}')"
                   data-base64="${imageData || ''}"
                   style="flex: 1; padding: 8px; border: 2px solid var(--secondary-yellow-light); border-radius: 8px; font-family: var(--font-mundial); font-size: 14px;">
            <button type="button" 
                    onclick="removeImageInput(this)" 
                    style="padding: 10px 15px; background-color: var(--primary-magenta); color: var(--white); border: none; border-radius: 8px; cursor: pointer; font-weight: 600; white-space: nowrap;">
                × Eliminar
            </button>
        </div>
        <small style="display: block; margin-top: 5px; color: var(--dark-gray); font-size: 12px;">
            Máximo 10MB por imagen
        </small>
    `;
    container.appendChild(div);
}

// Agregar input para URL
function addImageUrlInput(imageUrl = '') {
    const container = document.getElementById('imagesContainer');
    const imageId = 'image_url_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const div = document.createElement('div');
    div.id = imageId;
    div.className = 'image-url-item';
    div.style.cssText = 'margin-bottom: 15px; padding: 15px; border: 2px dashed var(--secondary-green); border-radius: 10px; background-color: var(--cream);';
    
    let previewHTML = '';
    if (imageUrl) {
        previewHTML = `
            <div class="image-preview" style="margin-bottom: 10px;">
                <img src="${imageUrl}" alt="Preview" onerror="this.style.display='none'" style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover;">
            </div>
        `;
    }
    
    div.innerHTML = `
        ${previewHTML}
        <div style="display: flex; gap: 10px; align-items: center;">
            <input type="url" 
                   class="image-url-input" 
                   placeholder="URL de la imagen (https://...)" 
                   value="${imageUrl}"
                   onchange="updateUrlPreview(this, '${imageId}')"
                   style="flex: 1; padding: 10px; border: 2px solid var(--secondary-green); border-radius: 8px; font-family: var(--font-mundial);">
            <button type="button" 
                    onclick="removeImageInput(this)" 
                    style="padding: 10px 15px; background-color: var(--primary-magenta); color: var(--white); border: none; border-radius: 8px; cursor: pointer; font-weight: 600; white-space: nowrap;">
                × Eliminar
            </button>
        </div>
    `;
    container.appendChild(div);
}

// Manejar subida de imagen
function handleImageUpload(input, containerId) {
    const file = input.files[0];
    if (!file) {
        // Si no hay archivo, mantener el base64 existente si lo hay
        return;
    }
    
    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Máximo 10MB permitido.');
        input.value = '';
        // Mantener imagen anterior si existe
        if (input.dataset.base64) {
            return;
        }
        return;
    }
    
    // Validar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Formato de imagen no válido. Use JPG, PNG, GIF o WEBP.');
        input.value = '';
        // Mantener imagen anterior si existe
        if (input.dataset.base64) {
            return;
        }
        return;
    }
    
    // Convertir a base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        const container = document.getElementById(containerId);
        const previewDiv = container.querySelector('.image-preview');
        
        if (previewDiv) {
            previewDiv.innerHTML = `<img src="${base64Image}" alt="Preview" style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover;">`;
        } else {
            const newPreview = document.createElement('div');
            newPreview.className = 'image-preview';
            newPreview.style.cssText = 'margin-bottom: 10px;';
            newPreview.innerHTML = `<img src="${base64Image}" alt="Preview" style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover;">`;
            container.insertBefore(newPreview, container.firstChild);
        }
        
        // Guardar base64 en el input como data attribute
        input.dataset.base64 = base64Image;
    };
    reader.onerror = function() {
        alert('Error al leer la imagen. Intenta con otra imagen.');
        input.value = '';
    };
    reader.readAsDataURL(file);
}

// Actualizar preview de URL
function updateUrlPreview(input, containerId) {
    const url = input.value.trim();
    if (!url) return;
    
    const container = document.getElementById(containerId);
    let previewDiv = container.querySelector('.image-preview');
    
    if (!previewDiv) {
        previewDiv = document.createElement('div');
        previewDiv.className = 'image-preview';
        previewDiv.style.cssText = 'margin-bottom: 10px;';
        container.insertBefore(previewDiv, container.firstChild);
    }
    
    previewDiv.innerHTML = `<img src="${url}" alt="Preview" onerror="this.style.display='none'" style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover;">`;
}

// Eliminar input de imagen
function removeImageInput(button) {
    // Buscar el contenedor padre completo del item
    const item = button.closest('.image-upload-item, .image-url-item');
    if (item) {
        item.remove();
    } else {
        // Fallback: eliminar el div padre
        button.parentElement.parentElement.remove();
    }
}

// Limpiar contenedor de imágenes
function clearImagesContainer() {
    const container = document.getElementById('imagesContainer');
    container.innerHTML = '';
}

// Obtener imágenes del formulario
function getImagesFromForm() {
    const images = [];
    
    // Obtener imágenes subidas (base64)
    const fileInputs = document.querySelectorAll('.image-file-input');
    fileInputs.forEach(input => {
        // Usar base64 del dataset (se guarda cuando se sube o cuando se carga un producto existente)
        if (input.dataset.base64 && input.dataset.base64.trim() !== '') {
            images.push(input.dataset.base64);
        }
    });
    
    // Obtener URLs
    const urlInputs = document.querySelectorAll('.image-url-input');
    urlInputs.forEach(input => {
        const url = input.value.trim();
        if (url) {
            images.push(url);
        }
    });
    
    return images;
}

// Cerrar al hacer click en el overlay
function closeFormOnOverlay(event) {
    if (event.target.id === 'formOverlay') {
        closeProductForm();
    }
}

// Manejar envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        images: getImagesFromForm()
    };

    if (editingProductId) {
        // Actualizar producto
        productManager.updateProduct(editingProductId, formData);
    } else {
        // Crear producto
        productManager.createProduct(formData);
    }

    closeProductForm();
    renderProductsTable();
    updateStats();
    
    // Si estamos en la página de catálogo, recargarla
    if (window.location.pathname.includes('catalogo')) {
        renderCatalog();
    }
}

// Renderizar tabla de productos
function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    const products = productManager.getProducts();

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No hay productos. Crea tu primer producto.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(product => {
        const formattedPrice = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(product.price);

        const categoryLabels = {
            cremosa: 'CREMOSA',
            rellena: 'RELLENA',
            exclusiva: 'EXCLUSIVA'
        };

        const shortDescription = product.description.length > 50 
            ? product.description.substring(0, 50) + '...' 
            : product.description;

        return `
            <tr>
                <td>${product.id}</td>
                <td class="product-name">${product.name}</td>
                <td>
                    <span class="category-badge category-${product.category}">
                        ${categoryLabels[product.category]}
                    </span>
                </td>
                <td class="product-description">${shortDescription}</td>
                <td class="product-price">${formattedPrice}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="openProductForm(${product.id})">
                        Editar
                    </button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Eliminar producto
function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        productManager.deleteProduct(id);
        renderProductsTable();
        updateStats();
        
        // Si estamos en la página de catálogo, recargarla
        if (window.location.pathname.includes('catalogo')) {
            renderCatalog();
        }
    }
}

// Actualizar estadísticas
function updateStats() {
    const products = productManager.getProducts();
    
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('cremosasCount').textContent = 
        products.filter(p => p.category === 'cremosa').length;
    document.getElementById('rellenasCount').textContent = 
        products.filter(p => p.category === 'rellena').length;
    document.getElementById('exclusivasCount').textContent = 
        products.filter(p => p.category === 'exclusiva').length;
}

// Exportar funciones para uso global
window.openProductForm = openProductForm;
window.closeProductForm = closeProductForm;
window.closeFormOnOverlay = closeFormOnOverlay;
window.handleFormSubmit = handleFormSubmit;
window.deleteProduct = deleteProduct;
window.addImageInput = addImageInput;
window.addImageUrlInput = addImageUrlInput;
window.removeImageInput = removeImageInput;
window.handleImageUpload = handleImageUpload;
window.updateUrlPreview = updateUrlPreview;

