import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import './App.css'; // Mantenemos el CSS por si tienes estilos de tipografía o colores
import AppNavbar from './components/Navbar';
import EstadoCuenta from './components/EstadoCuenta';
import Footer from './components/Footer';
import VistaAdministrativa from './components/VistaAdministrativa'; 
import UserInfo from './components/UserInfo'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

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
                
                // Usamos la simulación para tener control total sobre los datos:
                const datosSimulados = [
                    {nombre: 'Juan', apellido: 'Perez', rol: 'Alumno', dni: '34567890', planes_de_pago: data.find(a => a.dni === '34567890')?.planes_de_pago || []},
                    {nombre: 'Maria', apellido: 'Lopez', rol: 'Alumno', dni: '12345678', planes_de_pago: data.find(a => a.dni === '12345678')?.planes_de_pago || []},
                    {nombre: 'Secretaria', apellido: 'Administrativa', rol: 'Administrativo', dni: '00000001', planes_de_pago: []}
                ];
                setAlumnos(datosSimulados);

            } catch (e) {
                console.error("Error al cargar datos de la API:", e);
                // NOTA: Si la API falla, aseguramos que los usuarios de prueba sigan funcionando
                const datosSimuladosFallback = [
                    {nombre: 'Juan', apellido: 'Perez', rol: 'Alumno', dni: '34567890', planes_de_pago: []},
                    {nombre: 'Maria', apellido: 'Lopez', rol: 'Alumno', dni: '12345678', planes_de_pago: []},
                    {nombre: 'Secretaria', apellido: 'Administrativa', rol: 'Administrativo', dni: '00000001', planes_de_pago: []}
                ];
                setAlumnos(datosSimuladosFallback);
                setError("No se pudo conectar al servidor de Django. Usando datos de prueba locales.");
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

        if (error && !usuario) {
            // Muestra el error solo si no hay usuario logueado
            return <Alert variant="danger">Error al cargar datos: {error}</Alert>;
        }

        if (showLogin || !usuario) {
            // Muestra la simulación de Login si no hay usuario
            return <LoginSimulacion handleLogin={handleLogin} />;
        }
        
        // --- LÓGICA DE ROLES: Control de flujo a la vista correcta ---
        if (usuario.rol === 'Administrativo') {
            return <VistaAdministrativa alumnos={alumnos} manejarPago={manejarPago} usuario={usuario} />;
        }
        
        // Si no es Administrativo (es Alumno)
        if (reporteActivo === 'Estado de Cuenta') {
            return <EstadoCuenta usuario={usuario} alumnos={alumnos} manejarPago={manejarPago} />;
        }
        
        return <p>Reporte no implementado.</p>;
    };

    return (
        // Usamos Container-fluid para ocupar todo el ancho de la pantalla
        // d-flex flex-column min-vh-100 asegura que la app ocupe el 100% de la altura de la vista, empujando el footer abajo
        <Container fluid className="p-0 d-flex flex-column min-vh-100">
            
            <Row className="flex-grow-1 g-0"> {/* g-0 elimina el padding entre columnas */}
                
                {/* 1. Columna del Navegador/Barra Lateral */}
                {/* Ocupa 12 columnas en móvil, pero solo 3 en pantallas medianas y 2 en grandes */}
                {usuario && (
                    <Col xs={12} md={3} lg={2} className="bg-light border-end">
                        <AppNavbar setReporteActivo={setReporteActivo} />
                    </Col>
                )}
                
                {/* 2. Columna del Contenido Principal */}
                {/* Ocupa el espacio restante (12 si no hay barra lateral, 9 o 10 si sí la hay) */}
                <Col 
                    xs={12} 
                    md={usuario ? 9 : 12} 
                    lg={usuario ? 10 : 12} 
                    className="d-flex flex-column"
                >
                    
                    {/* User Info se alinea a la derecha */}
                    {usuario && (
                        <div className="p-3 d-flex justify-content-end border-bottom">
                            <UserInfo datosAlumno={usuario} />
                        </div>
                    )}
                    
                    <main className="flex-grow-1 p-4">
                        {renderMainContent()}
                    </main>
                    
                </Col>
            </Row>
            
            {/* 3. Footer (Se muestra debajo de las columnas) */}
            <Row className="g-0">
                <Col>
                    <Footer />
                </Col>
            </Row>

        </Container>
    );
}

// ------------------------------------------------------------------
// COMPONENTE AUXILIAR: SIMULACIÓN DE LOGIN
// Mejorado para ser responsive
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
        // Usamos Col para controlar el ancho de la Card de forma responsive
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Row className="w-100 justify-content-center">
                {/* La tarjeta ocupa 10 columnas en móvil, 8 en tablet y 6 en escritorio */}
                <Col xs={10} sm={8} md={6} lg={4}>
                    <Card className="shadow-lg">
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
                </Col>
            </Row>
        </Container>
    );
};

export default App;