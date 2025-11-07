import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <>
      <section id="inicio" className="hero">
        <div className="container">
          <h2>Pitaya - Un viaje de sabor en cada instante</h2>
          <p>Descubre la frescura y el sabor único de la pitaya, una fruta tropical que te transportará a un mundo de sabores exóticos.</p>
          <Link to="/catalogo" className="cta-button">Ver Productos</Link>
        </div>
      </section>

      <section id="sobre" className="about">
        <div className="container">
          <h2>Sobre PITAYA</h2>
          <p>Somos un emprendimiento dedicado a la producción y comercialización de pitaya. Nuestro objetivo es brindar a nuestros clientes la mejor experiencia de sabor y calidad.</p>
          <p>La pitaya, también conocida como "fruta del dragón", es una fruta tropical que ha ganado popularidad en todo el mundo por su sabor único y sus beneficios para la salud.</p>
        </div>
      </section>

      <section id="blog" className="blog">
        <div className="container">
          <h2>Nuestro Blog</h2>
          <div className="blog-grid">
            <article className="blog-post">
              <div className="blog-image-placeholder"></div>
              <h3>Beneficios de la Pitaya</h3>
              <p>Descubre los beneficios de la pitaya para tu salud y bienestar.</p>
              <a href="#" className="read-more">Leer Más</a>
            </article>
            <article className="blog-post">
              <div className="blog-image-placeholder"></div>
              <h3>Cómo consumir la Pitaya</h3>
              <p>Consejos y trucos para disfrutar al máximo de la pitaya.</p>
              <a href="#" className="read-more">Leer Más</a>
            </article>
            <article className="blog-post">
              <div className="blog-image-placeholder"></div>
              <h3>Historia de la Pitaya</h3>
              <p>Conoce la historia de esta fruta tropical que ha conquistado el mundo.</p>
              <a href="#" className="read-more">Leer Más</a>
            </article>
          </div>
        </div>
      </section>

      <section id="contacto" className="contact">
        <div className="container">
          <h2>Contacto</h2>
          <p>¿Tienes alguna pregunta o sugerencia? Contáctanos y estaremos encantados de ayudarte.</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje:</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-button">Enviar Mensaje</button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Home

