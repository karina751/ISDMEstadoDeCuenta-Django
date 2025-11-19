import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import CuotasPendientes from './CuotasPendientes';
import HistorialDePagos from './HistorialDePagos';
// import UserInfo from './UserInfo'; <-- ELIMINADO para evitar duplicidad
import './EstadoCuenta.css';

const EstadoCuenta = ({ usuario, alumnos, manejarPago }) => {
    
    // 1. Acceder a la nueva propiedad de la API: planes_de_pago
    // NOTA: La lógica de rol Administrativo ya fue movida a App.js
    const todasLasCuotas = usuario.planes_de_pago || [];

    // 2. Filtrar las cuotas
    const cuotasVencidas = todasLasCuotas.filter(cuota => cuota.estado === 'Vencida');
    const cuotasImpagas = todasLasCuotas.filter(cuota => cuota.estado === 'Vencida' || cuota.estado === 'Pendiente');
    const cuotasPagadas = todasLasCuotas.filter(cuota => cuota.estado === 'Pagada');

    // 3. CALCULAR LA DEUDA TOTAL: Sumar solo VENCIDAS usando el importe_total_con_recargo
    const deudaTotal = cuotasVencidas.reduce((total, cuota) => 
        total + parseFloat(cuota.importe_total_con_recargo || 0), 0);
    
    const cuotasVencidasCount = cuotasVencidas.length; 

    return (
        <Container fluid>
            {/* UserInfo se renderiza en App.js (fuera de este componente) */}
            
            <Row className="mb-4 text-center">
                <Col md={12}>
                    <h2 className="titulo-seccion mb-4">Estado de Cuenta del Alumno</h2>
                </Col>
            </Row>

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

export default EstadoCuenta;
