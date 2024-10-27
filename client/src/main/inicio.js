import React from 'react';
import styles from './inicio.module.css';
import image from '../Recursos/img/image2.png';

function Inicio() {
  return (
    <div className={styles.inicioContainer}>
      <header className={styles.header}>
        <h1>Bienvenido a ProyectosMS</h1>
        <p>Transformamos tus ideas en soluciones efectivas.</p>
        <a href="#about" className={styles.ctaButton}>Descubre Más</a>
      </header>

      <section id="about" className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <h2>Sobre Nosotros</h2>
          <p>
            En ProyectosMS, trabajamos de la mano con nuestros clientes para
            desarrollar proyectos innovadores y personalizados. Nuestro equipo está
            comprometido en proporcionar soluciones que optimizan procesos y generan
            valor.
          </p>
          <img
            src={image}
            alt="Equipo de trabajo"
            className={styles.teamImage}
          />
        </div>
      </section>

      <section className={styles.servicesSection}>
        <h2>Nuestros Servicios</h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <h3>Gestión de Proyectos</h3>
            <p>
              Administramos cada etapa de tu proyecto con un enfoque ágil y efectivo.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <h3>Desarrollo de Software</h3>
            <p>
              Creamos soluciones a medida, utilizando las últimas tecnologías.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <h3>Consultoría</h3>
            <p>
              Brindamos asesoramiento experto para mejorar tu rendimiento empresarial.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.projectsSection}>
        <h2>Proyectos Destacados</h2>
        <div className={styles.projectsList}>
          <div className={styles.projectCard}>
            <h3>Peckytos</h3>
            <p>Desarrollo de un sitio web para una heladería, con acceso al menú a través de código QR y servicio de delivery</p>
          </div>
          <div className={styles.projectCard}>
            <h3>Aquatour</h3>
            <p>App móvil para la planificación de tours a través de distintas playas del pacífico</p>
          </div>
          <div className={styles.projectCard}>
            <h3>Inmobiliaria FIDES</h3>
            <p>Blog en línea en el cual se da a conocer el trabajo y servicios de la inmobiliaria</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 ProyectosMS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Inicio;
