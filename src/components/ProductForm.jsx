import React, { useState, useEffect } from 'react'
import { useProducts } from '../context/ProductContext'
import './ProductForm.css'

const ProductForm = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProducts()
  const [formData, setFormData] = useState({
    name: '',
    category: 'cremosa',
    description: '',
    price: ''
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'cremosa',
        description: product.description || '',
        price: product.price || ''
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.price) {
      alert('Por favor completa todos los campos')
      return
    }

    if (product) {
      // Actualizar producto existente
      updateProduct(product.id, formData)
    } else {
      // Crear nuevo producto
      addProduct(formData)
    }

    // Resetear formulario y cerrar
    setFormData({
      name: '',
      category: 'cremosa',
      description: '',
      price: ''
    })
    onClose()
  }

  return (
    <div className="product-form">
      <h3>{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre del Producto *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Fresas con crema"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="cremosa">Cremosa</option>
            <option value="rellena">Rellena</option>
            <option value="exclusiva">Exclusiva</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe el producto..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio (COP) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="100"
            placeholder="12000"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            {product ? 'Actualizar' : 'Crear'} Producto
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm

