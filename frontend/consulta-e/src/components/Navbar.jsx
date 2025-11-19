import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './Navbar.css';

/**
 * Componente de la barra de navegación lateral.
 * Simplificado para mostrar solo "Estado de cuenta" que simula un "Inicio" o recarga.
 */
const AppNavbar = ({ reporteActivo, setReporteActivo }) => {
    
    const handleClick = (reporte) => {
        // Al hacer clic, simplemente forzamos la recarga de la vista principal
        // y aseguramos que el estado de la aplicación se reinicie a la vista principal.
        setReporteActivo(reporte);
    };

    return (
        <Navbar expand="lg" variant="dark" className="barra-navegacion flex-column align-items-center">
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