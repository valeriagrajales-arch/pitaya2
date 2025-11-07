import React from 'react'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import './Catalog.css'

const Catalog = () => {
  const { getProductsByCategory } = useProducts()
  
  const cremosas = getProductsByCategory('cremosa')
  const rellenas = getProductsByCategory('rellena')
  const exclusivas = getProductsByCategory('exclusiva')

  const CategorySection = ({ title, products, categoryClass }) => (
    <div className="category-section">
      <h3 className="category-title">{title}</h3>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} categoryClass={categoryClass} />
        ))}
      </div>
    </div>
  )

  return (
    <section className="catalog-section">
      <div className="container">
        <h2 className="catalog-title">Nuestro Catálogo</h2>
        <p className="catalog-subtitle">Descubre nuestras deliciosas paletas artesanales</p>

        <CategorySection title="CREMOSAS" products={cremosas} categoryClass="cremosa" />
        <CategorySection title="RELLENAS" products={rellenas} categoryClass="rellena" />
        <CategorySection title="EXCLUSIVAS" products={exclusivas} categoryClass="exclusiva" />
      </div>
    </section>
  )
}

export default Catalog

