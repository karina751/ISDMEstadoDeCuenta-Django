import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './UserInfo.css';

const UserInfo = ({ datosAlumno }) => {
    
    // 1. HOOKS PRIMERO
    const [showDropdown, setShowDropdown] = useState(false);
    
    // 2. VERIFICACIÓN CRÍTICA: Si el objeto no ha cargado, salimos.
    if (!datosAlumno) {
        return null; 
    }

    const handleToggle = (isOpen) => {
        setShowDropdown(isOpen);
    };

    const handleSignOut = () => {
        // SOLUCIÓN FINAL: Forzar la recarga de la ventana para reiniciar el estado de React
        if (window.confirm("¿Estás seguro de que quieres cerrar la sesión?")) {
            window.location.reload(); 
        }
    };
    
    // Desestructuración segura para evitar errores en la lectura del template
    const { nombre, apellido, dni } = datosAlumno;

    return (
        <div className="contenedor-info-usuario">
            <Dropdown show={showDropdown} onToggle={handleToggle} drop="start">
                <Dropdown.Toggle as="div" className="alternador-avatar-usuario" id="dropdown-custom-components">
                    <FontAwesomeIcon icon={faUser} />
                </Dropdown.Toggle>
                <Dropdown.Menu className="menu-desplegable-usuario">
                    <div className="cabecera-info-usuario">
                        <p className="mb-0">
                            <strong>{nombre} {apellido}</strong>
                        </p>
                        <small className="text-muted">DNI: {dni}</small>
                    </div>
                    <Dropdown.Item onClick={handleSignOut}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                        Cerrar sesión
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default UserInfo;