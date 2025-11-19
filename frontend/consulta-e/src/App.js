import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import './App.css';
import AppNavbar from './components/Navbar';
import EstadoCuenta from './components/EstadoCuenta';
import Footer from './components/Footer';
import VistaAdministrativa from './components/VistaAdministrativa'; 
import UserInfo from './components/UserInfo'; // Importado para usarlo aquí

const API_URL = 'http://127.0.0.1:8000/app/api/alumnos/';

function App() {
    const [usuario, setUsuario] = useState(null); 
    const [alumnos, setAlumnos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [reporteActivo, setReporteActivo] = useState('Estado de Cuenta');
    
    const [showLogin, setShowLogin] = useState(true);

    // 1. Cargar todos los alumnos al iniciar
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const respuesta = await fetch(API_URL);
                if (!respuesta.ok) {
                    throw new Error(`HTTP error! status: ${respuesta.status}`);
                }
                const data = await respuesta.json();
                // NOTA: En un proyecto real, usarías los datos de la API. Aquí usamos datos simulados para estabilidad.
                // setAlumnos(data); 
                
                // Usamos la simulación para tener control total sobre los datos:
                const datosSimulados = [
                    {nombre: 'Juan', apellido: 'Perez', rol: 'Alumno', dni: '34567890', planes_de_pago: data.find(a => a.dni === '34567890')?.planes_de_pago || []},
                    {nombre: 'Maria', apellido: 'Lopez', rol: 'Alumno', dni: '12345678', planes_de_pago: data.find(a => a.dni === '12345678')?.planes_de_pago || []},
                    {nombre: 'Secretaria', apellido: 'Administrativa', rol: 'Administrativo', dni: '00000001', planes_de_pago: []}
                ];
                setAlumnos(datosSimulados);

            } catch (e) {
                console.error("Error al cargar datos de la API:", e);
                setError("No se pudo conectar al servidor de Django.");
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);


    // 2. Función de Login por DNI
    const handleLogin = (dniBuscado) => {
        const user = alumnos.find(a => a.dni === dniBuscado);
        if (user) {
            setUsuario(user);
            setShowLogin(false);
            return true;
        }
        return false;
    };

    const manejarPago = (importePagado) => {
        alert(`Se ha intentado realizar un pago por $${importePagado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`);
    };

    // 3. Renderización del contenido principal
    const renderMainContent = () => {
        if (cargando) {
            return <p>Cargando datos del servidor...</p>;
        }

        if (error) {
            return <p style={{ color: 'red' }}>Error al cargar datos: {error}</p>;
        }

        if (showLogin || !usuario) {
            // Muestra la simulación de Login si no hay usuario
            return <LoginSimulacion handleLogin={handleLogin} />;
        }
        
        // --- LÓGICA DE ROLES: Control de flujo a la vista correcta ---
        if (usuario.rol === 'Administrativo') {
            // Si es Administrativo, renderizamos directamente el BUSCADOR
            return <VistaAdministrativa alumnos={alumnos} manejarPago={manejarPago} usuario={usuario} />;
        }
        
        // Si no es Administrativo (es Alumno)
        if (reporteActivo === 'Estado de Cuenta') {
            return <EstadoCuenta usuario={usuario} alumnos={alumnos} manejarPago={manejarPago} />;
        }
        
        return <p>Reporte no implementado.</p>;
    };

    return (
        <div className="contenedor-app">
            <div className="columna-navegador">
                {/* 1. Navbar siempre se muestra aquí */}
                {usuario && <AppNavbar setReporteActivo={setReporteActivo} />}
            </div>
            
            <div className="contenido-principal">
                
                {/* 2. USER INFO CENTRALIZADO AQUÍ PARA QUE NO CAUSE LENTITUD */}
                {usuario && (
                    <div className="p-3 d-flex justify-content-end">
                        <UserInfo datosAlumno={usuario} />
                    </div>
                )}
                
                <main className="flex-grow-1 p-4">
                    {renderMainContent()}
                </main>
                <Footer />
            </div>
        </div>
    );
}

// ------------------------------------------------------------------
// COMPONENTE AUXILIAR: SIMULACIÓN DE LOGIN
// ------------------------------------------------------------------
const LoginSimulacion = ({ handleLogin }) => {
    const [dni, setDni] = useState('');
    const [mensaje, setMensaje] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (handleLogin(dni.trim())) {
            let userRole = '';
            if (dni.trim() === '00000001') {
                userRole = 'Secretaria Administrativa';
            } else {
                userRole = 'Alumno';
            }
            setMensaje({ type: 'success', text: `Login como ${userRole} exitoso.` });
        } else {
            setMensaje({ type: 'danger', text: 'DNI de prueba incorrecto o usuario no encontrado.' });
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '18rem' }} className="shadow-lg">
                <Card.Body>
                    <Card.Title className="text-center text-primary">Simulación de Login</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-center">Ingresa DNI para acceder</Card.Subtitle>
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>DNI (Usuario)</Form.Label>
                            <Form.Control
                                type="text"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                placeholder="Ej: 34567890 o 00000001"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Acceder
                        </Button>
                    </Form>
                    
                    {mensaje && <Alert variant={mensaje.type} className="mt-3">{mensaje.text}</Alert>}

                    <div className="mt-3">
                        <small className="text-muted">DNIs de prueba:</small>
                        <ul>
                            <li>Juan Perez (Alumno): **34567890**</li>
                            <li>Maria Lopez (Alumno): **12345678**</li>
                            <li>Secretaria (Admin): **00000001**</li>
                        </ul>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default App;