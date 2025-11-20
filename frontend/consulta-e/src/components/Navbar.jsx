import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import LogoISDM from '../assets/logohead.png'; // <--- CAMBIO REALIZADO AQUÍ
import './Navbar.css';

/**
 * Componente de la barra de navegación lateral.
 */
const AppNavbar = ({ reporteActivo, setReporteActivo }) => {
    
    // Estilo específico para la imagen del logo en el Navbar
    // Ajusto el height a 40px, asumiendo que el logo más largo (logohead) se escalará bien horizontalmente.
    const logoNavbarStyle = {
        height: '70px', 
        width: '100%', // Permite que el ancho se ajuste proporcionalmente
        marginBottom: '10px', 
        borderRadius: '5px',
        

    };
    
    const handleClick = (reporte) => {
        setReporteActivo(reporte);
    };

    return (
        // Usamos las utilidades de Bootstrap para centrar y estructurar la columna
        <Navbar expand="lg" variant="dark" className="barra-navegacion flex-column align-items-center p-3">
            
            {/* INSERTAMOS LA IMAGEN DEL LOGOHEAD */}
            <img 
                src={LogoISDM} 
                alt="Logo ISDM" 
                style={logoNavbarStyle} 
            />
            
            <Navbar.Brand className="texto-centrado ancho-completo mb-3">
                <i className="bi bi-bank me-2"></i>
                Gestión ISDM
            </Navbar.Brand>
            
            <Nav className="flex-column texto-centrado ancho-completo">
                {/* ÚNICO ENLACE: Estado de Cuenta (funciona como Inicio/Recargar) */}
                <Nav.Link
                    className={`enlace-nav ${reporteActivo === 'Estado de Cuenta' ? 'activo' : ''}`}
                    onClick={() => handleClick('Estado de Cuenta')}
                >
                    <i className="bi bi-file-earmark-text-fill me-2"></i>
                    Estado de cuenta
                </Nav.Link>
                
            </Nav>
        </Navbar>
    );
};

export default AppNavbar;