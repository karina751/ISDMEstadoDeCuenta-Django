import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import CuotasPendientes from './CuotasPendientes'; 
import HistorialDePagos from './HistorialDePagos';
import './EstadoCuenta.css'; 

// ====================================================================
// COMPONENTE PRINCIPAL: VISTA ADMINISTRATIVA
// ====================================================================
const VistaAdministrativa = ({ alumnos, manejarPago, usuario }) => { 
    const [busqueda, setBusqueda] = useState('');
    const [alumnoEncontrado, setAlumnoEncontrado] = useState(null);
    const [mensajeError, setMensajeError] = useState(null);

    const manejarBusqueda = (event) => {
        event.preventDefault();
        setMensajeError(null);
        setAlumnoEncontrado(null);
        
        const busquedaLimpia = busqueda.trim().toLowerCase();

        const alumnoBuscado = alumnos.find(a =>
            a.dni === busquedaLimpia || 
            `${a.nombre.toLowerCase()} ${a.apellido.toLowerCase()}`.includes(busquedaLimpia)
        );

        if (alumnoBuscado) {
            setAlumnoEncontrado(alumnoBuscado);
        } else {
            setMensajeError('No se encontró un alumno con ese DNI o nombre.');
        }
    };

    return (
        <Container fluid>
            
            {/* LÓGICA DE CONMUTACIÓN DE VISTAS */}
            {alumnoEncontrado ? (
                // Vista 1: Mostrar el estado de cuenta del alumno buscado
                <div className="mt-5">
                    <EstadoDeCuentaAlumnoEncontrado 
                        usuario={alumnoEncontrado} 
                        manejarPago={manejarPago} 
                    />
                    {/* Botón para volver a la búsqueda */}
                    <Button 
                        variant="btn btn-primary btn-lg" 
                        onClick={() => setAlumnoEncontrado(null)} 
                        className="mt-3"
                    >
                        ← Volver al Buscador
                    </Button>
                </div>
            ) : (
                // Vista 2: Mostrar el formulario de búsqueda
                <>
                    <Row className="mb-4 text-center">
                        <Col md={12}>
                            <h2 className="titulo-seccion mb-4">Buscador de Alumnos</h2>
                        </Col>
                    </Row>
                    {/* FORMULARIO DE BÚSQUEDA */}
                    <Row>
                        <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                            <Card className="card-buscador-admin shadow-lg p-4">
                                <Card.Body>
                                    <h5 className="mb-4 text-center">Consulta de Estado de Cuenta por Alumno</h5>
                                    <Form onSubmit={manejarBusqueda}>
                                        <Form.Group className="mb-4" controlId="formDni">
                                            <Form.Label>Ingresa DNI o Nombre Completo del Alumno</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Ej: 34567890 o Juan Pérez" 
                                                value={busqueda}
                                                onChange={(e) => setBusqueda(e.target.value)}
                                            />
                                        </Form.Group>
                                        <div className="d-grid gap-2">
                                            <Button variant="primary" type="submit">
                                                Buscar
                                            </Button>
                                        </div>
                                    </Form>
                                    {mensajeError && <Alert variant="danger" className="mt-4">{mensajeError}</Alert>}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

// ====================================================================
// COMPONENTE AUXILIAR: MUESTRA EL ESTADO DE CUENTA DEL ALUMNO BUSCADO
// ====================================================================
const EstadoDeCuentaAlumnoEncontrado = ({ usuario, manejarPago }) => {
    // 1. Lógica de cálculo y filtrado 
    const todasLasCuotas = usuario.planes_de_pago || [];

    const cuotasVencidas = todasLasCuotas.filter(cuota => cuota.estado === 'Vencida');
    const cuotasImpagas = todasLasCuotas.filter(cuota => cuota.estado === 'Vencida' || cuota.estado === 'Pendiente');
    const cuotasPagadas = todasLasCuotas.filter(cuota => cuota.estado === 'Pagada');
    
    // 2. Deuda Total: Sumar SOLO VENCIDAS 
    const deudaTotal = cuotasVencidas.reduce((total, cuota) => 
        total + parseFloat(cuota.importe_total_con_recargo || 0), 0);
    
    const cuotasVencidasCount = cuotasVencidas.length;

    return (
        <Container fluid>
            <Row className="mb-4 text-center">
                <Col md={12}>
                    <h2 className="titulo-seccion mb-2">Estado de Cuenta</h2>
                    <h4 className="subtitulo-seccion mb-4">{usuario.nombre} {usuario.apellido} - DNI: {usuario.dni}</h4> 
                </Col>
            </Row>

            {/* Resumen de Deuda y Vencidas */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="resumen-card tarjeta-deuda shadow-sm text-center">
                        <Card.Body>
                            <h5 className="mb-0">Deuda Total</h5>
                            <h3 className="mb-0">${deudaTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className={`resumen-card shadow-sm text-center ${
                        cuotasVencidasCount === 0 ? 'tarjeta-sin-vencidas' :
                        cuotasVencidasCount === 1 ? 'tarjeta-una-vencida' : 'tarjeta-mas-de-una-vencida'
                    }`}>
                        <Card.Body>
                            <h5 className="mb-0">Cuotas Vencidas</h5>
                            <h3 className="mb-0">{cuotasVencidasCount}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Tablas de Cuotas */}
            <Row className="mt-5">
                <Col md={12}>
                    <CuotasPendientes cuotasImpagas={cuotasImpagas} manejarPago={manejarPago} />
                </Col>
            </Row>

            <Row className="mt-5">
                <Col md={12}>
                    <HistorialDePagos 
                        cuotasPagadas={cuotasPagadas} 
                        usuario={usuario}
                        cuotasImpagas={cuotasImpagas} 
                        deudaTotal={deudaTotal}
                        cuotasVencidasCount={cuotasVencidasCount}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default VistaAdministrativa;