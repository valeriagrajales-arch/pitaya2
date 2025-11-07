import React, { createContext, useContext, useState, useEffect } from 'react'

const ProductContext = createContext()

// Datos iniciales de productos
const initialProducts = [
  {
    id: 1,
    name: 'Fresas con crema',
    category: 'cremosa',
    description: 'Una combinación irresistible de fresas frescas y crema suave en una paleta cremosa, bañada con Lecherita, trozos de fresa y un toque de leche Klim.',
    price: 12000
  },
  {
    id: 2,
    name: 'Mousse de mandarina',
    category: 'cremosa',
    description: 'Refrescante y delicada, esta paleta cremosa de mousse de mandarina se complementa con galleta sultana y cascos de mandarina.',
    price: 12000
  },
  {
    id: 3,
    name: 'Pay de limón',
    category: 'cremosa',
    description: 'El clásico sabor del pay de limón en versión paleta, con relleno de galleta, un toque de galleta sultana y ralladura de limón que realzan su frescura.',
    price: 12000
  },
  {
    id: 4,
    name: 'Coco arequipe',
    category: 'rellena',
    description: 'Siente la mezcla perfecta entre lo tropical y lo dulce con esta paleta de coco rellena de arequipe, decorada con más arequipe y coco rallado.',
    price: 13000
  },
  {
    id: 5,
    name: 'Piña hierbabuena',
    category: 'rellena',
    description: 'Una explosión refrescante de piña y hierbabuena con un corazón cremoso de Lecherita, acompañada de trozos de piña y hierbabuena finamente picada.',
    price: 13000
  },
  {
    id: 6,
    name: 'Limonada cereza',
    category: 'rellena',
    description: 'El equilibrio perfecto entre lo ácido y lo dulce: limonada de cereza rellena de Lecherita, con zumo de limón, bubols de cereza y ralladura de limón.',
    price: 13000
  },
  {
    id: 7,
    name: 'Maracumango',
    category: 'rellena',
    description: 'Una combinación tropical de maracuyá y mango con relleno de Lecherita, cubierta con salsa de maracuyá, trozos de mango maduro y bubols de maracuyá.',
    price: 13000
  },
  {
    id: 8,
    name: 'Cheesecake de frutos rojos',
    category: 'exclusiva',
    description: 'Una paleta gourmet con el sabor cremoso del cheesecake y el toque vibrante de los frutos rojos, acompañada de salsa de mora, galleta sultana y trozos de fresa.',
    price: 15000
  },
  {
    id: 9,
    name: 'Mango biche',
    category: 'exclusiva',
    description: 'La favorita de los amantes del picante: mango biche con chamoy, Tajín, salimón y trozos de mango biche. Pura actitud y sabor.',
    price: 14000
  }
]

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    // Cargar productos del localStorage si existen
    const savedProducts = localStorage.getItem('pitaya-products')
    return savedProducts ? JSON.parse(savedProducts) : initialProducts
  })

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('pitaya-products', JSON.stringify(products))
  }, [products])

  // CREATE
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now() // ID único basado en timestamp
    }
    setProducts([...products, newProduct])
    return newProduct
  }

  // READ
  const getProduct = (id) => {
    return products.find(product => product.id === id)
  }

  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category)
  }

  // UPDATE
  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ))
  }

  // DELETE
  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const value = {
    products,
    addProduct,
    getProduct,
    getProductsByCategory,
    updateProduct,
    deleteProduct
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

