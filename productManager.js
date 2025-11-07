// Sistema de gestión de productos (CRUD)
class ProductManager {
    constructor() {
        this.initializeProducts();
    }

    // Mapeo de productos a imágenes .webp
    getProductImageMapping() {
        return {
            'Fresas con crema': 'img/fresas con crema.webp',
            'Mousse de mandarina': 'img/mousse mandarina.webp',
            'Pay de limón': 'img/pay de limon.webp',
            'Coco arequipe': 'img/coco (1).webp',
            'Piña hierbabuena': 'img/piña hierba buena.webp',
            'Limonada cereza': 'img/limonada de cereza.webp',
            'Maracumango': 'img/maracumango.webp',
            'Cheesecake de frutos rojos': 'img/cheesecacke frutos rojos.webp',
            'Mango biche': 'img/mango biche.webp'
        };
    }

    // Actualizar productos existentes con imágenes .webp
    updateProductsWithImages() {
        const products = this.getProducts();
        const imageMapping = this.getProductImageMapping();
        let updated = false;

        products.forEach(product => {
            const imagePath = imageMapping[product.name];
            if (imagePath && (!product.images || product.images.length === 0 || !product.images.includes(imagePath))) {
                product.images = [imagePath];
                updated = true;
            }
        });

        if (updated) {
            this.saveProducts(products);
        }
    }

    // Inicializar productos si no existen
    initializeProducts() {
        const products = this.getProducts();
        if (products.length === 0) {
            const initialProducts = [
                {
                    id: 1,
                    name: 'Fresas con crema',
                    category: 'cremosa',
                    description: 'Una combinación irresistible de fresas frescas y crema suave en una paleta cremosa, bañada con Lecherita, trozos de fresa y un toque de leche Klim.',
                    price: 12000,
                    images: ['img/fresas con crema.webp']
                },
                {
                    id: 2,
                    name: 'Mousse de mandarina',
                    category: 'cremosa',
                    description: 'Refrescante y delicada, esta paleta cremosa de mousse de mandarina se complementa con galleta sultana y cascos de mandarina.',
                    price: 12000,
                    images: ['img/mousse mandarina.webp']
                },
                {
                    id: 3,
                    name: 'Pay de limón',
                    category: 'cremosa',
                    description: 'El clásico sabor del pay de limón en versión paleta, con relleno de galleta, un toque de galleta sultana y ralladura de limón que realzan su frescura.',
                    price: 12000,
                    images: ['img/pay de limon.webp']
                },
                {
                    id: 4,
                    name: 'Coco arequipe',
                    category: 'rellena',
                    description: 'Siente la mezcla perfecta entre lo tropical y lo dulce con esta paleta de coco rellena de arequipe, decorada con más arequipe y coco rallado.',
                    price: 13000,
                    images: ['img/coco (1).webp']
                },
                {
                    id: 5,
                    name: 'Piña hierbabuena',
                    category: 'rellena',
                    description: 'Una explosión refrescante de piña y hierbabuena con un corazón cremoso de Lecherita, acompañada de trozos de piña y hierbabuena finamente picada.',
                    price: 13000,
                    images: ['img/piña hierba buena.webp']
                },
                {
                    id: 6,
                    name: 'Limonada cereza',
                    category: 'rellena',
                    description: 'El equilibrio perfecto entre lo ácido y lo dulce: limonada de cereza rellena de Lecherita, con zumo de limón, bubols de cereza y ralladura de limón.',
                    price: 13000,
                    images: ['img/limonada de cereza.webp']
                },
                {
                    id: 7,
                    name: 'Maracumango',
                    category: 'rellena',
                    description: 'Una combinación tropical de maracuyá y mango con relleno de Lecherita, cubierta con salsa de maracuyá, trozos de mango maduro y bubols de maracuyá.',
                    price: 13000,
                    images: ['img/maracumango.webp']
                },
                {
                    id: 8,
                    name: 'Cheesecake de frutos rojos',
                    category: 'exclusiva',
                    description: 'Una paleta gourmet con el sabor cremoso del cheesecake y el toque vibrante de los frutos rojos, acompañada de salsa de mora, galleta sultana y trozos de fresa.',
                    price: 15000,
                    images: ['img/cheesecacke frutos rojos.webp']
                },
                {
                    id: 9,
                    name: 'Mango biche',
                    category: 'exclusiva',
                    description: 'La favorita de los amantes del picante: mango biche con chamoy, Tajín, salimón y trozos de mango biche. Pura actitud y sabor.',
                    price: 14000,
                    images: ['img/mango biche.webp']
                }
            ];
            this.saveProducts(initialProducts);
        } else {
            // Si ya hay productos, actualizar con las imágenes .webp
            this.updateProductsWithImages();
        }
    }

    // Obtener todos los productos
    getProducts() {
        const products = localStorage.getItem('pitaya-products');
        return products ? JSON.parse(products) : [];
    }

    // Guardar productos
    saveProducts(products) {
        localStorage.setItem('pitaya-products', JSON.stringify(products));
    }

    // Obtener productos por categoría
    getProductsByCategory(category) {
        return this.getProducts().filter(product => product.category === category);
    }

    // Obtener un producto por ID
    getProduct(id) {
        return this.getProducts().find(product => product.id === id);
    }

    // Crear producto
    createProduct(productData) {
        const products = this.getProducts();
        const newProduct = {
            ...productData,
            id: Date.now(),
            price: parseFloat(productData.price),
            images: productData.images ? (Array.isArray(productData.images) ? productData.images : [productData.images]) : []
        };
        products.push(newProduct);
        this.saveProducts(products);
        return newProduct;
    }

    // Actualizar producto
    updateProduct(id, productData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...productData,
                id: id,
                price: parseFloat(productData.price),
                images: productData.images ? (Array.isArray(productData.images) ? productData.images : [productData.images]) : (products[index].images || [])
            };
            this.saveProducts(products);
            return products[index];
        }
        return null;
    }

    // Eliminar producto
    deleteProduct(id) {
        const products = this.getProducts().filter(p => p.id !== id);
        this.saveProducts(products);
        return true;
    }
}

// Instancia global
const productManager = new ProductManager();

