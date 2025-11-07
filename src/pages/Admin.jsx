import React, { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import ProductForm from '../components/ProductForm'
import './Admin.css'

const Admin = () => {
  const { products, deleteProduct, getProduct } = useProducts()
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleEdit = (productId) => {
    const product = getProduct(productId)
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProduct(productId)
    }
  }

  const handleNewProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getCategoryLabel = (category) => {
    const labels = {
      cremosa: 'CREMOSA',
      rellena: 'RELLENA',
      exclusiva: 'EXCLUSIVA'
    }
    return labels[category] || category.toUpperCase()
  }

  return (
    <section className="admin-section">
      <div className="container">
        <div className="admin-header">
          <h2 className="admin-title">Panel de Administración</h2>
          <button className="btn-new-product" onClick={handleNewProduct}>
            + Nuevo Producto
          </button>
        </div>

        {showForm && (
          <div className="form-overlay">
            <div className="form-container">
              <button className="close-button" onClick={handleFormClose}>×</button>
              <ProductForm 
                product={editingProduct} 
                onClose={handleFormClose}
              />
            </div>
          </div>
        )}

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No hay productos. Crea tu primer producto.
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="product-name">{product.name}</td>
                    <td>
                      <span className={`category-badge category-${product.category}`}>
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="product-description">
                      {product.description.length > 50 
                        ? `${product.description.substring(0, 50)}...` 
                        : product.description}
                    </td>
                    <td className="product-price">{formatPrice(product.price)}</td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(product.id)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Productos</h3>
            <p className="stat-number">{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>Cremosas</h3>
            <p className="stat-number">
              {products.filter(p => p.category === 'cremosa').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Rellenas</h3>
            <p className="stat-number">
              {products.filter(p => p.category === 'rellena').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Exclusivas</h3>
            <p className="stat-number">
              {products.filter(p => p.category === 'exclusiva').length}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Admin

