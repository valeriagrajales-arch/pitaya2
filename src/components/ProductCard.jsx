import React from 'react'
import './ProductCard.css'

const ProductCard = ({ product, categoryClass }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="product-card">
      <div className={`product-image-placeholder ${categoryClass}`}></div>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">{formatPrice(product.price)}</p>
      <button className="add-to-cart">Agregar al Carrito</button>
    </div>
  )
}

export default ProductCard

