import React, { useState } from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa'; // Importamos los iconos
import LogoISDM from '../assets/logo_isdm.png'; // Asumimos que la ruta del logo es correcta

/**
 * Componente funcional para el pie de página.
 * Incluye el logo y muestra el año actual de forma dinámica.
 */
const Footer = () => {
  // Estado para almacenar el año actual.
  const [currentYear] = useState(new Date().getFullYear());
  
  // Estilos del contenedor principal del footer (Ajustado a color más oscuro/borgoña)
  const footerStyle = {
    backgroundColor: '#5D021C', // Borgoña oscuro, similar al logo y al color principal de la app
    color: 'white',
    padding: '15px 0',
    textAlign: 'center',
    width: '100%',
    boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.2)',
    fontSize: '0.85em',
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',
    gap: '5px', 
    marginTop: 'auto',  
  };
  
  // Estilos del contenedor del logo y texto de copyright
  const copyrightContainerStyle = {
    display: 'flex',
    alignItems: 'center', 
    gap: '10px', 
  };
  
  // Estilo específico para la imagen del logo
  const logoStyle = {
    height: '40px', // Reducido ligeramente para mejor estética
    width: 'auto',
  };
  
  // Estilos para los iconos/enlaces de redes
  const iconLinkStyle = {
    color: 'white', // Color del icono
    textDecoration: 'none',
    margin: '0 10px',
    fontSize: '1.25em',
    transition: 'color 0.2s',
  };

  return (
    <footer style={footerStyle}>
      
      {/* Contenedor del Logo y Texto de Copyright */}
      <div style={copyrightContainerStyle}>
          <img 
              src={LogoISDM} 
              alt="Logo ISDM" 
              style={logoStyle} 
          />
          <p style={{ margin: 0 }}>
            © {currentYear} Instituto Superior del Milagro.
          </p>
      </div>

      {/* Contenedor de Iconos Legales/Contacto */}
      <div>
        {/* Icono de Facebook */}
        <a 
          href="https://www.facebook.com/InstitutoSuperiorMilagrotica" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={iconLinkStyle}
        >
          <FaFacebook />
        </a>
        
        {/* Separador (opcional, pero se ve más limpio sin él en iconos) */}
        
        {/* Icono de Instagram */}
        <a 
          href="https://www.instagram.com/institutosuperiormilagro/" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={iconLinkStyle}
        >
          <FaInstagram />
        </a>
        
        <p style={{ margin: '5px 0 0 0' }}>
          Alvarado 951, Salta Capital
        </p>
      </div>
    </footer>
  );
};

export default Footer;