import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import LogoISDM from '../assets/logohead.png';
import './Navbar.css';

/**
 * Componente de la barra de navegación lateral.
 */
const AppNavbar = ({ reporteActivo, setReporteActivo }) => {
    
    
    const logoNavbarStyle = {
        height: '70px', 
        width: '100%', 
        marginBottom: '10px', 
        borderRadius: '5px',
        

    };
    
    const handleClick = (reporte) => {
        setReporteActivo(reporte);
    };

    return (
        <Navbar expand="lg" variant="dark" className="barra-navegacion flex-column align-items-center p-3">
            
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