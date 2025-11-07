import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <div className="top-bar">
        <span className="top-bar-text">pitaya</span>
      </div>
      <header className="header">
        <div className="container">
          <div className="logo">
            <Link to="/">
              <h1>pitaya</h1>
            </Link>
          </div>
          <nav className="nav">
            <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
              <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
              <li><Link to="/#sobre" onClick={() => setIsMenuOpen(false)}>Sobre PITAYA</Link></li>
              <li><Link to="/catalogo" onClick={() => setIsMenuOpen(false)}>Productos</Link></li>
              <li><Link to="/#blog" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
              <li><Link to="/#contacto" onClick={() => setIsMenuOpen(false)}>Contacto</Link></li>
              <li><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link></li>
            </ul>
            <button 
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header

